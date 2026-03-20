import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth.middleware";
import { validate } from "../middleware/error.middleware";
import { CreateNewsSchema, UpdateNewsSchema } from "../lib/schemas";
import * as newsController from "../controllers/news.controller";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get("/", asyncHandler(newsController.getNewsList));
router.get("/:slug", asyncHandler(newsController.getNewsBySlug));
router.post("/", authenticate, requireAdmin, validate(CreateNewsSchema), asyncHandler(newsController.createNews));
router.patch("/:id", authenticate, requireAdmin, validate(UpdateNewsSchema), asyncHandler(newsController.updateNews));
router.delete("/:id", authenticate, requireAdmin, asyncHandler(newsController.deleteNews));

export default router;
