import { BookRepository } from "../repositories/book.repository";
import { AppError } from "../middleware/error.middleware";
import { prisma } from "../lib/prisma";

import { Prisma } from "@prisma/client";

interface BookFilters {
  page?: number;
  limit?: number;
  category?: string;
  authorId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  featured?: boolean;
}

export const getPaginatedBooks = async (filters: BookFilters) => {
  const { pageNum = 1, limitNum = 10, category, authorId, search, minPrice, maxPrice, sort, featured } = {
    ...filters,
    pageNum: Number(filters.page) || 1,
    limitNum: Number(filters.limit) || 10
  };

  const where: Prisma.BookWhereInput = { isActive: true };
  if (category) {
    const cat = await prisma.category.findUnique({ where: { slug: category } });
    if (cat) where.categoryId = cat.id;
  }
  if (authorId) where.authorId = authorId;
  if (featured) where.isFeatured = true;
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {
      ...(minPrice !== undefined ? { gte: minPrice } : {}),
      ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
    };
  }
  if (search) {
    where.OR = [
      { titleUz: { contains: search, mode: "insensitive" } },
      { titleRu: { contains: search, mode: "insensitive" } },
      { titleEn: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy =
    sort === "price_asc" ? { price: "asc" as const } :
    sort === "price_desc" ? { price: "desc" as const } :
    sort === "featured" ? { isFeatured: "desc" as const } :
    { createdAt: "desc" as const };

  const [books, total] = await Promise.all([
    BookRepository.findBooks(where, (pageNum - 1) * limitNum, limitNum, orderBy),
    BookRepository.countBooks(where)
  ]);

  if (books.length === 0) {
    return { books: [], meta: { page: pageNum, limit: limitNum, total: 0, totalPages: 0 } };
  }

  // N+1 Query Optimization
  const bookIds = books.map((b) => b.id);
  const statsMap = await BookRepository.getBooksStatsMap(bookIds);

  const booksWithStats = books.map((book) => {
    const stats = statsMap[book.id] || { rating: 0, count: 0 };
    return { ...book, rating: stats.rating, reviewCount: stats.count };
  });

  return {
    books: booksWithStats,
    meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) }
  };
};

export const getBookDetail = async (identifier: string | number) => {
  const book = await BookRepository.findBookBySlugOrId(identifier);
  if (!book) throw new AppError("Kitob topilmadi", 404);

  // Increment views
  await BookRepository.incrementViewCount(book.id);

  // Calculate local stats explicitly retrieved through reviews relation mapping since it's a single item
  const rating = book.reviews.length
    ? book.reviews.reduce((s: number, r: any) => s + r.rating, 0) / book.reviews.length
    : 0;

  return { ...book, rating, reviewCount: book.reviews.length };
};

export const createBook = async (data: any) => {
  return BookRepository.createBook(data);
};

export const updateBook = async (id: number, data: any) => {
  return BookRepository.updateBook(id, data);
};

export const deleteBook = async (id: number) => {
  return BookRepository.updateBook(id, { isActive: false });
};
