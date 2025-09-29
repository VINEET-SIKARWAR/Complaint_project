# Complaint_project

# Complaint Management Backend 🚀

Backend API for the Complaint Management System, built with **Express + TypeScript + Prisma + PostgreSQL**.
Supports user authentication, complaint submission, **file uploads with Cloudinary**, backend validation with **Zod**, and role-based access for staff/admin.

---

## ⚡ Tech Stack

* **Express** (server framework)
* **TypeScript**
* **Prisma ORM** (with PostgreSQL / SQLite for dev)
* **JWT + bcrypt** (authentication)
* **Zod** (runtime request validation)
* **Multer + Cloudinary** (file uploads, cloud storage)
* **CSV Export** (reports)

---

## 📂 Project Structure

```
complaint-backend/
  ├── prisma/
  │   └── schema.prisma      # Database schema
  ├── src/
  │   ├── index.ts           # Entry point
  │   ├── prisma.ts          # Prisma client
  │   ├── config/
  │   │   └── cloudinary.ts  # Cloudinary config
  │   ├── middleware/
  │   │   └── auth.ts        # JWT middleware
  │   ├── routes/
  │   │   ├── auth.ts        # Register & login
  │   │   └── complaints.ts  # Complaints CRUD
  ├── .env                   # Environment variables
  ├── package.json
  └── tsconfig.json
```

---

## 🔧 Setup

### 1. Clone & install

```bash
git clone https://github.com/VINEET-SIKARWAR/Complaint_project.git
cd complaint-backend
npm install
```

### 2. Configure environment

Create a `.env` file:

```
DATABASE_URL="file:./dev.db"   # or your PostgreSQL URL
JWT_SECRET="supersecret"
PORT=3000

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. Setup database

```bash
npx prisma migrate dev --name init
```

### 4. Run in development

```bash
npm run dev
```

### 5. Build & run in production

```bash
npm run build
npm start
```

---

## 🛠 API Endpoints

### Auth

* `POST /api/auth/register` – Register new user (`citizen`, `staff`, `admin`)
  ✅ Validated with **Zod**
* `POST /api/auth/login` – Login & get JWT

### Complaints

* `POST /api/complaints` – Submit complaint (with optional photo uploaded to **Cloudinary**)
* `GET /api/complaints` – List complaints (citizen = own, staff/admin = all)
* `PUT /api/complaints/:id` – Update status (`OPEN` → `IN_PROGRESS` → `RESOLVED`, staff/admin only)

### Reports

* `GET /api/reports/csv` – Export complaints as CSV (staff/admin only)

---

## 📸 File Uploads

* Uses **Multer** with **Cloudinary storage**.
* Uploaded images are stored in the cloud and return a secure URL.
* Accessible directly via `photoUrl` field in complaint object.

---

## 🚀 Deployment

* Recommended: **Render / Railway** (free tier for hackathons).
* PostgreSQL: use managed DB on Railway, Neon, or Supabase.
* Set environment variables on server:

  * `DATABASE_URL`
  * `JWT_SECRET`
  * `PORT`
  * `CLOUDINARY_CLOUD_NAME`
  * `CLOUDINARY_API_KEY`
  * `CLOUDINARY_API_SECRET`

---

## ✅ Roadmap / To-Do

* [x] User auth (JWT)
* [x] Complaint CRUD
* [x] Role-based access
* [x] Zod validation
* [x] Cloudinary integration
* [ ] CSV export
* [ ] Notifications (email/SMS)
* [ ] Dashboard analytics

---

## 👨‍💻 Authors

Built during Hackathon 2025 by **Vineet Sikarwar**.

