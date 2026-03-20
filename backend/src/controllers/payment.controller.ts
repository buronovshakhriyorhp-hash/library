import { Request, Response } from "express";
import * as paymentService from "../services/payment.service";
import { sendSuccess } from "../middleware/error.middleware";

export const clickPrepare = async (req: Request, res: Response) => {
  const result = await paymentService.clickPrepare(req.body);
  res.json(result);
};

export const clickComplete = async (req: Request, res: Response) => {
  const result = await paymentService.clickComplete(req.body);
  res.json(result);
};

export const paymeTransaction = async (req: Request, res: Response) => {
  const { method, params, id } = req.body;

  // Basic auth check
  const authHeader = req.headers.authorization || "";
  const base64 = authHeader.replace("Basic ", "");
  const decoded = Buffer.from(base64, "base64").toString("utf-8");
  const [login, key] = decoded.split(":");

  const isTestMode = process.env.NODE_ENV !== "production";
  const expectedKey = isTestMode
    ? process.env.PAYME_TEST_KEY
    : process.env.PAYME_SECRET_KEY;

  if (login !== "Paycom" || key !== expectedKey) {
    res.json({ error: { code: -32504, message: { uz: "Autentifikatsiya xatosi" } }, id });
    return;
  }

  const result = await paymentService.paymeTransaction(method, params, id);
  res.json(result);
};

export const getPaymentStatus = async (req: Request, res: Response) => {
  const status = await paymentService.getPaymentStatus(Number(req.params.orderId));
  sendSuccess(res, status);
};
