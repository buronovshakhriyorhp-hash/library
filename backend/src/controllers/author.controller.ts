import { Request, Response } from "express";
import * as authorService from "../services/author.service";
import { sendSuccess } from "../middleware/error.middleware";

export const getAuthors = async (_req: Request, res: Response) => {
  const authors = await authorService.getAllAuthors();
  sendSuccess(res, authors);
};

export const getAuthorById = async (req: Request, res: Response) => {
  const author = await authorService.getAuthorById(Number(req.params.id));
  sendSuccess(res, author);
};

export const createAuthor = async (req: Request, res: Response) => {
  const author = await authorService.createAuthor(req.body);
  sendSuccess(res, author, "Muallif muvaffaqiyatli qo'shildi", 201);
};

export const updateAuthor = async (req: Request, res: Response) => {
  const author = await authorService.updateAuthor(Number(req.params.id), req.body);
  sendSuccess(res, author, "Muallif muvaffaqiyatli yangilandi");
};

export const deleteAuthor = async (req: Request, res: Response) => {
  await authorService.deleteAuthor(Number(req.params.id));
  sendSuccess(res, null, "Muallif muvaffaqiyatli o'chirildi");
};
