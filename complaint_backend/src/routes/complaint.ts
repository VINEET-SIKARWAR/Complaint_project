import express from "express";
import { Response } from "express";
import upload from "../config/multer";

import { authenticate,AuthRequest } from "../middlewares/auth";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

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


 export default router;

