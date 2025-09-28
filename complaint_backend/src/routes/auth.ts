import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {z} from "zod";

const router = Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

// Zod schemas
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["citizen", "staff", "admin"]).optional(), // default will be citizen
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {

     const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    }
    const { email, password, name, role } = parsed.data;

    // check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save new user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: role || "citizen", // default role is citizen
      },
    });

    res.status(201).json({
      message: "User registered",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


// POST /api/auth/login
// router.post("/login", async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) {
//       return res.status(400).json({ error: "Invalid credentials" });
//     }

//     // compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: "Invalid credentials" });
//     }

//     // create token
//     const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

//     res.json({ message: "Login successful", token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });

export default router;
