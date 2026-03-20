import { OrderRepository } from "../repositories/order.repository";
import { AppError } from "../middleware/error.middleware";
import { OrderStatus } from "@prisma/client";

export interface OrderInput {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
  paymentMethod: string;
  items: Array<{ bookId: number; quantity: number }>;
}

export const createOrder = async (data: OrderInput, userId?: number) => {
  const { customerName, phone, address, city, note, paymentMethod, items } = data;
  const bookIds = items.map((i: any) => i.bookId);
  const books = await OrderRepository.validateBooks(bookIds);

  if (books.length !== bookIds.length) {
    throw new AppError("Bir yoki bir nechta kitob mavjud emas yoki sotuvda yo'q", 400);
  }

  interface MinimalBook {
    id: number;
    price: number;
    discount: number;
    titleUz: string;
    inStock: boolean;
    stockCount: number;
  }

  const bookMap = new Map<number, MinimalBook>(books.map((b: any) => [b.id, b as MinimalBook]));
  let subtotal = 0;
  const orderItems = items.map((item: any) => {
    const book = bookMap.get(item.bookId) as MinimalBook;
    if (!book) throw new AppError("Kitob topilmadi", 400);
    const price = book.discount
      ? Math.floor((book.price * (100 - book.discount)) / 100)
      : book.price;
    subtotal += price * item.quantity;
    return { bookId: item.bookId, quantity: item.quantity, price };
  });

  try {
    return await OrderRepository.createOrder({
      customerName,
      phone,
      address,
      city,
      note,
      paymentMethod,
      subtotal,
      total: subtotal, // delivery fee added later
      userId,
      items: orderItems,
    });
  } catch (err: any) {
    throw new AppError(err.message, 400);
  }
};

export const getUserOrders = async (userId: number) => {
  return await OrderRepository.getUserOrders(userId);
};

export const getAllOrders = async (page: number, limit: number, statusStr?: string) => {
  const status = statusStr as OrderStatus | undefined;
  const [orders, total] = await OrderRepository.getAllOrders(page, limit, status);
  return { orders, total, page, limit };
};

export const updateOrderStatus = async (id: number, statusStr: string) => {
  const status = statusStr as OrderStatus;
  return await OrderRepository.updateStatus(id, status);
};
