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
  res.json({ message: "Complaint Management Backend is running 🚀" })
})

// Auth routes (to be implemented in src/routes/auth.ts)
// import authRoutes from "./routes/auth"
// app.use("/api/auth", authRoutes)



// --- Start server ---

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})
