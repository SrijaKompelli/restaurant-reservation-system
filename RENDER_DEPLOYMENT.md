# Render Backend Deployment Guide

## Overview

This guide covers deploying the backend to **Render** as a Node.js web service with MongoDB.

## Prerequisites

- Render account (https://render.com)
- GitHub repository with your code
- MongoDB Atlas account (for cloud database) or use Render's database option

## Deployment Options

### Option A: Using MongoDB Atlas (Recommended)

MongoDB Atlas is reliable and integrates easily with Render.

### Option B: Using Render's PostgreSQL/Database

Render offers managed databases, but our app uses MongoDB. You can either:
- Connect to MongoDB Atlas (Option A)
- Use a MongoDB Cloud service (not Render's built-in database)

**Recommendation: Use MongoDB Atlas (Option A)**

---

## Step 1: Prepare MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create/login to your account
3. Create a cluster (free tier available)
4. Get your connection string:
   - Click "Connect" → "Drivers"
   - Copy the connection string: `mongodb+srv://user:pass@cluster.mongodb.net/restaurant-reservation`
   - Replace `<password>` with your database password

5. **IP Whitelist:** Add `0.0.0.0/0` to allow all Render IPs

---

## Step 2: Create Render Service

### Via Render Dashboard (Easier)

1. Go to https://dashboard.render.com
2. Click **"New Web Service"**
3. Select **"Deploy from Git repo"** → Connect GitHub
4. Choose your repository
5. Fill in settings:
   - **Name:** `restaurant-api`
   - **Runtime:** Node
   - **Region:** Oregon (closest to most users)
   - **Branch:** main
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Plan:** Free (sufficient for testing)

6. Click **"Advanced"** and add Environment Variables:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `MONGO_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | Random 32-char string (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
   | `ADMIN_EMAIL` | `admin@example.com` |
   | `ADMIN_PASSWORD` | `admin123` |
   | `PORT` | `10000` (Render assigns this automatically) |

7. Click **"Create Web Service"**

### Via render.yaml (Infrastructure as Code)

If using `render.yaml`:

1. **First,** manually create the web service once via dashboard
2. Render will auto-detect `render.yaml` on next deployment
3. Environment variables can be managed via dashboard or `render.yaml`

---

## Step 3: Deploy Frontend to Vercel

### 1. Update Frontend API URL

Edit `frontend/.env.production`:

```env
VITE_API_URL=https://restaurant-api.onrender.com/api
```

Replace `restaurant-api` with your actual Render service name if different.

### 2. Deploy Frontend to Vercel

```bash
# Set environment variable in Vercel Dashboard
# Project Settings → Environment Variables
# Add: VITE_API_URL=https://restaurant-api.onrender.com/api

# Then deploy
git add .
git commit -m "Configure Render backend URL for production"
git push origin main
```

Vercel will auto-deploy when you push to main.

---

## Step 4: Connect Frontend to Backend

Once both are deployed:

1. **Get your URLs:**
   - Frontend: `https://your-project.vercel.app`
   - Backend: `https://restaurant-api.onrender.com`

2. **Update frontend .env.production:**
   ```env
   VITE_API_URL=https://restaurant-api.onrender.com/api
   ```

3. **Test API connectivity:**
   - Open browser DevTools (F12)
   - Try to register/login
   - Check Network tab for `/api/*` requests
   - If showing CORS errors, the backend isn't running

---

## ✅ Testing Post-Deployment

### Backend is Running

Test the backend endpoint:
```bash
curl https://restaurant-api.onrender.com/api/health
# Should return 200 (or 404 if no health endpoint, which is OK)
```

Or try from Render dashboard → "Logs" tab — should show startup messages.

### Full User Flow

1. Visit `https://your-project.vercel.app`
2. Register as a customer
3. Book a table
4. View your reservation
5. Login as admin (`admin@example.com` / `admin123`)
6. View all reservations from admin dashboard

---

## 🔴 Common Issues

### Backend Service Won't Start

**In Render Logs, see:** `Error: Cannot find module`

**Fix:**
```bash
# Ensure backend/package.json has all dependencies
cd backend
npm install
git add -A
git commit -m "Update dependencies"
git push origin main
```

Then Render will auto-rebuild.

### CORS Errors from Frontend

**In browser console:** `Access to XMLHttpRequest blocked by CORS policy`

**Fix:** Backend server.js must have CORS enabled:
```javascript
const cors = require('cors');
app.use(cors());
```

Verify it's in your `backend/server.js`.

### MongoDB Connection Failed

**In Render logs:** `Error: querySrv ECONNREFUSED`

**Fixes:**
1. Verify `MONGO_URI` is set in Render environment variables
2. Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
3. Test locally:
   ```bash
   MONGO_URI="your-uri" npm start
   ```

### "No Table Available" After Deployment

**Fix:** Seed tables in production database:
```bash
# Locally, with production MONGO_URI:
MONGO_URI="your-atlas-uri" node backend/seed/seedTables.js
```

Or login to MongoDB Atlas and insert tables manually.

### API Returns 500 Error

**In Render logs, see error details:**
- Check `JWT_SECRET` is set (should be same as local dev)
- Check `MONGO_URI` is valid
- Check all required env vars are set

---

## 📊 Deployment Checklist

- [ ] MongoDB Atlas cluster created with connection string
- [ ] MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- [ ] Render web service created for backend
- [ ] Environment variables set on Render:
  - [ ] MONGO_URI
  - [ ] JWT_SECRET
  - [ ] ADMIN_EMAIL
  - [ ] ADMIN_PASSWORD
- [ ] Backend starts successfully (check Render logs)
- [ ] Frontend .env.production updated with Render URL
- [ ] Frontend deployed to Vercel
- [ ] Full user flow tested (register → book → admin view)

---

## 📝 Environment Variables Reference

### Backend (Set on Render Dashboard)

```
NODE_ENV=production
PORT=10000 (Render auto-assigns, don't override)
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/restaurant-reservation
JWT_SECRET=your-secret-key-here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
MONGO_LOCAL_URI=mongodb://127.0.0.1:27017/restaurant-reservation (optional, for fallback)
```

### Frontend (Set in frontend/.env.production)

```
VITE_API_URL=https://restaurant-api.onrender.com/api
```

---

## 🔗 Useful Links

- Render Docs: https://render.com/docs
- Render Node.js Guide: https://render.com/docs/deploy-node-express-app
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- CORS Issues: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

---

## Useful Commands

```bash
# Generate random JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Test Render backend is running
curl https://restaurant-api.onrender.com

# Test API endpoint
curl https://restaurant-api.onrender.com/api/health
```

---

## Cost & Limits

**Render Free Plan:**
- ✅ Always-on web services with 0.1 CPU, 512 MB RAM
- ✅ Automatic builds & deploys
- ⚠️ Service spins down after 15 mins of inactivity (cold start ~30s on wake)

**MongoDB Atlas Free Tier:**
- ✅ 512 MB storage
- ✅ Shared cluster
- ✅ 3 free backups

For production, upgrade to paid plans.
