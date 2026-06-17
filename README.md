# HireFlow — Job Board Platform REST API

A production-grade job board backend with role-based access for candidates, employers, and admins.

## 🚀 Live
| | URL |
|--|--|
| **API** | https://hireflow-api.onrender.com |
| **Health** | https://hireflow-api.onrender.com/health |
| **GitHub** | https://github.com/Viks2202/hireflow |

> Free tier sleeps after 15 min inactivity. First request may take 30-60 sec.

## 🛠 Tech Stack
| Category | Technology |
|----------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcrypt + Refresh Tokens |
| File Storage | Cloudinary (PDF resumes) |
| Email | Nodemailer + Mailtrap |
| Deployment | Render |

## 👥 Roles
| Role | Can Do |
|------|--------|
| **candidate** | Apply for jobs, upload PDF resume, view applications, save jobs |
| **employer** | Post jobs, view applicants, update application status |
| **admin** | Everything + analytics, user management |

## ✅ Features
- **Authentication** — Register (3 roles), Login, JWT, Email verification, Password reset
- **Jobs** — CRUD, Search, Filter by type/location/salary/skills, Pagination
- **Applications** — Apply, track status (applied→shortlisted→hired), email notifications
- **Resume** — Upload PDF resume to Cloudinary, retrieve, delete
- **Admin** — Dashboard with platform analytics

## 📋 API Endpoints

### Auth `/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /register | Register (candidate/employer) |
| POST | /login | Login |
| GET | /me | Get profile |
| PUT | /profile | Update profile + skills |
| PUT | /change-password | Change password |
| POST | /forgot-password | Send reset email |
| POST | /reset-password/:token | Reset password |
| GET | /verify-email/:token | Verify email |
| POST | /logout | Logout |

### Jobs `/jobs`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | / | Get all jobs (with filters) | No |
| GET | /:id | Get single job | No |
| GET | /search | Search jobs | No |
| GET | /stats | Job statistics | No |
| POST | / | Create job | Employer/Admin |
| PUT | /:id | Update job | Employer/Admin |
| DELETE | /:id | Delete job | Employer/Admin |

### Applications `/applications`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /job/:id | Apply for job | Candidate |
| GET | /my | My applications | Candidate |
| DELETE | /:id | Withdraw application | Candidate |
| GET | /job/:id | Job applicants | Employer/Admin |
| PUT | /:id/status | Update status | Employer/Admin |
| GET | /all | All applications | Admin |

### Resume `/resume`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /upload | Upload PDF resume | Candidate |
| GET | /me | Get resume URL | Candidate |
| DELETE | /me | Delete resume | Candidate |

### Users `/users`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /candidates | All candidates | Employer/Admin |
| GET | /employers | All employers | Admin |

### Admin `/admin`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /stats | Dashboard statistics | Admin |
| GET | /users | All users | Admin |
| GET | /jobs | All jobs | Admin |
| GET | /applications | All applications | Admin |

## 🔍 Query Parameters (GET /jobs)