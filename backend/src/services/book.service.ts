import { BookRepository } from "../repositories/book.repository";
import { AppError } from "../middleware/error.middleware";
import { prisma } from "../lib/prisma";

export const getPaginatedBooks = async (filters: any) => {
  const { page = 1, limit = 10, category, authorId, search, minPrice, maxPrice, sort, featured } = filters;

  const where: any = { isActive: true };
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
    BookRepository.findBooks(where, (page - 1) * limit, limit, orderBy),
    BookRepository.countBooks(where)
  ]);

  if (books.length === 0) {
    return { books: [], meta: { page, limit, total: 0, totalPages: 0 } };
  }

  // N+1 Query Optimization: barcha book IDealarini yig'ish va yagona query jo'natish
  const bookIds = books.map((b) => b.id);
  const statsMap = await BookRepository.getBooksStatsMap(bookIds);

  const booksWithStats = books.map((book) => {
    const stats = statsMap[book.id] || { rating: 0, count: 0 };
    return { ...book, rating: stats.rating, reviewCount: stats.count };
  });

  return {
    books: booksWithStats,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
};

export const getBookDetail = async (identifier: string | number) => {
  const book = await BookRepository.findBookBySlugOrId(identifier);
  if (!book) throw new AppError("Kitob topilmadi", 404);

  // Increment views
  await BookRepository.incrementViewCount(book.id);

  // Calculate local stats explicitly retrieved through reviews relation mapping since it's a single item
  const rating = book.reviews.length
    ? book.reviews.reduce((s, r) => s + r.rating, 0) / book.reviews.length
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
