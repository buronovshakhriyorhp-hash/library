import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

// ---- Zod Request Validator ----
export const validate =
  (schema: ZodSchema, target: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validatsiya xatosi",
        errors: result.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
      return;
    }
    req[target] = result.data;
    next();
  };

// ---- Global Error Handler ----
export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validatsiya xatosi",
      errors: err.errors,
    });
    return;
  }

  // Prisma unique constraint
  if ((err as NodeJS.ErrnoException).name === "PrismaClientKnownRequestError") {
    res.status(409).json({ success: false, message: "Ma'lumot allaqachon mavjud" });
    return;
  }

  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Server xatosi"
        : err.message,
  });
};

// ---- 404 handler ----
export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({ success: false, message: `Route topilmadi: ${req.method} ${req.path}` });
};

// ---- Success response helper ----
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "OK",
  statusCode = 200,
  meta?: object
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  });
};
