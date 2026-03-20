import { Request, Response } from "express";
import * as cartService from "../services/cart.service";
import { sendSuccess } from "../middleware/error.middleware";

export const getCart = async (req: Request, res: Response) => {
  const cart = await cartService.getCart(req.user!.userId);
  
  // Calculate totals
  let totalItems = 0;
  let totalPrice = 0;
  
  cart.forEach(item => {
    totalItems += item.quantity;
    const finalPrice = item.book.discount 
      ? Math.floor(item.book.price * (100 - item.book.discount) / 100)
      : item.book.price;
    totalPrice += finalPrice * item.quantity;
  });

  sendSuccess(res, { items: cart, totalItems, totalPrice });
};

export const addToCart = async (req: Request, res: Response) => {
  const item = await cartService.addToCart(req.user!.userId, req.body);
  sendSuccess(res, item, "Savatga qo'shildi", 201);
};

export const updateQuantity = async (req: Request, res: Response) => {
  await cartService.updateQuantity(req.user!.userId, Number(req.params.id), req.body);
  sendSuccess(res, null, "Miqdor yangilandi");
};

export const removeFromCart = async (req: Request, res: Response) => {
  await cartService.removeFromCart(req.user!.userId, Number(req.params.id));
  sendSuccess(res, null, "Savatdan o'chirildi");
};

export const clearCart = async (req: Request, res: Response) => {
  await cartService.clearCart(req.user!.userId);
  sendSuccess(res, null, "Savat tozalandi");
};
