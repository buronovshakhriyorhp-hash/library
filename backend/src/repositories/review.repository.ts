import { prisma } from "../lib/prisma";

export class ReviewRepository {
  static async getBookReviews(bookId: number) {
    return prisma.review.findMany({
      where: { bookId, isApproved: true },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async findUserReview(bookId: number, userId: number) {
    return prisma.review.findUnique({
      where: { bookId_userId: { bookId, userId } },
    });
  }

  static async createReview(data: any) {
    return prisma.review.create({
      data: {
        rating: data.rating,
        comment: data.comment,
        bookId: data.bookId,
        userId: data.userId,
        isApproved: true, // Auto-approve for now, can be changed based on business logic
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });
  }

  static async deleteReview(id: number) {
    return prisma.review.delete({
      where: { id },
    });
  }

  static async toggleApproval(id: number, isApproved: boolean) {
    return prisma.review.update({
      where: { id },
      data: { isApproved },
    });
  }
}
