import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Parser } from "json2csv";
import { AuthRequest, authenticate } from "../middlewares/auth";

const router = Router();
const prisma = new PrismaClient();

// GET /api/reports/csv(comma seprated value)
router.get("/csv", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role === "citizen" || req.user!.role === "staff") {
      return res.status(403).json({ error: "Access denied" });
    }

    let complaints: any[] = [];


    if (req.user!.role === "admin") {
      if (!req.user!.hostelId) {
        return res.status(400).json({ error: "Hostel ID missing for admin" });
      }

      // Admins only see complaints from their hostel
      complaints = await prisma.complaint.findMany({
        where: { hostelId: req.user!.hostelId },

         include: { reporter: true, hostel: true },
      });
    } else if (req.user!.role === "chief_admin") {
      // Chief admin sees all
      complaints = await prisma.complaint.findMany({
        include: { reporter: true, hostel: true },
      });
    }
    // Convert to plain objects
    const data = complaints.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      category: c.category,
      area: c.area,
      status: c.status,
      reporter: c.reporter.email,
      hostel: (c as any).hostel?.name || "-",
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
