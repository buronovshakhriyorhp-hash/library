import "dotenv/config";
import "express-async-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import { errorHandler, notFound } from "./middleware/error.middleware";

// Routes
import authRoutes from "./routes/auth.routes";
import booksRoutes from "./routes/books.routes";
import ordersRoutes from "./routes/orders.routes";
import paymentRoutes from "./routes/payment.routes";
import newsRoutes from "./routes/news.routes";
import categoriesRoutes from "./routes/categories.routes";
import uploadRoutes from "./routes/upload.routes";
import authorsRoutes from "./routes/authors.routes";
import cartRoutes from "./routes/cart.routes";
import reviewsRoutes from "./routes/reviews.routes";
import path from "path";

// ================================================================
const app = express();
const PORT = process.env.PORT || 5000;

// ================================================================
// SECURITY & PERF MIDDLEWARE
// ================================================================

app.use(helmet());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// CORS
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(o => o.trim())
  : ["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS orqali ruxsat etilmagan origin"));
      }
    },
    credentials: true, 
  })
);

// Body parsing
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// General rate limit
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: { success: false, message: "Juda ko'p so'rov. Biroz kuting." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Juda ko'p urinish. 15 daqiqadan keyin qayta urinib ko'ring." },
});

app.use("/api", generalLimiter);

// ================================================================
// HEALTH CHECK
// ================================================================

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ================================================================
// API ROUTES
// ================================================================

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/authors", authorsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewsRoutes);

// Fayllarni static ko'rsatish
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

// API v1 docs (basic)
app.get("/api", (_req, res) => {
  res.json({
    name: "Ziyo Chashmasi API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth (register, login, logout, refresh, me)",
      books: "/api/books (GET /, GET /:slug, POST, PATCH, DELETE)",
      orders: "/api/orders (POST /, GET /my, GET / [admin])",
      payment: "/api/payment/click/prepare, /click/complete, /payme, /status/:id",
      news: "/api/news (GET /, GET /:slug, POST, PATCH, DELETE [admin])",
      categories: "/api/categories (GET /, GET /:slug)",
      authors: "/api/authors (GET /, GET /:id, POST, PATCH, DELETE [admin])",
      cart: "/api/cart (GET, POST, PATCH, DELETE)",
      reviews: "/api/reviews (GET /book/:id, POST /book/:id)",
    },
  });
});

// ================================================================
// ERROR HANDLERS
// ================================================================

app.use(notFound);
app.use(errorHandler);

// ================================================================
// START SERVER
// ================================================================

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║      Ziyo Chashmasi Backend API          ║
║  🚀 Server: http://localhost:${PORT}       ║
║  📊 Mode: ${process.env.NODE_ENV?.padEnd(29)}║
╚══════════════════════════════════════════╝
  `);
});

export default app;
