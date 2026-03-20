import { Router } from "express";
import { validate } from "../middleware/error.middleware";
import { LoginSchema, RegisterSchema } from "../lib/schemas";
import { authenticate } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/asyncHandler";
import * as authController from "../controllers/auth.controller";

const router = Router();

router.post("/register", validate(RegisterSchema), asyncHandler(authController.register));
router.post("/login", validate(LoginSchema), asyncHandler(authController.login));
router.post("/refresh", asyncHandler(authController.refresh));
router.post("/logout", authenticate, asyncHandler(authController.logout));
router.get("/me", authenticate, asyncHandler(authController.getMe));

export default router;
