import { Router } from "express";
import * as categoryController from "../controllers/category.controller";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get("/", asyncHandler(categoryController.getAllCategories));
router.get("/:slug", asyncHandler(categoryController.getCategoryBySlug));

export default router;
