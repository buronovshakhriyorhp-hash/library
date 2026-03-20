import api from "@/lib/api";
import type { BooksFilter } from "@/types";

// ==================== TYPES ====================
export interface ApiAuthor {
  id: number;
  nameUz: string;
  nameRu: string;
}

export interface ApiCategory {
  id: number;
  slug: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  icon?: string;
  _count?: { books: number };
}

export interface ApiBook {
  id: number;
  slug: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  descriptionUz?: string;
  descriptionRu?: string;
  descriptionEn?: string;
  price: number;
  discount?: number;
  image?: string;
  inStock: boolean;
  stockCount: number;
  isFeatured: boolean;
  isbn?: string;
  publisher?: string;
  pages?: number;
  publishedYear?: number;
  rating: number;
  reviewCount: number;
  viewCount: number;
  author: ApiAuthor;
  category: ApiCategory;
}

export interface PaginatedBooksResponse {
  success: boolean;
  data: ApiBook[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ===================== ADMIN CRUD =====================

export const createBook = async (data: Partial<ApiBook>): Promise<ApiBook> => {
  const res = await api.post<{ success: boolean; data: ApiBook }>("/books", data);
  return res.data.data;
};

export const updateBook = async (id: number, data: Partial<ApiBook>): Promise<ApiBook> => {
  const res = await api.patch<{ success: boolean; data: ApiBook }>(`/books/${id}`, data);
  return res.data.data;
};

export const deleteBook = async (id: number): Promise<void> => {
  await api.delete(`/books/${id}`);
};


export interface SingleBookResponse {
  success: boolean;
  data: ApiBook;
}

// ==================== HELPERS ====================
/** Backend ApiBook ni frontend Book tipiga o'giradi */
export const mapApiBookToBook = (b: ApiBook) => ({
  id: b.id,
  slug: b.slug,
  title: b.titleUz,
  titleRu: b.titleRu,
  titleEn: b.titleEn,
  author: b.author?.nameUz ?? "Noma'lum",
  authorId: b.author?.id,
  categoryId: b.category?.id,
  category: b.category?.nameUz,
  categorySlug: b.category?.slug,
  price: b.price,
  discount: b.discount,
  rating: b.rating ?? 0,
  reviews: b.reviewCount ?? 0,
  image: b.image ?? "/no-cover.jpg",
  inStock: b.inStock,
  stockCount: b.stockCount ?? 0,
  isFeatured: b.isFeatured,
  isbn: b.isbn,
  publisher: b.publisher,
  pages: b.pages,
  year: b.publishedYear,
  description: b.descriptionUz,
  descriptionRu: b.descriptionRu,
  descriptionEn: b.descriptionEn,
});

// ==================== API CALLS ====================

/**
 * GET /api/books — Kitoblar ro'yxati (filter, pagination bilan)
 */
export const fetchBooks = async (filters: BooksFilter = {}) => {
  const params: Record<string, string | number | boolean> = {};
  if (filters.category)  params.category  = filters.category;
  if (filters.authorId)  params.authorId  = filters.authorId;
  if (filters.search)    params.search    = filters.search;
  if (filters.minPrice)  params.minPrice  = filters.minPrice;
  if (filters.maxPrice)  params.maxPrice  = filters.maxPrice;
  if (filters.sort)      params.sort      = filters.sort;
  if (filters.page)      params.page      = filters.page;
  if (filters.limit)     params.limit     = filters.limit;

  const res = await api.get<PaginatedBooksResponse>("/books", { params });
  return res.data;
};

/**
 * GET /api/books?featured=true — Tanlangan kitoblar
 */
export const fetchFeaturedBooks = async () => {
  const res = await api.get<PaginatedBooksResponse>("/books", {
    params: { featured: true, limit: 12 },
  });
  return res.data;
};

/**
 * GET /api/books/:slug — Bitta kitob ma'lumotlari
 */
export const fetchBookBySlug = async (slug: string) => {
  const res = await api.get<SingleBookResponse>(`/books/${slug}`);
  return res.data;
};
