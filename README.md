# Constituency Management System

A modern, full-stack web application for managing constituency operations, enabling better communication between elected representatives and their constituents.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Express.js](https://img.shields.io/badge/Express.js-4.18-green)
![SQLite](https://img.shields.io/badge/SQLite-3-blue)

## ✨ Features

### Admin Dashboard
- 📊 **Analytics Dashboard** - Charts for demographics, engagement, and issue tracking
- 👥 **User Management** - Manage users with role-based access (Admin, Staff, Constituent)
- 📋 **Polls & Surveys** - Create polls and view real-time results
- 📅 **Events** - Organize events and track RSVPs
- 🔔 **Announcements** - Broadcast updates to constituents
- 🔧 **Issue Tracking** - View, assign, and resolve community issues

### Constituent Portal
- 🏠 **Home** - View announcements and quick access to features
- 🗳️ **Vote** - Participate in community polls
- 📅 **RSVP** - Join community events
- 📝 **Report Issues** - Submit issues for resolution
- 👤 **Profile** - View personal information

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup database:**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

3. **Seed sample data:**
   ```bash
   npm run db:seed
   ```

4. **Start development servers:**
   ```bash
   # Terminal 1 - Backend (port 5000)
   npm run dev:server
   
   # Terminal 2 - Frontend (port 3000)
   npm run dev:client
   ```

5. **Open in browser:**
   - Frontend: http://localhost:3000
   - API: http://localhost:5000

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@constituency.gov | admin123 |
| Staff | staff@constituency.gov | admin123 |
| Constituent | constituent1@example.com | admin123 |

## 📁 Project Structure

```
├── src/app/              # Next.js frontend
│   ├── admin/            # Admin dashboard pages
│   ├── constituent/      # Constituent portal pages
│   ├── login/            # Authentication pages
│   └── register/
├── server/src/           # Express.js backend
│   └── app.js            # API routes
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.js           # Sample data
└── package.json
```

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Charts:** Recharts
- **Backend:** Express.js, Node.js
- **Database:** SQLite with Prisma ORM
- **Auth:** JWT with bcrypt

## 📝 User Roles

| Role | Permissions |
|------|-------------|
| **ADMIN** | Full access - manage users, polls, events, issues, announcements |
| **STAFF** | Can manage polls, events, issues (no user management) |
| **CONSTITUENT** | Can vote, RSVP, report issues, view announcements |

## 🚢 Deployment

### Local Development
1. Install dependencies: `npm install`
2. Generate Prisma client: `npx prisma generate`
3. Setup database: `npx prisma migrate dev --name init`
4. Seed data: `npm run db:seed`
5. Run both servers: `npm run dev`

### Railway Deployment
1. Push code to GitHub
2. Create new project on [Railway.app](https://railway.app)
3. Connect GitHub repository
4. Set environment variables:
   - `DATABASE_URL=file:./prisma/dev.db`
   - `JWT_SECRET=your-strong-secret-key`
   - `NODE_ENV=production`
   - `PORT=8080`
5. Deploy automatically on push

See [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md) for detailed instructions.

## 🎨 Features Roadmap

- [ ] SMS/Email notifications
- [ ] Image uploads for issues
- [ ] CSV import/export for constituents
- [ ] Document management
- [ ] Advanced analytics

## 📄 License

MIT License
