import express from "express";
import { Response } from "express";
import upload from "../config/multer";
import { z } from "zod";
import sendEmail from "../config/mailer";

import { authenticate, AuthRequest } from "../middlewares/auth";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();


export const updateStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED"]),
});

router.post("/me", authenticate, upload.single("photo"), async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, area, hostelId } = req.body;
    const photoUrl = req.file?.path; // Cloudinary gives URL in .path

    if (!title || !description || !category || !area || !hostelId) {
      return res.status(400).json({ error: "All fields including hostelId are required" });
    }
    const hostelIdNum = Number(hostelId);
    if (isNaN(hostelIdNum)) {
      return res.status(400).json({ error: "Invalid hostelId format" });
    }


    // ensure hostel exists
    const hostel = await prisma.hostel.findUnique({ where: { id: Number(hostelId) } });
    if (!hostel) {
      return res.status(404).json({ error: "Invalid hostel selected" });
    }

    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        category,
        area,
        photoUrl,
        reporterId: req.user!.userId,
        hostelId: Number(hostelId)
      },
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        hostel: { select: { id: true, name: true } },

      }
    });

    await sendEmail(
      complaint.reporter.email,
      "Complaint Registered Successfully",
      `Hello ${complaint.reporter.name},\n\n` +
      `We have successfully received your complaint:\n\n` +
      `Title       : ${complaint.title}\n` +
      `Hostel      : ${complaint.hostel?.name ?? "N/A"}\n` +
      `Category    : ${complaint.category}\n` +
      `Description : ${complaint.description}\n` +
      `Current Status : ${complaint.status}\n\n` +
      `Our team will review your complaint and take appropriate action. ` +
      `You will be notified via email whenever there is a status update.\n\n` +
      `Thank you for helping us maintain a better environment!\n\n` +
      `- Complaint Management Team`
    );





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

    if (req.user?.role === "citizen") {
      // citizen only sees their own
      complaints = await prisma.complaint.findMany({
        where: { reporterId: req.user.userId },
        include: {
          reporter: { select: { id: true, name: true, email: true } },
          assignedTo: { select: { id: true, name: true, email: true } },
          hostel: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } else if (req.user?.role === "admin") {
      // staff/admin see all complaints releted to their hostel
      complaints = await prisma.complaint.findMany({
        where: { hostelId: req.user.hostelId },
        include: {
          reporter: { select: { id: true, name: true, email: true } },
          assignedTo: { select: { id: true, name: true, email: true } },
          hostel: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } else if (req.user?.role === "chief_admin") {
      // chief_admin sees all complaints
      complaints = await prisma.complaint.findMany({
        include: {
          reporter: { select: { id: true, name: true, email: true } },
          assignedTo: { select: { id: true, name: true, email: true } },
          hostel: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // staff → assigned complaints
      complaints = await prisma.complaint.findMany({
        where: { assignedToId: req.user!.userId },
        include: {
          reporter: { select: { id: true, name: true, email: true } },
          assignedTo: { select: { id: true, name: true, email: true } },
          hostel: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: "desc" },
      });
    }

    res.json(complaints);

  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// PUT /complaints/:id/status
router.put("/:id/status", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role === "citizen") {
      return res.status(403).json({ error: "Citizens cannot update complaint status" });
    }

    const complaintId = parseInt(req.params.id);
    const parsed = updateStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const { status } = parsed.data;

    // find complaint
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
    });

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    // STAFF rules
    if (req.user?.role === "staff") {
      if (complaint.assignedToId !== req.user.userId) {
        return res.status(403).json({ error: "Not authorized to update this complaint" });
      }

      // staff can only move their assigned complaint forward
      if (!["IN_PROGRESS", "RESOLVED"].includes(status)) {
        return res.status(400).json({ error: "Staff can only set status to IN_PROGRESS or RESOLVED" });
      }
    }

    // ADMIN rules → can change to anything
    // (no extra check needed, since citizen already blocked above)

    const updatedComplaint = await prisma.complaint.update({
      where: { id: complaintId },
      data: { status },
      include: {
        reporter: { select: { name: true, email: true } },
        assignedTo: { select: { name: true, email: true } },
         hostel: { select: { name: true } }, 
      },
    });

    await sendEmail(
      updatedComplaint.reporter.email,
      "Update on Your Complaint",
      `Hello ${updatedComplaint.reporter.name},\n\n` +
      `We wanted to inform you that the status of your complaint has been updated:\n\n` +
      `Title       : ${updatedComplaint.title}\n` +
      `Hostel      : ${updatedComplaint.hostel?.name ?? "N/A"}\n` +
      `Category    : ${updatedComplaint.category ?? "N/A"}\n` +
      `New Status  : ${updatedComplaint.status}\n\n` +
      `Thank you for your patience. Complain is resolved.\n\n` +
      `- Complaint Management Team`
    );


    res.json({ message: "Status updated successfully", complaint: updatedComplaint });
  } catch (error) {
    console.error("Error updating complaint status:", error);
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

// Get complaints assigned to the logged-in staff
router.get("/assigned", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "staff") {
      return res.status(403).json({ error: "Only staff can view assigned complaints" });
    }

    const complaints = await prisma.complaint.findMany({
      where: { assignedToId: req.user.userId },
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(complaints);
  } catch (error) {
    console.error("Error fetching assigned complaints:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});




export default router;

