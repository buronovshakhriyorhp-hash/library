// ===================== BOOK =====================
export interface Book {
  id: number;
  title: string;
  titleRu?: string;
  titleEn?: string;
  author: string;
  authorId?: number;
  categoryId?: number;
  category?: string;
  price: number; // UZS
  rating: number;
  reviews: number;
  image: string;
  description?: string;
  descriptionRu?: string;
  descriptionEn?: string;
  isbn?: string;
  pages?: number;
  year?: number;
  publisher?: string;
  inStock: boolean;
  stockCount: number;
  discount?: number; // %
  isFeatured?: boolean;
}

// ===================== AUTHOR =====================
export interface Author {
  id: number;
  name: string;
  nameRu?: string;
  bio?: string;
  bioRu?: string;
  image?: string;
  books?: Book[];
}

// ===================== CATEGORY =====================
export interface Category {
  id: number;
  slug: string;
  key: string; // i18n key
  icon?: string;
  count?: number;
}

// ===================== CART =====================
export interface CartItem {
  book: Book;
  quantity: number;
}

// ===================== ORDER =====================
export interface OrderItem {
  book: Book;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  userId?: number;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod?: 'click' | 'payme' | 'cash';
  address?: string;
  phone?: string;
  createdAt: string;
}

// ===================== USER =====================
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

// ===================== NEWS =====================
export interface NewsItem {
  id: number;
  date: string;
  title: string;
  titleRu?: string;
  titleEn?: string;
  body?: string;
  bodyRu?: string;
  bodyEn?: string;
  image?: string;
}

// ===================== API =====================
export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  limit?: number;
}

export interface BooksFilter {
  category?: string;
  authorId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

// ===================== AUTH =====================
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}
