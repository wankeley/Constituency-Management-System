const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@constituency.gov' },
        update: {},
        create: {
            email: 'admin@constituency.gov',
            password: hashedPassword,
            name: 'Admin User',
            role: 'ADMIN',
            location: 'Central District',
            phone: '+233 20 123 4567',
        },
    });

    // Create staff user
    const staff = await prisma.user.upsert({
        where: { email: 'staff@constituency.gov' },
        update: {},
        create: {
            email: 'staff@constituency.gov',
            password: hashedPassword,
            name: 'Staff Member',
            role: 'STAFF',
            location: 'North District',
            phone: '+233 20 765 4321',
        },
    });

    // Create sample constituents
    const locations = ['North District', 'South District', 'East District', 'West District', 'Central District'];
    const ages = [25, 32, 45, 28, 55, 38, 42, 30, 22, 60];

    for (let i = 1; i <= 10; i++) {
        await prisma.user.upsert({
            where: { email: `constituent${i}@example.com` },
            update: {},
            create: {
                email: `constituent${i}@example.com`,
                password: hashedPassword,
                name: `Constituent ${i}`,
                role: 'CONSTITUENT',
                voterId: `VOT${100000 + i}`,
                age: ages[i - 1],
                location: locations[i % locations.length],
                phone: `+233 24 ${String(i).padStart(3, '0')} ${String(i * 111).padStart(4, '0')}`,
            },
        });
    }

    // Create sample poll
    await prisma.poll.upsert({
        where: { id: 1 },
        update: {},
        create: {
            title: 'Community Development Priority',
            description: 'What should be our top priority for community development this year?',
            options: JSON.stringify(['Road Infrastructure', 'Healthcare Facilities', 'Education', 'Water Supply', 'Electricity']),
            isActive: true,
            createdBy: admin.id,
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
    });

    // Create sample event
    await prisma.event.upsert({
        where: { id: 1 },
        update: {},
        create: {
            title: 'Town Hall Meeting',
            description: 'Join us for our quarterly town hall meeting to discuss community issues and upcoming projects.',
            location: 'Community Center, Central District',
            eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            createdBy: admin.id,
        },
    });

    // Create sample announcement
    await prisma.announcement.upsert({
        where: { id: 1 },
        update: {},
        create: {
            title: 'Welcome to the Constituency Portal',
            content: 'We are excited to launch our new digital platform for better community engagement. Stay connected, report issues, participate in polls, and attend events!',
            createdBy: admin.id,
        },
    });

    // Create sample issue
    await prisma.issue.upsert({
        where: { id: 1 },
        update: {},
        create: {
            title: 'Pothole on Main Street',
            description: 'Large pothole near the intersection of Main Street and Oak Avenue causing traffic issues.',
            status: 'OPEN',
            reportedBy: 3, // constituent1
        },
    });

    console.log('✅ Database seeded successfully!');
    console.log('📧 Admin login: admin@constituency.gov / admin123');
    console.log('📧 Staff login: staff@constituency.gov / admin123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
