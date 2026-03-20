import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth.middleware";
import { validate } from "../middleware/error.middleware";
import { CreateAuthorSchema, UpdateAuthorSchema } from "../lib/schemas";
import { asyncHandler } from "../middleware/asyncHandler";
import * as authorController from "../controllers/author.controller";

const router = Router();

router.get("/", asyncHandler(authorController.getAuthors));
router.get("/:id", asyncHandler(authorController.getAuthorById));
router.post("/", authenticate, requireAdmin, validate(CreateAuthorSchema), asyncHandler(authorController.createAuthor));
router.patch("/:id", authenticate, requireAdmin, validate(UpdateAuthorSchema), asyncHandler(authorController.updateAuthor));
router.delete("/:id", authenticate, requireAdmin, asyncHandler(authorController.deleteAuthor));

export default router;
