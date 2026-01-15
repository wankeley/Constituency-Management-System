# Constituency Management System - Project Analysis

## Project Overview
A modern, full-stack web application for managing constituency operations, enabling better communication between elected representatives and their constituents. Built with Next.js 14 (frontend) and Express.js (backend) using SQLite database with Prisma ORM.

**Current Status**: Functional core implementation with all major features implemented.

---

## Tech Stack

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts (for analytics visualizations)
- **Icons**: Lucide React
- **State Management**: React hooks with localStorage for tokens

### Backend
- **Framework**: Express.js 4.18
- **Authentication**: JWT (jsonwebtoken) with bcrypt hashing
- **Database**: SQLite 3 (file-based)
- **ORM**: Prisma 5.10
- **Middleware**: CORS, express.json, cookie-parser

### Database
- Provider: SQLite (dev.db)
- Migrations: Managed by Prisma
- Seed data: Included (prisma/seed.js)

---

## Database Schema

### Core Models

**User**
- id (Int, PK, auto-increment)
- email (String, unique)
- password (String, hashed with bcrypt)
- name (String)
- role (String, default: "CONSTITUENT") - Enum: ADMIN, STAFF, CONSTITUENT
- voterId (String, optional)
- age (Int, optional)
- location (String, optional)
- phone (String, optional)
- createdAt, updatedAt (Timestamps)
- Relations: pollsCreated, pollResponses, eventsCreated, eventRsvps, issuesReported, issuesAssigned, announcements

**Poll**
- id (Int, PK)
- title (String)
- description (String, optional)
- options (String - JSON array of poll options)
- isActive (Boolean, default: true)
- endDate (DateTime, optional)
- createdBy (Int, FK to User)
- creator (User relation)
- responses (PollResponse[])

**PollResponse**
- id (Int, PK)
- pollId (Int, FK)
- userId (Int, FK)
- selectedOption (Int - index of selected option)
- createdAt (DateTime)
- Unique constraint: [pollId, userId]

**Event**
- id (Int, PK)
- title (String)
- description (String, optional)
- location (String)
- eventDate (DateTime)
- createdBy (Int, FK)
- creator (User relation)
- rsvps (EventRSVP[])

**EventRSVP**
- id (Int, PK)
- eventId (Int, FK)
- userId (Int, FK)
- status (String, default: "attending") - Enum: attending, maybe, declined
- createdAt (DateTime)
- Unique constraint: [eventId, userId]

**Issue**
- id (Int, PK)
- title (String)
- description (String)
- status (String, default: "OPEN") - Enum: OPEN, IN_PROGRESS, RESOLVED
- reportedBy (Int, FK)
- assignedTo (Int, FK, optional)
- reporter (User relation)
- assignee (User relation, optional)
- createdAt, updatedAt (Timestamps)

**Announcement**
- id (Int, PK)
- title (String)
- content (String)
- createdBy (Int, FK)
- creator (User relation)
- createdAt (DateTime)

---

## API Routes & Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (CONSTITUENT role)
  - Body: { email, password, name, voterId, age, location, phone }
- `POST /api/auth/login` - Login and get JWT token
  - Body: { email, password }
- `POST /api/auth/logout` - Clear token
- `GET /api/auth/me` - Get current authenticated user

### Users (Require: ADMIN or STAFF role)
- `GET /api/users` - List all users
- `GET /api/users/stats` - Get user statistics (by role, location, age groups)
- `PATCH /api/users/:id/role` - Update user role (ADMIN only)

### Polls (All routes require authentication)
- `GET /api/polls` - List all polls
- `POST /api/polls` - Create poll (ADMIN, STAFF)
- `GET /api/polls/:id` - Get poll details with user's vote
- `POST /api/polls/:id/vote` - Vote on poll
- `GET /api/polls/:id/results` - Get poll results and vote counts

### Events (All routes require authentication)
- `GET /api/events` - List all events
- `POST /api/events` - Create event (ADMIN, STAFF)
- `GET /api/events/:id` - Get event details with RSVPs
- `POST /api/events/:id/rsvp` - RSVP to event (create/update)

### Issues (All routes require authentication)
- `GET /api/issues` - List issues (constituents see only their own, staff/admin see all)
- `POST /api/issues` - Report new issue
- `PATCH /api/issues/:id` - Update issue status/assignment (ADMIN, STAFF)
- `GET /api/issues/stats` - Get issue statistics by status (ADMIN, STAFF)

### Announcements (All routes require authentication)
- `GET /api/announcements` - List all announcements
- `POST /api/announcements` - Create announcement (ADMIN, STAFF)
- `DELETE /api/announcements/:id` - Delete announcement (ADMIN only)

### Analytics
- `GET /api/analytics/dashboard` - Dashboard data with counts and recent activity (ADMIN, STAFF)

---

## Frontend Routes & Pages

### Authentication
- `/` - Landing page (redirects to /admin or /constituent if logged in)
- `/login` - Login page
- `/register` - Registration page

### Admin Portal (Protected by role: ADMIN, STAFF)
- `/admin` - Admin dashboard with charts and statistics
- `/admin/announcements` - Manage announcements
- `/admin/events` - Manage events
- `/admin/issues` - Manage issues
- `/admin/polls` - Manage polls
- `/admin/users` - Manage users

### Constituent Portal (Protected by role: CONSTITUENT)
- `/constituent` - Home page (announcements)
- `/constituent/events` - View and RSVP to events
- `/constituent/issues` - Report and view issues
- `/constituent/polls` - Vote on polls
- `/constituent/profile` - View profile information

---

