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


 export default router;

