import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export class AuthRepository {
  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  static async findUserById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  static async createUser(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
      select: { id: true, name: true, email: true, role: true, phone: true },
    });
  }

  static async updateUserRefreshToken(userId: number, refreshToken: string | null) {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  static async getUserProfile(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
    });
  }
}
