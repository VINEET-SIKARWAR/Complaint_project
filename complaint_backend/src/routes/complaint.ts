import express from "express";
import { Response } from "express";
import upload from "../config/multer";
import {z} from "zod";

import { authenticate,AuthRequest } from "../middlewares/auth";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();


export const updateStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED"]),
});

router.post("/me", authenticate, upload.single("photo"),  async (req: AuthRequest, res: Response)=> {
  try {
    const { title, description, category, area } = req.body;
    const photoUrl = req.file?.path; // Cloudinary gives URL in .path

    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        category,
        area,
        photoUrl,
        reporterId: req.user!.userId,
      },
    });

    res.status(201).json({ message: "Complaint created", complaint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


//  Get all complaints (citizen → own only, staff/admin → all)
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    let complaints;

    if (req.user!.role === "citizen") {
      complaints = await prisma.complaint.findMany({
        where: { reporterId: req.user!.userId },
        orderBy: { createdAt: "desc" },
      });
    } else {
      complaints = await prisma.complaint.findMany({
        orderBy: { createdAt: "desc" },
      });
    }

    res.json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

//  Update complaint status (staff/admin only)
router.put("/:id/status", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role === "citizen") {
      return res.status(403).json({ error: "Access denied" });
    }

    const { id } = req.params;
     const parsed = updateStatusSchema.safeParse(req.body);
     if (!parsed.success) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const { status } = parsed.data;

    const complaint = await prisma.complaint.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.json({ message: "Status updated", complaint });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Delete complaint (citizen can delete own, staff/admin can delete any)
router.delete("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    
    const complaint = await prisma.complaint.findUnique({
      where: { id: Number(id) },
    });

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    if (req.user!.role === "citizen" && complaint.reporterId !== req.user!.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await prisma.complaint.delete({ where: { id: Number(id) } });

    res.json({ message: "Complaint deleted" });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


 export default router;

