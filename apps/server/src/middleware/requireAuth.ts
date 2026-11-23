import type { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next();
  // API routes answer with 401 so the frontend can decide where to send the user.
  res.status(401).json({ error: "Not logged in" });
}
