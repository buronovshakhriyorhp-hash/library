import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/error.middleware";
import { AddToCartSchema } from "../lib/schemas";
import { asyncHandler } from "../middleware/asyncHandler";
import * as cartController from "../controllers/cart.controller";

const router = Router();

router.use(authenticate); // Barcha cart routelari himoyalangan

router.get("/", asyncHandler(cartController.getCart));
router.post("/", validate(AddToCartSchema), asyncHandler(cartController.addToCart));
router.patch("/:id", asyncHandler(cartController.updateQuantity));
router.delete("/:id", asyncHandler(cartController.removeFromCart));
router.delete("/", asyncHandler(cartController.clearCart));

export default router;
