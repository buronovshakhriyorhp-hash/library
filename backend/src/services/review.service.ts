import { ReviewRepository } from "../repositories/review.repository";
import { AppError } from "../middleware/error.middleware";
import { prisma } from "../lib/prisma";

export const getBookReviews = async (bookId: number) => {
  return await ReviewRepository.getBookReviews(bookId);
};

export const addReview = async (userId: number, bookId: number, data: any) => {
  // Check if book exists
  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) throw new AppError("Kitob topilmadi", 404);

  // Check if user already reviewed
  const existing = await ReviewRepository.findUserReview(bookId, userId);
  if (existing) throw new AppError("Siz allaqachon sharh qoldirgansiz", 400);

  return await ReviewRepository.createReview({
    userId,
    bookId,
    rating: data.rating,
    comment: data.comment,
  });
};

export const deleteReview = async (id: number) => {
  try {
    await ReviewRepository.deleteReview(id);
    return { success: true };
  } catch (error) {
    throw new AppError("Sharh topilmadi", 404);
  }
};

export const toggleApproval = async (id: number, isApproved: boolean) => {
  try {
    return await ReviewRepository.toggleApproval(id, isApproved);
  } catch (error) {
    throw new AppError("Sharh topilmadi", 404);
  }
};
