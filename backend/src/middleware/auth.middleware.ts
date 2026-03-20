import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt";

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  let token = req.cookies?.accessToken;
  const authHeader = req.headers.authorization;
  if (!token && authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({ success: false, message: "Autentifikatsiya talab etiladi" });
    return;
  }
  
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Token yaroqsiz yoki muddati tugagan" });
  }
};

export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  let token = req.cookies?.accessToken;
  const authHeader = req.headers.authorization;
  if (!token && authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (token) {
    try {
      req.user = verifyAccessToken(token);
    } catch {
      // ignore invalid token for optional routes
    }
  }
  next();
};

// ---- Admin only ----
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== "ADMIN") {
    res.status(403).json({ success: false, message: "Admin huquqi talab etiladi" });
    return;
  }
  next();
};
