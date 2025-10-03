// src/routes/hostel.ts
import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest } from "../middlewares/auth";

const router = Router();
const prisma = new PrismaClient();

// Get all hostels
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const hostels = await prisma.hostel.findMany({
      select: { id: true, name: true },
    });
    res.json(hostels);
  } catch (error) {
    console.error("Error fetching hostels:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Get all complaints for a specific hostel
router.get("/:id/complaints", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const hostelId = parseInt(req.params.id);

    if (isNaN(hostelId)) {
      return res.status(400).json({ error: "Invalid hostel id" });
    }

    const complaints = await prisma.complaint.findMany({
      where: { hostelId },
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        hostel: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(complaints);
  } catch (error) {
    console.error("Error fetching complaints by hostel:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
