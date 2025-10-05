 Complaint Management System

A full-stack web application to manage student complaints across multiple hostels in college.
Built during Hackathon 2025  using React + Node.js + TypeScript + Prisma + PostgreSQL.

⚡ Tech Stack

Frontend:

React (Vite)

TypeScript

Axios

Tailwind CSS

Backend:

Express (Node.js)

TypeScript

Prisma ORM (PostgreSQL)

JWT + bcrypt (authentication & authorization)

Multer + Cloudinary (file uploads & storage)

Zod (runtime request validation)

json2csv (report export)

**📂 Project Structure**
- Backend (complaint_backend/)
- complaint_backend/
- ├── prisma/
- │   ├── migrations/           # DB migrations
- │   ├── schema.prisma         # Prisma schema
- │   └── seed.ts               # Hostel seeding
- ├── src/
- │   ├── config/               # Config files
- │   │   ├── cloudinary.ts
- |   |   ├── mailer.ts
- │   │   └── multer.ts
- │    ├── middlewares/
- │   │   └── auth.ts           # JWT auth middleware
- │   ├── routes/               # Express routes
- │   │   ├── admin.ts
- │   │   ├── auth.ts
- │   │   ├── complaint.ts
- │   │   ├── hostel.ts
- │   │   ├── report.ts
- │   │   └── user.ts
- │   └── index.ts              # App entry point
- ├── package.json
- └── tsconfig.json

Frontend (complaint_frontend/)
complaint_frontend/
- ├── public/
- ├── src/
- │   ├── api/
- │   │   └── axios.ts          # Axios instance with JWT
- │   ├── components/           # Reusable UI
- │   │   ├── ComplaintActions.tsx
- │   │   ├── ImageModal.tsx
- │   │   ├── ProfileCard.tsx
- │   │   └── StaffRequestCard.tsx
- │   ├── pages/                # Pages (per role)
- │   │   ├── AdminDashboard.tsx
- │   │   ├── AssignedComplaints.tsx
- │   │   ├── ChiefAdminDashboard.tsx
- │   │   ├── Dashboard.tsx     # Citizen
- │   │   ├── Login.tsx
- │   │   ├── NewComplaint.tsx
- │   │   ├── Register.tsx
- │   │   └── StaffDashboard.tsx
- │   ├── types/
- │   │   └── Complaint.ts      # Shared types
- │   ├── App.tsx
- │   ├── index.css
- │   └── main.tsx
- ├── package.json
- └── tsconfig.json

🔧 Setup Instructions
Backend

Clone & install dependencies

git clone https://github.com/VINEET-SIKARWAR/Complaint_project.git
cd complaint_backend
npm install


Configure .env

DATABASE_URL="postgresql://..."
JWT_SECRET="supersecret"
ADMIN_CODE="warden-secret"
CHIEF_ADMIN_CODE="chief-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"


Run migrations & seed hostels

npx prisma migrate dev --name init
npm run seed


Start server

npm run dev

Frontend

Open a new terminal

cd complaint_frontend
npm install
npm run dev

👤 Roles & Dashboards

Citizen (Student)

Register/login

File new complaints with photo

Track their own complaints

Staff

Get complaints assigned by Admin

Update complaint status (In Progress / Resolved)

Admin (Warden)

Manage complaints of their own hostel

Promote/reject staff requests from their hostel

Assign complaints to staff

Chief Admin

View & filter complaints from all hostels

Download reports (CSV)

Manage wardens/admins

🛠 API Endpoints
Auth

POST /api/auth/register – Register user (citizen, staff, admin, chief_admin)

POST /api/auth/login – Login & get JWT

Complaints

POST /api/complaints/me – Create complaint

GET /api/complaints – Get complaints (role-based filtering)

PUT /api/complaints/:id/status – Update status

DELETE /api/complaints/:id – Delete complaint

Admin

GET /api/admin/staff-requests – See pending staff requests

PUT /api/admin/promote/:userId – Approve staff request

PUT /api/admin/reject/:userId – Reject staff request

PUT /api/admin/assign/:complaintId – Assign complaint to staff

Hostels

GET /api/hostel – List all hostels

GET /api/hostel/:id/complaints – Get complaints of specific hostel

Reports

GET /api/reports/csv – Export complaints as CSV

📸 Features

File uploads with Cloudinary

Role-based complaint access

Multi-hostel management

Staff request & promotion workflow

Chief Admin CSV report download

Filter complaints by hostel (Chief Admin Dashboard)

Roadmap

Email notifications to staff/admin

Analytics dashboard

Advanced search/filter

Mobile app (React Native)

Authors

Hackathon Project 2025 – Team Void
Vineet Sikarwar
