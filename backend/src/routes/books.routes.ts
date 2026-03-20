import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth.middleware";
import { validate } from "../middleware/error.middleware";
import { CreateBookSchema, UpdateBookSchema } from "../lib/schemas";
import { asyncHandler } from "../middleware/asyncHandler";
import * as bookController from "../controllers/book.controller";

const router = Router();

router.get("/", asyncHandler(bookController.getBooks));
router.get("/:slug", asyncHandler(bookController.getBookDetail));
router.post("/", authenticate, requireAdmin, validate(CreateBookSchema), asyncHandler(bookController.createBook));
router.patch("/:id", authenticate, requireAdmin, validate(UpdateBookSchema), asyncHandler(bookController.updateBook));
router.delete("/:id", authenticate, requireAdmin, asyncHandler(bookController.deleteBook));

export default router;
