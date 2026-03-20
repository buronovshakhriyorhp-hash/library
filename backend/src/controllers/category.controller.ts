import { Request, Response } from "express";
import * as categoryService from "../services/category.service";
import { sendSuccess } from "../middleware/error.middleware";

export const getAllCategories = async (_req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  sendSuccess(res, categories);
};

export const getCategoryBySlug = async (req: Request, res: Response) => {
  const category = await categoryService.getCategoryBySlug(req.params.slug);
  if (!category) {
    res.status(404).json({ success: false, message: "Topilmadi" });
    return;
  }
  sendSuccess(res, category);
};
