import { z } from "zod";

// ---- Auth schemas ----
export const RegisterSchema = z.object({
  name: z.string().min(2, "Kamida 2 ta harf"),
  email: z.string().email("Noto'g'ri email"),
  password: z.string().min(6, "Kamida 6 ta belgi"),
  phone: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Noto'g'ri email"),
  password: z.string().min(1, "Parol kiritish shart"),
});

// ---- Book schemas ----
export const CreateBookSchema = z.object({
  titleUz: z.string().min(1),
  titleRu: z.string().optional(),
  titleEn: z.string().optional(),
  slug: z.string().min(1),
  descUz: z.string().optional(),
  descRu: z.string().optional(),
  descEn: z.string().optional(),
  isbn: z.string().optional(),
  price: z.number().positive(),
  discount: z.number().min(0).max(100).default(0),
  image: z.string().optional(),
  pages: z.number().optional(),
  year: z.number().optional(),
  publisher: z.string().optional(),
  inStock: z.boolean().default(true),
  stockCount: z.number().min(0).default(0),
  isFeatured: z.boolean().default(false),
  categoryId: z.number().optional(),
  authorId: z.number().optional(),
});

export const UpdateBookSchema = CreateBookSchema.partial();

// ---- Order schemas ----
export const CreateOrderSchema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(9),
  address: z.string().min(5),
  city: z.string().min(2),
  note: z.string().optional(),
  paymentMethod: z.enum(["CASH", "CLICK", "PAYME"]).default("CASH"),
  items: z.array(
    z.object({
      bookId: z.number().int().positive(),
      quantity: z.number().int().positive(),
    })
  ).min(1, "Kamida 1 ta kitob"),
});

// ---- Books filter schema ----
export const BooksQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(12),
  category: z.string().optional(),
  authorId: z.coerce.number().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sort: z.enum(["price_asc", "price_desc", "rating", "newest", "featured"]).default("newest"),
  featured: z.coerce.boolean().optional(),
});

// ---- News schemas ----
export const CreateNewsSchema = z.object({
  slug: z.string().min(1),
  titleUz: z.string().min(1),
  titleRu: z.string().optional(),
  titleEn: z.string().optional(),
  bodyUz: z.string().min(1),
  bodyRu: z.string().optional(),
  bodyEn: z.string().optional(),
  image: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED"),
});

export const UpdateNewsSchema = CreateNewsSchema.partial();

// ---- Review schema ----
export const CreateReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

// ---- Author schemas ----
export const CreateAuthorSchema = z.object({
  nameUz: z.string().min(1),
  nameRu: z.string().optional(),
  nameEn: z.string().optional(),
  bioUz: z.string().optional(),
  bioRu: z.string().optional(),
  bioEn: z.string().optional(),
  image: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

export const UpdateAuthorSchema = CreateAuthorSchema.partial();

// ---- Cart schemas ----
export const AddToCartSchema = z.object({
  bookId: z.number().int().positive(),
  quantity: z.number().int().positive().default(1),
});
