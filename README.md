# Circle - Personal Relationship Manager

## About
Circle is a personal relationship management app to help you keep track of your contacts and interactions.

## Quick Start for Developers

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Setup
1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Generate Prisma client
   ```
   npx prisma generate
   ```
4. Run development server
   ```
   npm run dev
   ```

## Deployment
Recommended platforms:
- Vercel (Preferred for Next.js)
- Netlify
- Railway
- Render

### Vercel Deployment
1. Fork the repository
2. Connect to Vercel
3. Set environment variables
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`

## Features
- Contact management
- Interaction logging
- Relationship scoring
- Simple dashboard

## TODO
- Authentication
- More advanced filtering
- Enhanced UI/UX