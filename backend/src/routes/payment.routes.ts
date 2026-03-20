import { Router } from "express";
import * as paymentController from "../controllers/payment.controller";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.post("/click/prepare", asyncHandler(paymentController.clickPrepare));
router.post("/click/complete", asyncHandler(paymentController.clickComplete));
router.post("/payme", asyncHandler(paymentController.paymeTransaction));
router.get("/status/:orderId", asyncHandler(paymentController.getPaymentStatus));

export default router;
