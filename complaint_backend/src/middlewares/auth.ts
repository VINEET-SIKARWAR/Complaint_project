import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Custom type so req.user is recognized in TypeScript
export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: string;
    name: string;
    email: string;
    hostelId?: number | null;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Format: "Bearer token"
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      role: string;
      name: string;
      email: string;
      hostelId?: number | null;
    };

    // Attach decoded info to request
    req.user = decoded;

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
