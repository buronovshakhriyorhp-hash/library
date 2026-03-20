import { Request, Response } from "express";
import * as orderService from "../services/order.service";
import { sendSuccess } from "../middleware/error.middleware";

export const createOrder = async (req: Request, res: Response) => {
  const order = await orderService.createOrder(req.body, req.user?.userId);
  sendSuccess(res, order, "Buyurtma qabul qilindi", 201);
};

export const getMyOrders = async (req: Request, res: Response) => {
  const orders = await orderService.getUserOrders(req.user!.userId);
  sendSuccess(res, orders);
};

export const getAllOrders = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const status = req.query.status as string | undefined;

  const result = await orderService.getAllOrders(page, limit, status);
  sendSuccess(res, result.orders, "OK", 200, { page: result.page, limit: result.limit, total: result.total });
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  const order = await orderService.updateOrderStatus(Number(req.params.id), status);
  sendSuccess(res, order);
};