## User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **ADMIN** | Full access - create/edit/delete all entities, manage users and roles |
| **STAFF** | Can create/manage polls, events, issues, announcements (no user management) |
| **CONSTITUENT** | Can vote on polls, RSVP to events, report issues, view announcements, manage own profile |

---

## Seed Data Included

The project comes with pre-populated data:
- **Admin**: admin@constituency.gov / admin123 (role: ADMIN)
- **Staff**: staff@constituency.gov / admin123 (role: STAFF)
- **10 Constituents**: constituent1@example.com to constituent10@example.com / admin123
- **1 Poll**: "Community Development Priority" with 5 options
- **1 Event**: "Town Hall Meeting" (7 days from now)
- **1 Announcement**: Welcome message
- **1 Issue**: Sample reported issue

---

## Key Features Implemented

### Admin Dashboard
- ✅ Analytics dashboard with charts (user count, polls, events, announcements)
- ✅ Issue status pie chart
- ✅ Age group distribution bar chart
- ✅ Location-based user distribution
- ✅ User role distribution
- ✅ Recent activity feed
- ✅ User management interface
- ✅ Poll creation and management
- ✅ Event creation and management
- ✅ Issue tracking and assignment
- ✅ Announcement posting

### Constituent Portal
- ✅ Home page with announcements
- ✅ Poll voting with results visualization
- ✅ Event listing with RSVP functionality
- ✅ Issue reporting interface
- ✅ Profile management
- ✅ Responsive mobile design

### Authentication & Security
- ✅ JWT-based authentication
- ✅ bcrypt password hashing
- ✅ Role-based access control (RBAC)
- ✅ Protected API routes
- ✅ Cookie-based token storage
- ✅ CORS configuration

---

## Project Scripts

```json
{
  "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
  "dev:client": "next dev",
  "dev:server": "node server/src/app.js",
  "build": "next build",
  "start": "next start",
  "db:migrate": "npx prisma migrate dev",
  "db:seed": "node prisma/seed.js"
}
```

---

## File Structure

```
├── next.config.mjs              # Next.js config with API rewrites
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── postcss.config.mjs          # PostCSS configuration
├── package.json                # Dependencies and scripts
│
├── prisma/
│   ├── schema.prisma           # Database schema definition
│   ├── seed.js                 # Seed script for sample data
│   ├── dev.db                  # SQLite database file
│   └── migrations/             # Database migration history
│
├── server/src/
│   └── app.js                  # Express.js backend server (all API routes)
│
└── src/
    ├── app/
    │   ├── globals.css         # Global Tailwind styles
    │   ├── layout.tsx          # Root layout
    │   ├── page.tsx            # Landing page
    │   ├── login/page.tsx      # Login page
    │   ├── register/page.tsx   # Registration page
    │   │
    │   ├── admin/              # Admin portal
    │   │   ├── layout.tsx      # Admin layout with sidebar
    │   │   ├── page.tsx        # Dashboard
    │   │   ├── announcements/page.tsx
    │   │   ├── events/page.tsx
    │   │   ├── issues/page.tsx
    │   │   ├── polls/page.tsx
    │   │   └── users/page.tsx
    │   │
    │   └── constituent/        # Constituent portal
    │       ├── layout.tsx      # Constituent layout
    │       ├── page.tsx        # Home (announcements)
    │       ├── events/page.tsx
    │       ├── issues/page.tsx
    │       ├── polls/page.tsx
    │       └── profile/page.tsx
    │
    └── components/             # Shared React components (if any)
```

---

## Frontend Implementation Details

### Authentication Flow
1. User registers on `/register` → Calls `POST /api/auth/register`
2. Backend creates user with CONSTITUENT role and returns JWT token
3. Frontend stores token in localStorage and as httpOnly cookie
4. User logs in on `/login` → Calls `POST /api/auth/login`
5. Subsequent requests include token in Authorization header or cookie
6. Protected pages check authentication and redirect accordingly

### Data Fetching
- Uses native `fetch()` API with `credentials: "include"` for cookies
- Token also stored in localStorage and passed as `Authorization: Bearer` header
- Error handling with try-catch blocks
- Loading states with spinner animations

### Styling
- Tailwind CSS for all components
- Dark mode enabled in root layout (`html lang="en" className="dark"`)
- Gradient backgrounds and animations
- Responsive mobile-first design
- Color palette: Indigo, Purple, Pink, Cyan, Orange

---

## API Integration Pattern

All API calls follow this pattern:
```typescript
const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
const response = await fetch("/api/endpoint", { 
  credentials: "include",
  headers,
  method: "GET|POST|PATCH|DELETE",
  body: JSON.stringify(data) // for POST/PATCH
});
```

---

## Features Implemented vs Roadmap

### ✅ Implemented
- Basic CRUD for all entities
- JWT authentication
- Role-based access control
- Basic analytics dashboard
- Poll voting system
- Event RSVP system
- Issue tracking
- Announcements management
- User statistics

### ❌ Not Implemented (Per Streamlined Plan)
- SMS/Email notifications
- Image uploads for issues
- CSV import/export
- Document management
- Advanced analytics
- Targeted polls
- User profile editing

---

## Setup & Deployment

### Development
```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npm run dev  # Runs both server and client
```

### Production
```bash
npm run build
npm run start
```

**Frontend**: http://localhost:3000
**Backend**: http://localhost:5000

---

## Current Development Status

All core features are fully implemented and functional:
- ✅ Backend API complete with all routes
- ✅ Database schema and migrations complete
- ✅ Admin dashboard with charts and management interfaces
- ✅ Constituent portal with full functionality
- ✅ Authentication and authorization working
- ✅ Seed data populated

The system is ready for:
- Feature enhancements
- UI/UX improvements
- Performance optimization
- Additional business logic
- Testing and quality assurance

