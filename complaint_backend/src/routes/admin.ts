import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest,authenticate } from "../middlewares/auth";

const prisma = new PrismaClient();
const router = Router();

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

export default router;
