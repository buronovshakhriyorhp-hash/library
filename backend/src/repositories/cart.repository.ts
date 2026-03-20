import { prisma } from "../lib/prisma";

export class CartRepository {
  static async getCart(userId: number) {
    return prisma.cartItem.findMany({
      where: { userId },
      include: {
        book: {
          select: { id: true, titleUz: true, slug: true, image: true, price: true, discount: true, inStock: true, stockCount: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async findCartItem(userId: number, bookId: number) {
    return prisma.cartItem.findUnique({
      where: { userId_bookId: { userId, bookId } },
    });
  }

  static async addToCart(userId: number, bookId: number, quantity: number) {
    const existing = await this.findCartItem(userId, bookId);
    if (existing) {
      return prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { book: { select: { titleUz: true, price: true, discount: true } } },
      });
    }
    return prisma.cartItem.create({
      data: { userId, bookId, quantity },
      include: { book: { select: { titleUz: true, price: true, discount: true } } },
    });
  }

  static async updateQuantity(userId: number, id: number, quantity: number) {
    return prisma.cartItem.updateMany({
      where: { id, userId }, // ensure item belongs to user
      data: { quantity },
    });
  }

  static async removeFromCart(userId: number, id: number) {
    return prisma.cartItem.deleteMany({
      where: { id, userId },
    });
  }

  static async clearCart(userId: number) {
    return prisma.cartItem.deleteMany({
      where: { userId },
    });
  }
}
