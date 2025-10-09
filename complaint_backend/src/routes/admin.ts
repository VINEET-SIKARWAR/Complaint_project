import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest, authenticate } from "../middlewares/auth";
import sendEmail from "../config/mailer";

const prisma = new PrismaClient();
const router = Router();

router.get("/staff-requests", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Warden (admin): only requests from their hostel
    if (req.user.role === "admin") {
      const requests = await prisma.user.findMany({
        where: {
          staffRequest: true,
          hostelId: req.user.hostelId ?? undefined, // only same hostel
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          staffRequest: true,
          hostel: { select: { id: true, name: true } },
        },
        orderBy: { id: "asc" },
      });

      return res.json(requests);
    }

    // Chief Admin: all staff requests
    if (req.user.role === "chief_admin") {
      const requests = await prisma.user.findMany({
        where: { staffRequest: true },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          staffRequest: true,
          hostel: { select: { id: true, name: true } },
        },
        orderBy: { id: "asc" },
      });

      return res.json(requests);
    }

    return res.status(403).json({ error: "Access denied" });
  } catch (err) {
    console.error("Error fetching staff requests:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


// PUT /api/admin/reject/:userId
router.put("/reject/:userId", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "admin" && req.user?.role !== "chief_admin") {
      return res.status(403).json({ error: "Only admins can reject requests" });
    }

    const userId = parseInt(req.params.userId);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.staffRequest) {
      return res.status(400).json({ message: "No pending request for this user" });
    }

    // hostel check (warden can only reject users from their hostel)
    if (req.user?.role === "admin" && user.hostelId !== req.user.hostelId) {
      return res.status(403).json({ error: "You can only reject requests from your hostel" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { staffRequest: false },
    });

    res.json({ message: "Request rejected", user: updatedUser });
  } catch (err) {
    console.error("Error rejecting user:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


// PUT /api/admin/promote/:userId
router.put("/promote/:userId", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "admin" && req.user?.role !== "chief_admin") {
      return res.status(403).json({ error: "Only admins can promote users" });
    }

    const userId = parseInt(req.params.userId);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.role === "staff") {
      return res.status(400).json({ message: "User is already promoted" });
    }

    // Hostel check (warden can only promote users from their hostel)
    if (req.user?.role === "admin" && user.hostelId !== req.user.hostelId) {
      return res.status(403).json({ error: "You can only promote users from your hostel" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: "staff", staffRequest: false },
    });

    res.json({ message: "User promoted to staff", user: updatedUser });
  } catch (err) {
    console.error("Error promoting user:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


// PUT /api/admin/assign/:complaintId
router.put("/assign/:complaintId", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "admin" && req.user?.role !== "chief_admin") {
      return res.status(403).json({ error: "Only admins can assign tasks" });
    }

    const { staffId } = req.body;
    const { complaintId } = req.params;

    const staff = await prisma.user.findUnique({ where: { id: Number(staffId) } });
    if (!staff || staff.role !== "staff") {
      return res.status(400).json({ error: "Invalid staff member" });
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id: Number(complaintId) },
    });
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });

    // Hostel check (warden can only assign staff to complaints in their hostel)
    if (req.user?.role === "admin") {
      if (staff.hostelId !== req.user.hostelId || complaint.hostelId !== req.user.hostelId) {
        return res.status(403).json({ error: "You can only assign staff/complaints from your hostel" });
      }
    }

    const updatedComplaint = await prisma.complaint.update({
      where: { id: Number(complaintId) },
      data: {
        assignedToId: staff.id, status: "IN_PROGRESS", escalated: false,
        escalatedById: null,
      },
      include: {
        reporter: { select: { name: true, email: true } },
        assignedTo: { select: { name: true, email: true } },
        hostel: { select: { name: true } }
      },
    });
    await sendEmail(
      updatedComplaint.reporter.email,
      "Your Complaint Has Been Assigned",
      `Hello ${updatedComplaint.reporter.name},\n\n` +
      `Your complaint "${updatedComplaint.title}" for hostel "${updatedComplaint.hostel?.name ?? "N/A"}" has been assigned to the staff member:\n\n` +
      `Name: ${updatedComplaint.assignedTo?.name}\n` +
      `Email: ${updatedComplaint.assignedTo?.email}\n\n` +
      `The status of your complaint is now "${updatedComplaint.status}".\n\n` +
      `We will keep you updated on any further progress.\n\n` +
      `Thank you,\nComplaint Management Team`
    );

    
    //  Send email to reporter about reassignment
    await sendEmail(
      updatedComplaint.reporter.email,
      "Your Complaint Has Been Reassigned",
      `Hello ${updatedComplaint.reporter.name},\n\nYour complaint titled "${updatedComplaint.title}" has been reassigned to ${staff.name} for resolution.\n\nYou can track progress in your dashboard.\n\n— Complaint Management Team`
    );

    res.json({ message: "Complaint assigned successfully", complaint: updatedComplaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


export default router;