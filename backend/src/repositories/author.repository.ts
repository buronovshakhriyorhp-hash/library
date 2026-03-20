import { prisma } from "../lib/prisma";

export class AuthorRepository {
  static async findAll() {
    return prisma.author.findMany({
      orderBy: { nameUz: "asc" },
      include: {
        _count: {
          select: { books: true },
        },
      },
    });
  }

  static async findById(id: number) {
    return prisma.author.findUnique({
      where: { id },
      include: {
        books: {
          select: { id: true, titleUz: true, slug: true, image: true, price: true, discount: true },
        },
      },
    });
  }

  static async create(data: any) {
    return prisma.author.create({ data });
  }

  static async update(id: number, data: any) {
    return prisma.author.update({
      where: { id },
      data,
    });
  }

  static async delete(id: number) {
    return prisma.author.delete({
      where: { id },
    });
  }
}
