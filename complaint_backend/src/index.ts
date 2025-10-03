import express,{Request,Response} from  "express"
import cors from "cors"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT 

// Middleware
app.use(cors())
app.use(express.json())               // Parse JSON body
app.use("/uploads", express.static("uploads")) // Serve uploaded images

// --- Routes ---
// Health check
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Complaint Management Backend is running " })
})

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
app.use("/api/users",userRoutes)

//to fetch all hostel data (to be implemented in src/routes/hostel.ts)
import hostelRoutes from "./routes/hostel"
app.use("/api/hostel",hostelRoutes)



app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`)
})
