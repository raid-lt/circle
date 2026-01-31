# Circle - Personal Relationship Manager

## Project Overview
Circle is a personal relationship management app to help you track contacts and interactions.

## Features
- Contact management
- Interaction logging
- Relationship scoring
- Simple dashboard

## Local Development Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Generate Prisma client
   ```bash
   npx prisma generate
   ```
4. Run development server
   ```bash
   npm run dev
   ```

## Deployment Options

### Vercel
1. Fork the repository
2. Connect to Vercel
3. Set environment variables:
   - `DATABASE_URL`: Path to SQLite database
   - `NEXTAUTH_SECRET`: Random secret for authentication

### Netlify
1. Create a new site from Git
2. Build settings:
   - Build Command: `npm run build`
   - Publish Directory: `.next`

## Known Limitations
- Current version uses SQLite
- No authentication implemented
- Minimal mobile-first design

## TODO
- Implement user authentication
- Migrate to PostgreSQL
- Enhance mobile UI
- Add more advanced relationship insights