import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest,authenticate } from "../middlewares/auth";

const prisma = new PrismaClient();
const router = Router();

// GET /api/users/staff
router.get("/staff", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const staff = await prisma.user.findMany({
      where: { role: "staff" },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.json(staff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch staff list" });
  }
});

export default router;
