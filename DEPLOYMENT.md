# Vercel Deployment Guide

## ⚠️ Important: Correct vercel.json Format

**DO NOT use `"services"` or `"rewrites"`** — these are not valid Vercel configuration options. The correct format is shown in `vercel.json` with `"builds"` and `"routes"`.

## 🔧 Setup Instructions

### 1. Prerequisites

- GitHub account with your repo pushed
- Vercel account (free tier OK)
- MongoDB Atlas account or local MongoDB access

### 2. Environment Variables for Vercel

In your **Vercel Dashboard → Project Settings → Environment Variables**, add:

| Variable | Value | Notes |
|----------|-------|-------|
| `MONGO_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/restaurant-reservation` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Random secure string (32+ chars) | Use `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` to generate |
| `ADMIN_EMAIL` | `admin@example.com` | Default admin account |
| `ADMIN_PASSWORD` | `admin123` | Default admin password (change after first login) |

**For VITE variables:**
- Frontend automatically uses `/api` (set in `frontend/.env.production`)
- No need to set `VITE_API_URL` in Vercel

### 3. MongoDB Atlas Whitelist

If using **MongoDB Atlas**:
1. Go to **Network Access** in Atlas
2. Add IP: `0.0.0.0/0` (allows all Vercel IPs)
   - OR whitelist specific Vercel IP ranges
3. Save changes

## 🚀 Deployment Steps

### Option A: Deploy via Git Push (Recommended)

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

Vercel automatically detects the push and deploys.

### Option B: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option C: Vercel Dashboard

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repo
4. Set environment variables (from step 2)
5. Click "Deploy"

## 📋 What Vercel Does Automatically

1. **Install:** Runs `npm install-all` (installs all node_modules)
2. **Build:** Runs `npm run build` (builds frontend to `frontend/dist`)
3. **Backend:** Creates serverless function from `backend/server.js`
4. **Routing:** 
   - `/api/*` → backend serverless function
   - `/` → frontend static files
   - Page refreshes → fallback to `index.html` (SPA routing)

## ✅ Post-Deployment Testing

1. **Visit your Vercel URL** (e.g., `https://project-name.vercel.app`)
2. **Admin Login:**
   - Email: `admin@example.com`
   - Password: `admin123` (change this!)
3. **Test Flows:**
   - Register new customer
   - Book a table
   - View reservations
   - Cancel reservation
   - Admin view all reservations

## 🔴 Common Deployment Errors

### Error: "Cannot find module"

**Fix:** Ensure all dependencies are in `backend/package.json` and `frontend/package.json`

```bash
# Reinstall locally first
npm install-all

# Then git push
```

### Error: "MongoDB connection failed"

**Possible fixes:**
1. Verify `MONGO_URI` is set in Vercel environment variables
2. Check MongoDB Atlas IP whitelist (should include `0.0.0.0/0`)
3. Test MongoDB connection locally:
   ```bash
   cd backend
   node -e "const db = require('./config/db'); db();"
   ```

### Error: "401 Unauthorized" on API calls

**Likely cause:** `JWT_SECRET` doesn't match locally
- Verify `JWT_SECRET` is the same on Vercel and locally
- Clear browser localStorage: `localStorage.clear()`
- Log in again

### Error: "404 on page refresh"

**Fix:** Already handled by vercel.json:
```json
{
  "src": "/(.*)",
  "dest": "frontend/dist/index.html",
  "status": 200
}
```

If still broken, ensure vercel.json syntax is correct (no typos).

### Error: "No table available for that party size"

**Fixes:**
1. Verify tables are seeded:
   ```bash
   cd backend
   node seed/seedTables.js
   ```
2. Check MongoDB has tables: 
   - Connect to MongoDB Atlas
   - Look in `restaurant-reservation` database → `tables` collection
   - Should show 6 tables (capacities: 2, 2, 4, 4, 6, 8)

## 🧪 Local Testing Before Deployment

```bash
# 1. Install dependencies
npm install-all

# 2. Seed tables
cd backend
node seed/seedTables.js

# 3. Start backend (Terminal 1)
npm run dev

# 4. Start frontend (Terminal 2)
cd frontend
npm run dev

# 5. Test at http://localhost:5173
```

## 📊 Deployment Checklist

- [ ] GitHub repo with all code pushed
- [ ] Vercel account created and linked to GitHub
- [ ] Environment variables set in Vercel:
  - [ ] `MONGO_URI`
  - [ ] `JWT_SECRET`
  - [ ] `ADMIN_EMAIL`
  - [ ] `ADMIN_PASSWORD`
- [ ] MongoDB Atlas IP whitelist configured
- [ ] vercel.json syntax verified (no "services" or "rewrites")
- [ ] Local testing passed
- [ ] Git push to trigger deployment
- [ ] Vercel build completes (no red errors)
- [ ] Live URL accessible and tested

## 🔗 Useful Links

- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Environment Variables: https://vercel.com/docs/projects/environment-variables
