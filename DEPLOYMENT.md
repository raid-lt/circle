# Circle App Deployment Guide

## Deployment Options

### 1. Vercel Deployment (Recommended)
1. Fork the GitHub repository
2. Connect to Vercel
3. Set up environment variables:
   ```
   DATABASE_URL=file:/vercel/path/to/dev.db
   NEXTAUTH_SECRET=generate_a_random_secret
   ```
4. Deploy

### 2. Railway Deployment
1. Create a new Railway project
2. Connect GitHub repository
3. Add SQLite database
4. Set environment variables similar to Vercel

### Quick Deployment Commands
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Build project
npm run build

# Start production server
npm start
```

## Known Limitations
- Using SQLite for MVP
- Requires migration to PostgreSQL for production
- No authentication in current version

## Hosting Checklist
- ✅ Next.js compatible
- ✅ Free tier available
- ✅ Easy GitHub integration
- ✅ Simple environment configuration