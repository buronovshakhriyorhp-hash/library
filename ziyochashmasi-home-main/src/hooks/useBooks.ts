import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchBooks,
  fetchFeaturedBooks,
  fetchBookBySlug,
  createBook,
  updateBook,
  deleteBook,
  mapApiBookToBook,
} from "@/services/books.service";
import type { BooksFilter } from "@/types";

// ===================== QUERY KEYS =====================
export const BOOK_KEYS = {
  all: ["books"] as const,
  list: (filters: BooksFilter) => ["books", "list", filters] as const,
  featured: () => ["books", "featured"] as const,
  detail: (slug: string) => ["books", "detail", slug] as const,
};

// ===================== useBooks =====================
export const useBooks = (filters: BooksFilter = {}) => {
  return useQuery({
    queryKey: BOOK_KEYS.list(filters),
    queryFn: () => fetchBooks(filters),
    staleTime: 5 * 60 * 1000,
    select: (data) => ({
      books: data.data.map(mapApiBookToBook),
      pagination: data.meta,
    }),
  });
};

export const useFeaturedBooks = () => {
  return useQuery({
    queryKey: BOOK_KEYS.featured(),
    queryFn: fetchFeaturedBooks,
    staleTime: 10 * 60 * 1000,
    select: (data) => data.data.map(mapApiBookToBook),
  });
};

export const useBook = (slugOrId: string | undefined) => {
  return useQuery({
    queryKey: BOOK_KEYS.detail(slugOrId ?? ""),
    queryFn: () => fetchBookBySlug(slugOrId!),
    enabled: !!slugOrId,
    staleTime: 5 * 60 * 1000,
    select: (data) => mapApiBookToBook(data.data),
  });
};

// ===================== ADMIN MUTATIONS =====================

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOK_KEYS.all });
      toast.success("Kitob muvaffaqiyatli qo'shildi");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateBook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOK_KEYS.all });
      toast.success("Kitob muvaffaqiyatli yangilandi");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOK_KEYS.all });
      toast.success("Kitob muvaffaqiyatli o'chirildi");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    },
  });
};
