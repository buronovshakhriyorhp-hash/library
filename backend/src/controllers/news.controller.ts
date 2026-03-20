import { Request, Response } from "express";
import * as newsService from "../services/news.service";
import { sendSuccess } from "../middleware/error.middleware";

export const getNewsList = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const result = await newsService.getNewsList(page, limit);
  sendSuccess(res, result.news, "OK", 200, { page: result.page, limit: result.limit, total: result.total });
};

export const getNewsBySlug = async (req: Request, res: Response) => {
  const news = await newsService.getNewsBySlug(req.params.slug);
  sendSuccess(res, news);
};

export const createNews = async (req: Request, res: Response) => {
  const news = await newsService.createNews(req.body);
  sendSuccess(res, news, "Yangilik qo'shildi", 201);
};

export const updateNews = async (req: Request, res: Response) => {
  const news = await newsService.updateNews(Number(req.params.id), req.body);
  sendSuccess(res, news);
};

export const deleteNews = async (req: Request, res: Response) => {
  await newsService.deleteNews(Number(req.params.id));
  sendSuccess(res, null, "O'chirildi");
};
