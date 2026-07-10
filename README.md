# Restaurant Reservation System

A full-stack web application for restaurant table reservations with customer booking and admin management features.

## 🚀 Tech Stack

**Frontend:** React 19 + Vite + React Router + Axios
**Backend:** Express.js + Mongoose + MongoDB
**Database:** MongoDB (Atlas + local fallback)
**Deployment:** Vercel (frontend + serverless backend)

## 📦 Features

- ✅ Customer registration and login
- ✅ Table availability search and booking
- ✅ Reservation management (view, cancel)
- ✅ Admin dashboard (view all reservations)
- ✅ Role-based access control (customer/admin)
- ✅ Overlap prevention (no double-booking tables)
- ✅ Capacity validation
- ✅ JWT authentication

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Setup

```bash
# Install all dependencies
npm install-all

# Set up environment variables
cp .env.example backend/.env

# Seed initial tables
cd backend
node seed/seedTables.js

# Start backend (Terminal 1)
npm run dev

# Start frontend (Terminal 2)
cd frontend
npm run dev
```

**Access:** http://localhost:5173

**Test Credentials:**
- Admin: `admin@example.com` / `admin123`
- Or register as a new customer

## 🌐 Vercel Deployment

### Prerequisites
- GitHub repo connected to Vercel
- MongoDB Atlas account (or use local MongoDB)

### Environment Variables on Vercel

Set these in **Vercel Dashboard → Project Settings → Environment Variables:**

```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/restaurant-reservation
JWT_SECRET=<strong-random-key>
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### Deploy

```bash
# Option 1: Git Push (recommended)
git push origin main
# Vercel automatically deploys

# Option 2: Vercel CLI
vercel --prod
```

**Vercel will automatically:**
1. Install dependencies via `npm install-all`
2. Build frontend: `npm run build` (builds to `frontend/dist`)
3. Create serverless backend function from `backend/server.js`
4. Route `/api/*` to backend, all others to frontend

### Post-Deployment

1. Visit your Vercel URL
2. Admin account auto-created on first backend initialization
3. Register as customer or login with admin credentials

## 📋 Project Structure

```
restaurant-reservation-system/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── controllers/           # Business logic
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API endpoints
│   ├── middleware/            # Auth & admin middleware
│   ├── seed/seedTables.js     # DB initialization
│   ├── server.js              # Express app
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Route pages
│   │   ├── App.jsx            # Router & auth context
│   │   └── main.jsx           # Entry point
│   ├── .env.production        # Production env vars
│   └── package.json
├── vercel.json                # Vercel deployment config
├── .env.example               # Environment template
├── DEPLOYMENT.md              # Detailed deployment guide
└── package.json               # Root scripts

```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Reservations
- `GET /api/reservations` - List user's reservations
- `GET /api/reservations/available` - Check availability
- `POST /api/reservations` - Create reservation
- `DELETE /api/reservations/:id` - Cancel reservation

### Admin
- `GET /api/admin/reservations` - All reservations (admin only)

## 🐛 Troubleshooting

**"No table available for that party size"**
- Verify tables are seeded: `node backend/seed/seedTables.js`
- Check MongoDB connection

**"Cannot connect to MongoDB"**
- Verify `MONGO_URI` in environment variables
- MongoDB Atlas: add Vercel IPs to IP whitelist (or use 0.0.0.0/0)

**"Authentication failed"**
- Verify `JWT_SECRET` is set
- Clear browser localStorage and login again

**"404 on page refresh"**
- Vercel routing should auto-fallback to `index.html`
- Verify `vercel.json` routes are correct

For detailed troubleshooting, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📝 Environment Variables

Create `backend/.env` with:

```
PORT=5000
MONGO_URI=your-mongodb-url
JWT_SECRET=your-secret-key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
MONGO_LOCAL_URI=mongodb://127.0.0.1:27017/restaurant-reservation
```

See `.env.example` for full template.

## 📄 License

MIT
