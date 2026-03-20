import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authenticate, requireAdmin } from "../middleware/auth.middleware";
import { sendSuccess } from "../middleware/error.middleware";

// Yuklanadigan jildni yaratish
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    // Faqat rasmlarni qabul qilish
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Faqat rasm(image) turidagi fayllar qabul qilinadi"));
    }
  },
});

const router = Router();

// POST /api/upload
router.post(
  "/",
  authenticate,
  requireAdmin,
  upload.single("image"),
  (req: Request, res: Response): void => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: "Fayl topilmadi" });
        return;
      }

      // Magic Bytes orqali xavfsizlik tekshiruvi (Spoofing prevention)
      const buffer = Buffer.alloc(4);
      const fd = fs.openSync(req.file.path, 'r');
      fs.readSync(fd, buffer, 0, 4, 0);
      fs.closeSync(fd);
      const hex = buffer.toString('hex').toUpperCase();
      const isJpeg = hex.startsWith('FFD8FF');
      const isPng = hex.startsWith('89504E47');
      const isWebp = hex.startsWith('52494646');

      if (!isJpeg && !isPng && !isWebp) {
        fs.unlinkSync(req.file.path);
        res.status(400).json({ success: false, message: "Zararli fayl yoki noto'g'ri rasm turi. Faqat sof JPEG, PNG, WEBP qabul qilinadi!" });
        return;
      }

      // Fayl public url qaytariladi
      const fileUrl = `/uploads/${req.file.filename}`;
      sendSuccess(res, { url: fileUrl }, "Fayl muvaffaqiyatli yuklandi", 201);
    } catch (error) {
      if (req.file?.path) fs.unlinkSync(req.file.path);
      res.status(500).json({ success: false, message: "Server xatosi" });
    }
  }
);

export default router;
