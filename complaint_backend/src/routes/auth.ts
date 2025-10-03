import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string;

//  Zod schemas
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["citizen", "staff", "admin","chief_admin"]).default("citizen"),
    adminCode: z.string().optional(),
    chiefAdminCode: z.string().optional(),
    hostelId: z.string().optional(), // required for staff/admin
  })
  .refine(
    (data) => {
      if (data.role === "admin" || data.role === "staff") {
        return !!data.hostelId; // must provide hostelId
      }
      return true;
    },
    {
      message: "Hostel is required for staff and admin",
      path: ["hostelId"],
    }
  );

//  Login Schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ---------------- REGISTER ----------------
router.post("/register", async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ errors: parsed.error.flatten().fieldErrors });
    }

    const { email, password, name, role, adminCode, hostelId,chiefAdminCode} = parsed.data;

    //  check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    //  hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Default values
    let finalRole: "citizen" | "staff" | "admin"|"chief_admin" = "citizen";
    let staffRequest = false;
    let finalHostelId: number | null = null;

    // If Admin → validate hostel + adminCode
    if (role === "admin") {
      if (!hostelId) {
        return res
          .status(400)
          .json({ error: "Hostel is required for admin role" });
      }

      if (adminCode && adminCode === process.env.ADMIN_CODE) {
        finalRole = "admin";
        finalHostelId = Number(hostelId);
      } else {
        return res.status(403).json({ error: "Invalid admin code" });
      }
    }

    // If Staff → request staff approval
    if (role === "staff") {
      if (!hostelId) {
        return res
          .status(400)
          .json({ error: "Hostel is required for staff role" });
      }
      staffRequest = true;
      finalRole = "citizen"; // still citizen until approved
      finalHostelId = Number(hostelId);
    }


    //  Chief Admin
    if (role === "chief_admin") {
      if (chiefAdminCode && chiefAdminCode === process.env.CHIEF_ADMIN_CODE) {
        finalRole = "chief_admin";
        finalHostelId = null; // chief admin oversees all hostels
      } else {
        return res.status(403).json({ error: "Invalid chief admin code" });
      }
    }

    // Save new user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: finalRole,
        hostelId: finalHostelId,
        staffRequest,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        hostelId: user.hostelId,
      },
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});




//POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    }
    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role as "citizen" | "staff" | "admin" | "chief_admin",
        name: user.name,
        email: user.email,
        hostelId: user.hostelId ?? null,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        hostelId:user.hostelId,
      },
    });




  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
