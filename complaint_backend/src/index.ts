import express, { Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT
const allowedOrigins = [
  "http://localhost:5173", //Vite dev server
  "https://complaint-project-mnnit.vercel.app", // main frontend
  "https://complaint-project-mnnit-git-main-vineet-sikarwars-projects.vercel.app",
  "https://complaint-project-mnnit-i2x886ctd-vineet-sikarwars-projects.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (Postman, curl)
    if (!origin) return callback(null, true);

    // allow main + preview deployments + localhost
    if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
}));




app.use(express.json())               // Parse JSON body
app.use("/uploads", express.static("uploads")) // Serve uploaded images

// --- Routes ---



// Health check
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Complaint Management Backend is running " })
})

//public dashboard
import publicRoute from "./routes/public"
app.use("/api/public", publicRoute)



// Auth routes (to be implemented in src/routes/auth.ts)
import authRoutes from "./routes/auth"
app.use("/api/auth", authRoutes)

//Complaint routes (to be implemented in src/routes/complaint.ts)
import complaintRoutes from "./routes/complaint"
app.use("/api/complaints", complaintRoutes);

//report(csv) route(impllemented in src/routes/report.ts)
import reportRoutes from "./routes/report";
app.use("/api/reports", reportRoutes);

//to promote the citizen to user (to be implemented in src/routes/admin.ts)
import adminRoutes from "./routes/admin";
app.use("/api/admin", adminRoutes);

//to get all citizen who are staff members(to be implementes in src/routes/user.ts)
import userRoutes from "./routes/user"
app.use("/api/users", userRoutes)

//to fetch all hostel data (to be implemented in src/routes/hostel.ts)
import hostelRoutes from "./routes/hostel"
app.use("/api/hostel", hostelRoutes)



app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`)
})
