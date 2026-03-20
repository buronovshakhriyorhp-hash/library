import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/error.middleware";

export const getNewsList = async (page: number, limit: number) => {
  const [news, total] = await Promise.all([
    prisma.news.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.news.count({ where: { status: "PUBLISHED" } }),
  ]);
  return { news, total, page, limit };
};

export const getNewsBySlug = async (slug: string) => {
  const news = await prisma.news.findFirst({
    where: {
      OR: [{ slug }, ...(isNaN(Number(slug)) ? [] : [{ id: Number(slug) }])],
      status: "PUBLISHED",
    },
  });
  if (!news) throw new AppError("Yangilik topilmadi", 404);
  await prisma.news.update({ where: { id: news.id }, data: { viewCount: { increment: 1 } } });
  return news;
};

export const createNews = async (data: any) => {
  return await prisma.news.create({ data });
};

export const updateNews = async (id: number, data: any) => {
  return await prisma.news.update({ where: { id }, data });
};

export const deleteNews = async (id: number) => {
  await prisma.news.delete({ where: { id } });
};
