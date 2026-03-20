import { prisma } from "../lib/prisma";

export const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { books: true } } },
  });
};

export const getCategoryBySlug = async (slug: string) => {
  return await prisma.category.findUnique({
    where: { slug },
    include: {
      books: {
        where: { isActive: true },
        take: 20,
        include: { author: { select: { nameUz: true, nameRu: true } } },
      },
    },
  });
};
