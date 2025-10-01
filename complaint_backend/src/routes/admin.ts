import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest,authenticate } from "../middlewares/auth";

const prisma = new PrismaClient();
const router = Router();

// GET /api/admin/staff-requests
router.get("/staff-requests", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // Only admin can view staff requests
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Only admin can view staff requests" });
    }

    // Find users who requested staff role
    const requests = await prisma.user.findMany({
      where: { staffRequest: true },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        staffRequest: true,
      },
      orderBy: { id: "asc" },
    });

    res.json(requests);
  } catch (err) {
    console.error("Error fetching staff requests:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// PUT /api/admin/promote/:userId
router.put("/promote/:userId", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // Only admin can promote
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Only admin can promote users" });
    }
 
    

    const userId = parseInt(req.params.userId);


    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.role === "staff") {
      return res.status(400).json({ message: "User is already promoted" });
    }

    // Update role to staff
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

// src/routes/admin.ts
router.put("/assign/:complaintId", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Only admin can assign tasks" });
    }

    const { staffId } = req.body;
    const { complaintId } = req.params;

    // check if staff exists
    const staff = await prisma.user.findUnique({
      where: { id: Number(staffId) },
    });

    if (!staff || staff.role !== "staff") {
      return res.status(400).json({ error: "Invalid staff member" });
    }

    // update complaint assignment
    const updatedComplaint = await prisma.complaint.update({
      where: { id: Number(complaintId) },
      data: { assignedToId: staff.id, status: "IN_PROGRESS" },
      include: {
        reporter: { select: { name: true, email: true } },
        assignedTo: { select: { name: true, email: true } },
      },
    });

    res.json({ message: "Complaint assigned successfully", complaint: updatedComplaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


export default router;
