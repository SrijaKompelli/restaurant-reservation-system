# Deployment Guide

**Frontend:** Vercel (static site hosting)  
**Backend:** Render (Node.js web service)  
**Database:** MongoDB Atlas

---

## Quick Start

1. **Backend on Render:** Follow [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)
2. **Frontend on Vercel:**
   - Update `frontend/.env.production` with Render backend URL
   - Push to GitHub
   - Vercel auto-deploys

---

## Architecture

```
┌─────────────────────┐
│  Browser            │
└──────────┬──────────┘
           │
      ┌────▼─────┐
      │  Vercel  │ (Frontend React App)
      │ Static   │ https://your-app.vercel.app
      └────┬─────┘
           │
      ┌────▼──────────────┐
      │  Render           │ (Backend Node.js)
      │  Web Service      │ https://restaurant-api.onrender.com
      └────┬──────────────┘
           │
      ┌────▼──────────────┐
      │ MongoDB Atlas     │ (Database)
      │ Cloud Database    │
      └───────────────────┘
```

---

## Frontend Deployment (Vercel)

### 1. vercel.json Configuration

The `vercel.json` file is pre-configured for frontend-only static hosting:

```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "frontend/dist/index.html",
      "status": 200
    }
  ]
}
```

**What it does:**
- Builds frontend: `cd frontend && npm run build` → outputs to `frontend/dist`
- Routes all requests to `index.html` (SPA routing)
- No backend routes (backend runs separately on Render)

### 2. Update Frontend API URL

Edit `frontend/.env.production`:

```env
VITE_API_URL=https://restaurant-api.onrender.com/api
```

Replace `restaurant-api` with your actual Render service name.

### 3. Deploy to Vercel

```bash
# Commit and push
git add .
git commit -m "Configure for Render backend"
git push origin main

# Vercel auto-deploys
```

Or manually via Vercel dashboard:
1. https://vercel.com
2. New Project → Import GitHub repo
3. Vercel auto-detects `vercel.json` settings
4. Deploy

---

## Backend Deployment (Render)

### Full Instructions

See **[RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)** for complete setup including:
- MongoDB Atlas connection
- Render web service creation
- Environment variables
- Troubleshooting

### Quick Version

1. Create Render account: https://render.com
2. Create MongoDB Atlas cluster: https://www.mongodb.com/cloud/atlas
3. Create Render web service:
   - **Name:** `restaurant-api`
   - **Runtime:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Environment Variables:**
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Random 32-char string
     - `ADMIN_EMAIL`: `admin@example.com`
     - `ADMIN_PASSWORD`: `admin123`

4. Get your Render URL: `https://restaurant-api.onrender.com`
5. Update `frontend/.env.production` with this URL
6. Push to GitHub to trigger frontend redeploy

---

## Environment Variables

### Vercel (Frontend)

No environment variables needed — automatically handled via `frontend/.env.production`.

### Render (Backend) — Set in Dashboard

```
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/restaurant-reservation
JWT_SECRET=<random-32-char-string>
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### MongoDB Atlas

- Connection string: `mongodb+srv://user:pass@cluster.mongodb.net/database-name`
- IP Whitelist: Add `0.0.0.0/0` to allow Render access

---

## Testing Post-Deployment

### 1. Check Backend is Running

```bash
curl https://restaurant-api.onrender.com
```

Should respond (200 or 404 is OK, means server is up).

### 2. Check Frontend is Loading

Visit `https://your-app.vercel.app` — should see login page.

### 3. Full User Flow

1. Register as customer
2. Book a table
3. View reservation
4. Login as admin: `admin@example.com` / `admin123`
5. View all reservations

### 4. Check API Connectivity

In browser DevTools (F12) → Network tab:
- Make an API call (login, register, etc.)
- Should see request to `https://restaurant-api.onrender.com/api/*`
- Response should be 200-201

---

## Troubleshooting

### Backend won't start (Render logs show error)

**Common cause:** Missing environment variables

**Fix:**
1. Check Render dashboard → Environment tab
2. Verify all 4 vars are set: `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
3. Save and redeploy

### Frontend shows API errors

**Symptom:** "Failed to book table", "Cannot fetch reservations"

**Fixes:**
1. Verify `frontend/.env.production` has correct Render URL
2. Check browser Network tab for actual API request URL
3. If seeing CORS errors, backend CORS may not be enabled (check `backend/server.js`)

### MongoDB connection failed

**Symptom:** Render logs show "Error: querySrv ECONNREFUSED"

**Fixes:**
1. Verify `MONGO_URI` is set on Render
2. Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
3. Test locally: `MONGO_URI="your-uri" npm start`

### "No table available" error

**Fix:** Seed tables in production database

```bash
# From your local machine
MONGO_URI="your-mongodb-atlas-uri" node backend/seed/seedTables.js
```

Or manually insert 6 tables into MongoDB Atlas.

### 404 errors on page refresh

**Already handled:** `vercel.json` routes to `index.html` for SPA routing.

If still broken, check `vercel.json` syntax.

---

## Cost Summary

**Render Free Tier:**
- ✅ Always-on web service (0.1 CPU, 512 MB RAM)
- ⚠️ Spins down after 15 mins inactivity (cold start on wake)

**MongoDB Atlas Free Tier:**
- ✅ 512 MB storage, 3 backups, shared cluster

**Vercel Free Tier:**
- ✅ Unlimited static deployments, auto-scaling

Total cost: **$0/month** for free tiers (pay as you grow).

---

## Deployment Checklist

**Backend (Render):**
- [ ] MongoDB Atlas cluster created
- [ ] Render account created
- [ ] Web service created with Node runtime
- [ ] Environment variables set (4 required)
- [ ] Service starts successfully
- [ ] Get Render URL: `https://restaurant-api.onrender.com`

**Frontend (Vercel):**
- [ ] Update `frontend/.env.production` with Render URL
- [ ] Push to GitHub
- [ ] Vercel auto-deploys
- [ ] Get Vercel URL: `https://your-app.vercel.app`

**Testing:**
- [ ] Backend API responds (curl test)
- [ ] Frontend loads at Vercel URL
- [ ] Can register new customer
- [ ] Can book a table
- [ ] Can login as admin
- [ ] Admin can see all reservations

---

## Need More Help?

- **Render Issues:** See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)
- **Frontend Issues:** See [README.md](./README.md)
- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
