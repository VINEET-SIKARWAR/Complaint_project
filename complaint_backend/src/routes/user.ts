import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest, authenticate } from "../middlewares/auth";

const prisma = new PrismaClient();
const router = Router();

// GET /api/users/staff
router.get("/staff", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    let staff;

    if (req.user.role === "admin") {
      // Warden/Admin: only staff from the same hostel
      staff = await prisma.user.findMany({
        where: {
          role: "staff",
          hostelId: req.user.hostelId ?? undefined,
        },
        select: {
          id: true,
          name: true,
          email: true,
          hostel: { select: { id: true, name: true } },
        },
      });
    } else if (req.user.role === "chief_admin") {
      //  Chief Admin: can see staff from all hostels
      staff = await prisma.user.findMany({
        where: { role: "staff" },
        select: {
          id: true,
          name: true,
          email: true,
          hostel: { select: { id: true, name: true } },
        },
      });
    } else {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(staff);
  } catch (err) {
    console.error("Error fetching staff:", err);
    res.status(500).json({ error: "Failed to fetch staff list" });
  }
});

export default router;
