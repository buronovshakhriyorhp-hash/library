import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export class BookRepository {
  static async findBooks(where: Prisma.BookWhereInput, skip: number, take: number, orderBy: Prisma.BookOrderByWithRelationInput) {
    return prisma.book.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        category: { select: { slug: true, nameUz: true, nameRu: true, nameEn: true } },
        author: { select: { id: true, nameUz: true, nameRu: true } },
      },
    });
  }

  static async countBooks(where: Prisma.BookWhereInput) {
    return prisma.book.count({ where });
  }

  static async findBookBySlugOrId(identifier: string | number) {
    // If it's pure number
    let idCondition: Prisma.BookWhereInput[] = [];
    if (!isNaN(Number(identifier))) {
      idCondition.push({ id: Number(identifier) });
    }

    return prisma.book.findFirst({
      where: {
        OR: [{ slug: String(identifier) }, ...idCondition],
        isActive: true,
      },
      include: {
        category: true,
        author: true,
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
  }

  static async incrementViewCount(id: number) {
    return prisma.book.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }

  static async createBook(data: Prisma.BookCreateInput) {
    return prisma.book.create({ data });
  }

  static async updateBook(id: number, data: Prisma.BookUpdateInput) {
    return prisma.book.update({ where: { id }, data });
  }

  // N+1 Otimization: GroupBy query to get all ratings at once
  static async getBooksStatsMap(bookIds: number[]) {
    if (bookIds.length === 0) return {};

    const aggregates = await prisma.review.groupBy({
      by: ['bookId'],
      where: { bookId: { in: bookIds }, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true }
    });
    
    const statsMap: Record<number, { rating: number; count: number }> = {};
    aggregates.forEach((agg) => {
      statsMap[agg.bookId] = {
        rating: agg._avg.rating || 0,
        count: agg._count.rating || 0
      };
    });

    return statsMap;
  }
}
