import { Request, Response } from "express";
import * as reviewService from "../services/review.service";
import { sendSuccess } from "../middleware/error.middleware";

export const getBookReviews = async (req: Request, res: Response) => {
  const reviews = await reviewService.getBookReviews(Number(req.params.bookId));
  sendSuccess(res, reviews);
};

export const addReview = async (req: Request, res: Response) => {
  const review = await reviewService.addReview(req.user!.userId, Number(req.params.bookId), req.body);
  sendSuccess(res, review, "Sharh muvaffaqiyatli qo'shildi", 201);
};

export const deleteReview = async (req: Request, res: Response) => {
  await reviewService.deleteReview(Number(req.params.id));
  sendSuccess(res, null, "Sharh o'chirildi");
};

export const toggleApproval = async (req: Request, res: Response) => {
  const review = await reviewService.toggleApproval(Number(req.params.id), req.body.isApproved);
  sendSuccess(res, review, "Sharh holati o'zgartirildi");
};
