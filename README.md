🧾 Complaint Management System

A full-stack web application for managing student complaints across multiple hostels at college — built during Hackathon 2025.
This system enables students to file complaints, staff to resolve them, and admins to assign and monitor issues efficiently.

⚙️ Tech Stack
🖥 Frontend

React (Vite) + TypeScript

Axios (API calls)

Tailwind CSS (UI styling)

⚙️ Backend

Express (Node.js) + TypeScript

Prisma ORM (PostgreSQL)

JWT + bcryptjs (Authentication & Authorization)

Multer + Cloudinary (Image upload & storage)

Zod (Validation)

json2csv (CSV report export)

📁 Project Structure
Backend (complaint_backend/)
complaint_backend/
├── prisma/
| -│   ├── migrations/         # Database migrations
| -│   ├── schema.prisma       # Prisma schema
| -│   └── seed.ts             # Hostel seeding script
| -├── src/
| -│   ├── config/             # Configuration (Mailer, Cloudinary, Multer)
| -│   ├── middlewares/        # Authentication middleware
| -│   ├── routes/             # API routes (auth, admin, complaint, etc.)
| -│   └── index.ts            # Entry point
| -└── package.json

Frontend (complaint_frontend/)
complaint_frontend/
| -├── src/
| -│   ├── api/                # Axios instance with JWT
| -│   ├── components/         # Reusable UI components
| -│   ├── pages/              # Role-based dashboards
| -│   ├── types/              # Shared TypeScript types
| -│   └── main.tsx            # App entry
| -└── package.json

⚡ Quick Start
🧩 Backend Setup
git clone https://github.com/VINEET-SIKARWAR/Complaint_project.git
cd complaint_backend
npm install


Configure environment:

DATABASE_URL="postgresql://..."
JWT_SECRET="supersecret"
ADMIN_CODE="warden-secret"
CHIEF_ADMIN_CODE="chief-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"


Run database setup:

npx prisma migrate dev --name init
npm run seed


Start server:

npm run dev

💻 Frontend Setup
cd complaint_frontend
npm install
npm run dev

👥 User Roles
Role	Capabilities
Citizen (Student)	File & track complaints with photos
Staff	View assigned complaints, mark as In Progress or Resolved
Admin (Warden)	Approve staff, assign complaints, manage hostel issues
Chief Admin	View all hostels, download reports, oversee admins
🧠 Core Features

📸 Image Uploads (via Cloudinary)

🔐 Role-based Access Control

🏠 Multi-Hostel Complaint Management

👥 Staff Request & Promotion Workflow

📊 CSV Report Export (Chief Admin)

🗺️ Heatmap Visualization (Admin & Chief Admin dashboards)

⏱️ SLA Tracking (24-hour escalation alert)

📧 Email Notifications on complaint status updates

📡 API Overview
Auth

POST /api/auth/register – Register new user

POST /api/auth/login – User login & JWT issue

Complaints

POST /api/complaints/me – Create complaint

GET /api/complaints – Get complaints (filtered by role)

PUT /api/complaints/:id/status – Update status

DELETE /api/complaints/:id – Delete complaint

Admin

GET /api/admin/staff-requests – View pending staff requests

PUT /api/admin/promote/:userId – Approve staff

PUT /api/admin/reject/:userId – Reject staff

PUT /api/admin/assign/:complaintId – Assign to staff

Reports

GET /api/reports/csv – Download CSV report

GET /api/reports/heatmap-export – Get heatmap data

GET /api/reports/sla-export – Get SLA data

🚀 Future Enhancements

📈 Analytics dashboard

🔍 Advanced filters & search

📱 Mobile app (React Native)


Author
Hackathon Project 2025 – Team Void
Vineet Sikarwar
