import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOrder, fetchMyOrders, fetchAdminOrders, updateOrderStatus } from "@/services/orders.service";
import type { CreateOrderData } from "@/services/orders.service";
import { toast } from "sonner";

// ===================== QUERY KEYS =====================
export const ORDER_KEYS = {
  my: ["orders", "my"] as const,
  admin: ["orders", "admin"] as const,
};

// ===================== useMyOrders =====================
/**
 * Joriy foydalanuvchining buyurtmalarini oladi.
 * ProfilePage uchun.
 */
export const useMyOrders = () => {
  return useQuery({
    queryKey: ORDER_KEYS.my,
    queryFn: fetchMyOrders,
    staleTime: 2 * 60 * 1000,
  });
};

// ===================== useCreateOrder =====================
/**
 * Yangi buyurtma yaratish mutation.
 * CheckoutPage uchun.
 * Muvaffaqiyatli bo'lganda orders cache yangilanadi.
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderData) => createOrder(data),
    onSuccess: () => {
      // Buyurtmalar ro'yxatini yangilaydi
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.my });
      toast.success("Buyurtmangiz qabul qilindi! 🎉");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Xatolik yuz berdi. Qayta urining.");
    },
  });
};

// ===================== ADMIN HOOKS =====================

export const useAdminOrders = () => {
  return useQuery({
    queryKey: ORDER_KEYS.admin,
    queryFn: fetchAdminOrders,
    staleTime: 60 * 1000,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.admin });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.my });
      toast.success("Buyurtma holati yangilandi");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Xatolik yuz berdi");
    },
  });
};
