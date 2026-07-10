# Restaurant Reservation Management System

A full-stack table reservation system with JWT authentication and role-based
access control (Customer / Admin), built for the Vibe Coding Intern assignment.

## Tech Stack

- **Frontend:** React (Vite) + React Router
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (jsonwebtoken) + bcrypt for password hashing

## Live Deployment

- Frontend: `<add deployed URL>`
- Backend API: `<add deployed URL>`

## Default Admin Access

The backend creates a default admin user automatically when it starts if no admin exists.

- Email: `admin@example.com`
- Password: `admin123`

You can override these values in `backend/.env` by setting:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Repository Structure