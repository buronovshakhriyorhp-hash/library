import { AuthorRepository } from "../repositories/author.repository";
import { AppError } from "../middleware/error.middleware";

export const getAllAuthors = async () => {
  return await AuthorRepository.findAll();
};

export const getAuthorById = async (id: number) => {
  const author = await AuthorRepository.findById(id);
  if (!author) throw new AppError("Muallif topilmadi", 404);
  return author;
};

export const createAuthor = async (data: any) => {
  return await AuthorRepository.create(data);
};

export const updateAuthor = async (id: number, data: any) => {
  const author = await AuthorRepository.findById(id);
  if (!author) throw new AppError("Muallif topilmadi", 404);
  return await AuthorRepository.update(id, data);
};

export const deleteAuthor = async (id: number) => {
  const author = await AuthorRepository.findById(id);
  if (!author) throw new AppError("Muallif topilmadi", 404);
  return await AuthorRepository.delete(id);
};
