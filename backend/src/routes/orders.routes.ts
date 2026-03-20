import { Router } from "express";
import { authenticate, requireAdmin, optionalAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/error.middleware";
import { CreateOrderSchema } from "../lib/schemas";
import * as orderController from "../controllers/order.controller";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.post("/", optionalAuth, validate(CreateOrderSchema), asyncHandler(orderController.createOrder));
router.get("/my", authenticate, asyncHandler(orderController.getMyOrders));
router.get("/", authenticate, requireAdmin, asyncHandler(orderController.getAllOrders));
router.patch("/:id/status", authenticate, requireAdmin, asyncHandler(orderController.updateOrderStatus));

export default router;
