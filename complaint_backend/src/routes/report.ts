import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Parser } from "json2csv";
import { AuthRequest,authenticate } from "../middlewares/auth";

const router = Router();
const prisma = new PrismaClient();

// GET /api/reports/csv(comma seprated value)
router.get("/csv", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role === "citizen") {
      return res.status(403).json({ error: "Access denied" });
    }

    const complaints = await prisma.complaint.findMany({
      include: { reporter: true },
    });

    // Convert to plain objects
    const data = complaints.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      category: c.category,
      area: c.area,
      status: c.status,
      reporter: c.reporter.email,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    // Convert to CSV
    const parser = new Parser();
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("complaints_report.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting report:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
