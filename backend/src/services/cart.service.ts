import { CartRepository } from "../repositories/cart.repository";
import { AppError } from "../middleware/error.middleware";
import { prisma } from "../lib/prisma";

export const getCart = async (userId: number) => {
  return await CartRepository.getCart(userId);
};

export const addToCart = async (userId: number, data: any) => {
  const { bookId, quantity } = data;
  
  // Verify book exists and has stock
  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) throw new AppError("Kitob topilmadi", 404);
  if (!book.inStock || book.stockCount < quantity) {
    throw new AppError("Kechirasiz, ushbu kitobdan yetarli miqdorda qolmagan", 400);
  }

  return await CartRepository.addToCart(userId, bookId, quantity);
};

export const updateQuantity = async (userId: number, id: number, data: any) => {
  const { quantity } = data;
  if (quantity < 1) throw new AppError("Miqdor 1 dan kam bo'lishi mumkin emas", 400);

  const updated = await CartRepository.updateQuantity(userId, id, quantity);
  if (updated.count === 0) throw new AppError("Savat elementi topilmadi", 404);
  
  return { success: true };
};

export const removeFromCart = async (userId: number, id: number) => {
  const deleted = await CartRepository.removeFromCart(userId, id);
  if (deleted.count === 0) throw new AppError("Savat elementi topilmadi", 404);
  return { success: true };
};

export const clearCart = async (userId: number) => {
  await CartRepository.clearCart(userId);
  return { success: true };
};
