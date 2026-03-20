import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth.middleware";
import { validate } from "../middleware/error.middleware";
import { CreateReviewSchema } from "../lib/schemas";
import { asyncHandler } from "../middleware/asyncHandler";
import * as reviewController from "../controllers/review.controller";

const router = Router();

// Public routes
router.get("/book/:bookId", asyncHandler(reviewController.getBookReviews));

// Protected user routes
router.post("/book/:bookId", authenticate, validate(CreateReviewSchema), asyncHandler(reviewController.addReview));

// Admin routes
router.delete("/:id", authenticate, requireAdmin, asyncHandler(reviewController.deleteReview));
router.patch("/:id/approval", authenticate, requireAdmin, asyncHandler(reviewController.toggleApproval));

export default router;
