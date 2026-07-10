# Vercel Deployment Guide

## Setup Instructions

### 1. Backend Deployment

The backend is deployed as a Node.js serverless function on Vercel.

**Environment Variables Required on Vercel:**

Set these in your Vercel project settings → Environment Variables:

```
MONGO_URI=mongodb+srv://user:password@cluster0.mongodb.net/restaurant-reservation
JWT_SECRET=your-secure-secret-key (use a strong random string)
ADMIN_EMAIL=admin@example.com (optional, defaults to admin@example.com)
ADMIN_PASSWORD=admin123 (optional, defaults to admin123)
```

### 2. Frontend Deployment

The frontend is built as a static site on Vercel and serves React.

**Key Configuration:**
- Build command: `cd frontend && npm run build`
- Output directory: `frontend/dist`
- Install command: `npm install`

**Environment Variables:**
- `VITE_API_URL=/api` (automatically set via `.env.production`)

### 3. API Routing

The `vercel.json` file handles routing:
- `/api/*` routes → backend serverless function
- All other routes → frontend static files (with SPA fallback to index.html)

## Deployment Steps

### Option A: Deploy via Git Push (Recommended)

1. Connect your GitHub repo to Vercel
2. Push to main/master branch
3. Vercel automatically builds and deploys

### Option B: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

## After Deployment

1. Visit your Vercel deployment URL
2. Register a customer account or log in with admin:
   - Email: `admin@example.com`
   - Password: `admin123`
3. Test customer and admin flows

## Troubleshooting

**Issue: "No table available for that party size"**
- Ensure tables are seeded in MongoDB
- Run the seed script locally first, or verify DB connection

**Issue: Cannot connect to MongoDB**
- Check `MONGO_URI` is set correctly in Vercel environment
- Verify MongoDB Atlas IP whitelist includes Vercel IPs (allow 0.0.0.0/0 or add Vercel IPs)

**Issue: Login/Auth not working**
- Check `JWT_SECRET` is set in Vercel environment
- Clear browser localStorage and log in again

**Issue: Frontend shows 404 on page refresh**
- Vercel.json routing to `index.html` should handle this automatically
- If not, check vercel.json syntax

## Local Testing Before Deployment

```bash
# Seed tables
cd backend
node seed/seedTables.js

# Run backend
npm run dev

# In another terminal, run frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173` and test the full flow.
