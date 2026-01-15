# Quick Start Guide

## 🚀 Local Development (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Database
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

### Step 3: Run Development Servers
```bash
npm run dev
```

This starts both backend (port 5000) and frontend (port 3000) concurrently.

### Step 4: Open in Browser
- Frontend: http://localhost:3000
- API: http://localhost:5000

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@constituency.gov | admin123 |
| **Staff** | staff@constituency.gov | admin123 |
| **Constituent** | constituent1@example.com | admin123 |

---

## 🚢 Railway Deployment (10 minutes)

### Step 1: Create GitHub Repository
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Create Railway Account
Visit https://railway.app and sign up

### Step 3: Create New Project on Railway
1. Click "New Project"
2. Select "Deploy from GitHub"
3. Authorize GitHub
4. Select this repository

### Step 4: Configure Environment Variables
In Railway project settings, add:
```
DATABASE_URL=file:./prisma/dev.db
JWT_SECRET=your-very-secure-random-key-here
NODE_ENV=production
PORT=8080
```

### Step 5: Deploy
Railway automatically deploys when you push to GitHub. Watch the deployment logs.

---

## 📁 Project Structure

```
├── src/                    # Next.js frontend
│   └── app/
│       ├── (auth)         # Login/Register
│       ├── admin/         # Admin portal
│       └── constituent/   # Constituent portal
├── server/                # Express backend
│   └── src/app.js
├── prisma/                # Database
│   ├── schema.prisma
│   └── seed.js
└── package.json
```

---

## 📝 Common Commands

```bash
# Development
npm run dev              # Run both servers
npm run dev:client      # Next.js only
npm run dev:server      # Express only

# Production
npm run build           # Build Next.js
npm run start          # Run both in production

# Database
npm run db:migrate     # Run migrations
npm run db:seed        # Seed sample data
npm run db:reset       # Reset database (destructive)

# Utilities
npm audit fix --force  # Fix vulnerabilities
```

---

## 🆘 Troubleshooting

### Frontend won't start
- Delete `.next` folder
- Run `npm run dev:client` again

### Database errors
- Delete `prisma/dev.db`
- Run `npx prisma migrate dev`
- Run `npm run db:seed`

### API connection errors
- Check backend is running on port 5000
- Check `.env.local` has correct API_URL

### Port already in use
- Change PORT in `.env.local`
- Update next.config.mjs if changing frontend port

---

## ✨ Features Ready to Use

✅ User authentication (JWT)  
✅ Role-based access (ADMIN, STAFF, CONSTITUENT)  
✅ Admin dashboard with charts  
✅ Polls system (create/vote)  
✅ Events management (create/RSVP)  
✅ Issue tracking (report/manage)  
✅ Announcements (post/view)  
✅ User management  
✅ Real-time statistics  

---

## 📞 Support

For issues:
1. Check [TEST_REPORT.md](TEST_REPORT.md) for test results
2. Check [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md) for deployment help
3. Check [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md) for technical details

---

**Status**: ✅ Production Ready
