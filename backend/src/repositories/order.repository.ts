import { prisma } from "../lib/prisma";
import { OrderStatus } from "@prisma/client";

export class OrderRepository {
  static async validateBooks(bookIds: number[]) {
    return prisma.book.findMany({
      where: { id: { in: bookIds }, isActive: true, inStock: true, stockCount: { gt: 0 } },
    });
  }

  static async createOrder(data: any) {
    return prisma.$transaction(async (tx) => {
      // Ombor qoldig'ini tekshirish va kamaytirish (Stock deduction) qismi:
      for (const item of data.items) {
        if (item.quantity <= 0) {
          throw new Error("Noto'g'ri kitob miqdori");
        }
        const book = await tx.book.findUnique({ where: { id: item.bookId } });
        if (!book || book.stockCount < item.quantity || !book.inStock) {
          throw new Error(`Kechirasiz, "${book?.titleUz || 'Ushbu kitob'}" tushib qolgan yoki bazada yetarli emasi`);
        }
        
        await tx.book.update({
          where: { id: item.bookId },
          data: {
            stockCount: { decrement: item.quantity },
            inStock: book.stockCount - item.quantity > 0
          }
        });
      }

      // Buyurtmani yaratish
      return tx.order.create({
        data: {
          customerName: data.customerName,
          phone: data.phone,
          address: data.address,
          city: data.city,
          note: data.note,
          paymentMethod: data.paymentMethod,
          subtotal: data.subtotal,
          total: data.total,
          userId: data.userId,
          items: { create: data.items },
        },
        include: {
          items: { include: { book: { select: { id: true, titleUz: true, image: true } } } },
        },
      });
    });
  }

  static async getUserOrders(userId: number) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: { book: { select: { id: true, titleUz: true, image: true, slug: true } } },
        },
      },
    });
  }

  static async getAllOrders(page: number, limit: number, status?: OrderStatus) {
    const where = status ? { status } : {};
    return Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { include: { book: { select: { titleUz: true } } } },
        },
      }),
      prisma.order.count({ where }),
    ]);
  }

  static async updateStatus(id: number, status: OrderStatus) {
    return prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}
