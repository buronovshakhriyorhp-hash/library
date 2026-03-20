import api from "@/lib/api";

// ==================== TYPES ====================
export interface CreateOrderItem {
  bookId: number;
  quantity: number;
}

export interface CreateOrderData {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
  paymentMethod: "click" | "payme" | "cash";
  items: CreateOrderItem[];
}

export interface ApiOrderItem {
  id: number;
  bookId: number;
  quantity: number;
  price: number;
  book: {
    id: number;
    titleUz: string;
    image?: string;
    slug: string;
  };
}

export interface ApiOrder {
  id: number;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  total: number;
  subtotal: number;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
  createdAt: string;
  items: ApiOrderItem[];
}

// ==================== API CALLS ====================

/**
 * POST /api/orders — Yangi buyurtma yaratish
 */
export const createOrder = async (data: CreateOrderData): Promise<ApiOrder> => {
  const res = await api.post<{ success: boolean; data: ApiOrder }>("/orders", data);
  return res.data.data;
};

/**
 * GET /api/orders/my — Foydalanuvchining buyurtmalari
 */
export const fetchMyOrders = async (): Promise<ApiOrder[]> => {
  const res = await api.get<{ success: boolean; data: ApiOrder[] }>("/orders/my");
  return res.data.data;
};

/**
 * GET /api/orders — Barcha buyurtmalar (Admin)
 */
export const fetchAdminOrders = async (): Promise<ApiOrder[]> => {
  const res = await api.get<{ success: boolean; data: ApiOrder[] }>("/orders");
  return res.data.data;
};

/**
 * PATCH /api/orders/:id/status — Holatni yangilash (Admin)
 */
export const updateOrderStatus = async (id: number, status: string): Promise<ApiOrder> => {
  const res = await api.patch<{ success: boolean; data: ApiOrder }>(`/orders/${id}/status`, { status });
  return res.data.data;
};

