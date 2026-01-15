# Railway Deployment Guide

## Prerequisites
- Railway account (https://railway.app)
- GitHub repository with this project

## Environment Variables for Railway

Set these in your Railway project settings:

```
DATABASE_URL=file:./prisma/dev.db
JWT_SECRET=your-strong-secret-key-here
NODE_ENV=production
PORT=8080
```

## Deployment Steps

1. **Connect Repository**
   - Push code to GitHub
   - Go to Railway.app and create new project
   - Select "Deploy from GitHub"
   - Choose this repository

2. **Configure Environment**
   - In Railway project, go to Variables
   - Add all environment variables listed above
   - For JWT_SECRET, use a strong random string

3. **Build Configuration**
   - Railway will automatically detect Next.js + Node.js
   - The Procfile tells Railway how to start the server

4. **Database**
   - SQLite database file is included
   - It persists in the ephemeral filesystem (reset on redeploy)
   - For production, consider adding a persistent volume

5. **Deploy**
   - Push changes to main branch
   - Railway will automatically build and deploy
   - Check Railway dashboard for logs

## Database Reset on Railway

If you need to reset the database:
```bash
npm run db:seed
```

This will recreate the schema and seed data.

## Local Development

```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma migrate dev

# Seed sample data
npm run db:seed

# Run both servers
npm run dev

# Or run separately
npm run dev:server  # Terminal 1
npm run dev:client  # Terminal 2
```

## Troubleshooting

**Build fails**: Check that all dependencies are installed and Node.js version is 18+

**Database errors**: Run `npm run db:seed` to recreate the database

**API not connecting**: Ensure PORT environment variable is set to 8080 on Railway

**CORS errors**: Update `next.config.mjs` CORS origin if needed

## Production Checklist

- [ ] Change JWT_SECRET to a strong random value
- [ ] Update NEXT_PUBLIC_API_URL in environment
- [ ] Test all authentication flows
- [ ] Verify database seeding works
- [ ] Check logs in Railway dashboard
