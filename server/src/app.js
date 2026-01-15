const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'constituency-secret-key-2024';

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Auth middleware
const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Not authenticated' });

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) return res.status(401).json({ error: 'User not found' });

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// RBAC middleware - stricter role checking
const requireRole = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
};

// Admin-only middleware
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// Staff and Admin middleware (both can access)
const staffOrAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'STAFF') {
        return res.status(403).json({ error: 'Staff or Admin access required' });
    }
    next();
};

// ============== AUTH ROUTES ==============
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, voterId, age, location, phone } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                voterId,
                age: age ? parseInt(age) : null,
                location,
                phone,
                role: 'CONSTITUENT',
            },
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.json({ user: { ...user, password: undefined }, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.json({ user: { ...user, password: undefined }, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
});

app.get('/api/auth/me', authenticate, (req, res) => {
    res.json({ user: { ...req.user, password: undefined } });
});

// ============== USER ROUTES (ADMIN ONLY) ==============
app.get('/api/users', authenticate, staffOrAdmin, async (req, res) => {
    const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true, voterId: true, age: true, location: true, phone: true, createdAt: true },
    });
    res.json(users);
});

app.get('/api/users/stats', authenticate, staffOrAdmin, async (req, res) => {
    const [total, byRole, byLocation, byAge] = await Promise.all([
        prisma.user.count(),
        prisma.user.groupBy({ by: ['role'], _count: true }),
        prisma.user.groupBy({ by: ['location'], _count: true, where: { location: { not: null } } }),
        prisma.user.findMany({ select: { age: true }, where: { age: { not: null } } }),
    ]);

    // Age group distribution
    const ageGroups = { '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '56+': 0 };
    byAge.forEach(({ age }) => {
        if (age <= 25) ageGroups['18-25']++;
        else if (age <= 35) ageGroups['26-35']++;
        else if (age <= 45) ageGroups['36-45']++;
        else if (age <= 55) ageGroups['46-55']++;
        else ageGroups['56+']++;
    });

    res.json({ total, byRole, byLocation, ageGroups });
});

// ADMIN ONLY - Change user roles
app.patch('/api/users/:id/role', authenticate, adminOnly, async (req, res) => {
    const { role } = req.body;

    // Validate role
    if (!['ADMIN', 'STAFF', 'CONSTITUENT'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await prisma.user.update({
        where: { id: parseInt(req.params.id) },
        data: { role },
    });
    res.json({ ...user, password: undefined });
});

// ============== POLL ROUTES ==============
app.get('/api/polls', authenticate, async (req, res) => {
    const polls = await prisma.poll.findMany({
        include: {
            creator: { select: { name: true } },
            _count: { select: { responses: true } },
        },
        orderBy: { createdAt: 'desc' },
    });
    res.json(polls);
});

// Staff and Admin can create polls
app.post('/api/polls', authenticate, staffOrAdmin, async (req, res) => {
    const { title, description, options, endDate } = req.body;
    const poll = await prisma.poll.create({
        data: {
            title,
            description,
            options: JSON.stringify(options),
            endDate: endDate ? new Date(endDate) : null,
            createdBy: req.user.id,
        },
    });
    res.json(poll);
});

app.get('/api/polls/:id', authenticate, async (req, res) => {
    const poll = await prisma.poll.findUnique({
        where: { id: parseInt(req.params.id) },
        include: {
            responses: { include: { user: { select: { name: true } } } },
        },
    });

    // Check if user has voted
    const userVote = poll?.responses.find(r => r.userId === req.user.id);
    res.json({ ...poll, userVote: userVote?.selectedOption });
});

app.post('/api/polls/:id/vote', authenticate, async (req, res) => {
    const { selectedOption } = req.body;
    const pollId = parseInt(req.params.id);

    try {
        const response = await prisma.pollResponse.create({
            data: { pollId, userId: req.user.id, selectedOption },
        });
        res.json(response);
    } catch (error) {
        res.status(400).json({ error: 'Already voted' });
    }
});

app.get('/api/polls/:id/results', authenticate, async (req, res) => {
    const poll = await prisma.poll.findUnique({
        where: { id: parseInt(req.params.id) },
        include: { responses: true },
    });

    const options = JSON.parse(poll.options);
    const results = options.map((option, index) => ({
        option,
        votes: poll.responses.filter(r => r.selectedOption === index).length,
    }));

    res.json({ poll, results, totalVotes: poll.responses.length });
});

// ADMIN ONLY - Delete poll
app.delete('/api/polls/:id', authenticate, adminOnly, async (req, res) => {
    await prisma.poll.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
});

// ============== EVENT ROUTES ==============
app.get('/api/events', authenticate, async (req, res) => {
    const events = await prisma.event.findMany({
        include: {
            creator: { select: { name: true } },
            _count: { select: { rsvps: true } },
        },
        orderBy: { eventDate: 'asc' },
    });
    res.json(events);
});

// Staff and Admin can create events
app.post('/api/events', authenticate, staffOrAdmin, async (req, res) => {
    const { title, description, location, eventDate } = req.body;
    const event = await prisma.event.create({
        data: {
            title,
            description,
            location,
            eventDate: new Date(eventDate),
            createdBy: req.user.id,
        },
    });
    res.json(event);
});

app.get('/api/events/:id', authenticate, async (req, res) => {
    const event = await prisma.event.findUnique({
        where: { id: parseInt(req.params.id) },
        include: {
            rsvps: { include: { user: { select: { name: true, email: true } } } },
        },
    });

    const userRsvp = event?.rsvps.find(r => r.userId === req.user.id);
    res.json({ ...event, userRsvp: userRsvp?.status });
});

app.post('/api/events/:id/rsvp', authenticate, async (req, res) => {
    const { status } = req.body;
    const eventId = parseInt(req.params.id);

    const rsvp = await prisma.eventRSVP.upsert({
        where: { eventId_userId: { eventId, userId: req.user.id } },
        update: { status },
        create: { eventId, userId: req.user.id, status },
    });
    res.json(rsvp);
});

// ADMIN ONLY - Delete event
app.delete('/api/events/:id', authenticate, adminOnly, async (req, res) => {
    await prisma.event.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
});

// ============== ISSUE ROUTES ==============
app.get('/api/issues', authenticate, async (req, res) => {
    // Constituents only see their own issues, Staff/Admin see all
    const where = req.user.role === 'CONSTITUENT' ? { reportedBy: req.user.id } : {};
    const issues = await prisma.issue.findMany({
        where,
        include: {
            reporter: { select: { name: true } },
            assignee: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
    });
    res.json(issues);
});

app.post('/api/issues', authenticate, async (req, res) => {
    const { title, description } = req.body;
    const issue = await prisma.issue.create({
        data: { title, description, reportedBy: req.user.id },
    });
    res.json(issue);
});

// Staff and Admin can update issues
app.patch('/api/issues/:id', authenticate, staffOrAdmin, async (req, res) => {
    const { status, assignedTo } = req.body;
    const issue = await prisma.issue.update({
        where: { id: parseInt(req.params.id) },
        data: { status, assignedTo },
    });
    res.json(issue);
});

app.get('/api/issues/stats', authenticate, staffOrAdmin, async (req, res) => {
    const stats = await prisma.issue.groupBy({
        by: ['status'],
        _count: true,
    });
    res.json(stats);
});

// ============== ANNOUNCEMENT ROUTES ==============
app.get('/api/announcements', authenticate, async (req, res) => {
    const announcements = await prisma.announcement.findMany({
        include: { creator: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
    });
    res.json(announcements);
});

// Staff and Admin can create announcements
app.post('/api/announcements', authenticate, staffOrAdmin, async (req, res) => {
    const { title, content } = req.body;
    const announcement = await prisma.announcement.create({
        data: { title, content, createdBy: req.user.id },
    });
    res.json(announcement);
});

// ADMIN ONLY - Delete announcements
app.delete('/api/announcements/:id', authenticate, adminOnly, async (req, res) => {
    await prisma.announcement.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
});

// ============== ANALYTICS ROUTES (Staff and Admin) ==============
app.get('/api/analytics/dashboard', authenticate, staffOrAdmin, async (req, res) => {
    const [users, polls, events, issues, announcements] = await Promise.all([
        prisma.user.count(),
        prisma.poll.count(),
        prisma.event.count(),
        prisma.issue.groupBy({ by: ['status'], _count: true }),
        prisma.announcement.count(),
    ]);

    const recentActivity = await prisma.issue.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { reporter: { select: { name: true } } },
    });

    res.json({
        counts: { users, polls, events, announcements },
        issuesByStatus: issues,
        recentActivity,
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});