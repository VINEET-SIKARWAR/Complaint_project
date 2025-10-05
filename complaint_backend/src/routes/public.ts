import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();


 //GET /api/public/stats

router.get("/stats", async (_, res: Response) => {
  try {
    // Total stats
    const total = await prisma.complaint.count();
    const resolvedComplaints = await prisma.complaint.findMany({
      where: { status: "RESOLVED", resolvedAt: { not: null } },
      select: { createdAt: true, resolvedAt: true },
    });
    const resolved = resolvedComplaints.length;

    const pending = total - resolved;

    // Calculate average resolution time (in hours)
    let avgResolutionTime = 0;
    if (resolved > 0) {
      const totalHours = resolvedComplaints.reduce((sum, complaint) => {
        const created = new Date(complaint.createdAt).getTime();
        const resolvedAt = new Date(complaint.resolvedAt!).getTime();
        const hours = (resolvedAt - created) / (1000 * 60 * 60);
        return sum + hours;
      }, 0);

      avgResolutionTime = totalHours / resolved;
    }

    res.json({
      total,
      resolved,
      pending,
      avgResolutionTime: Number(avgResolutionTime.toFixed(2)),
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Failed to load stats" });
  }
});

export default router;
