import { Request, Response } from "express";
import * as bookService from "../services/book.service";
import { BooksQuerySchema } from "../lib/schemas";
import { sendSuccess } from "../middleware/error.middleware";

export const getBooks = async (req: Request, res: Response) => {
  const query = BooksQuerySchema.parse(req.query);
  const result = await bookService.getPaginatedBooks(query);
  sendSuccess(res, result.books, "OK", 200, result.meta);
};

export const getBookDetail = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const book = await bookService.getBookDetail(slug);
  sendSuccess(res, book);
};

export const createBook = async (req: Request, res: Response) => {
  const book = await bookService.createBook(req.body);
  sendSuccess(res, book, "Kitob qo'shildi", 201);
};

export const updateBook = async (req: Request, res: Response) => {
  const book = await bookService.updateBook(Number(req.params.id), req.body);
  sendSuccess(res, book);
};

export const deleteBook = async (req: Request, res: Response) => {
  await bookService.deleteBook(Number(req.params.id));
  sendSuccess(res, null, "Kitob o'chirildi");
};
