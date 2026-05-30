# HireFlow — Job Board Platform API

A production-grade job board backend built with Node.js, Express, and MongoDB.

## Live API
https://hireflow-api.onrender.com

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (resume upload)
- Nodemailer + Mailtrap
- Bcrypt

## Features
- Three roles: candidate, employer, admin
- User auth with email verification
- Employers post and manage jobs
- Candidates apply with resume upload
- Application status tracking
- Email notifications on apply and status change
- Advanced job search, filters, pagination
- Admin dashboard with analytics
- Role-based access control

## API Endpoints

### Auth
- POST /auth/register (candidate/employer)
- POST /auth/login
- GET  /auth/me
- POST /auth/forgot-password
- POST /auth/reset-password/:token

### Jobs
- GET    /jobs
- GET    /jobs/:id
- POST   /jobs (employer/admin)
- PUT    /jobs/:id (employer/admin)
- DELETE /jobs/:id (employer/admin)

### Applications
- POST   /applications/job/:id (candidate)
- GET    /applications/my (candidate)
- GET    /applications/job/:id (employer)
- PUT    /applications/:id/status (employer)
- DELETE /applications/:id (candidate)

### Resume
- POST   /resume/upload (candidate)
- GET    /resume/me
- DELETE /resume/me

### Admin
- GET /admin/stats
- GET /admin/users
- GET /admin/jobs
- GET /admin/applications

## Setup Locally
```bash
git clone https://github.com/Viks2202/hireflow
cd hireflow
npm install
# Add .env file with your credentials
npm run dev
```