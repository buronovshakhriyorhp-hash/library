import bcrypt from "bcryptjs";
import { AuthRepository } from "../repositories/auth.repository";
import { generateTokenPair, verifyRefreshToken } from "../lib/jwt";
import { AppError } from "../middleware/error.middleware";

export const registerUser = async (data: any) => {
  const { name, email, password, phone } = data;

  const existing = await AuthRepository.findUserByEmail(email);
  if (existing) throw new AppError("Bu email band", 409);

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await AuthRepository.createUser({ name, email, passwordHash, phone });

  const tokens = generateTokenPair({ userId: user.id, email: user.email, role: user.role });
  await AuthRepository.updateUserRefreshToken(user.id, tokens.refreshToken);

  return { user, tokens };
};

export const loginUser = async (data: any) => {
  const { email, password } = data;

  const user = await AuthRepository.findUserByEmail(email);
  if (!user || !user.isActive) throw new AppError("Email yoki parol noto'g'ri", 401);

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new AppError("Email yoki parol noto'g'ri", 401);

  const tokens = generateTokenPair({ userId: user.id, email: user.email, role: user.role });
  await AuthRepository.updateUserRefreshToken(user.id, tokens.refreshToken);

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone },
    tokens,
  };
};

const GRACE_PERIOD_MS = 30 * 1000;
const gracePeriodCache = new Map<string, { tokens: any; expiresAt: number }>();

export const refreshUserToken = async (refreshToken: string) => {
  if (!refreshToken) throw new AppError("Refresh token topilmadi", 400);

  // Grace Period tekshiruvi: Agar aynan shu lizing toki oxirgi 30 soniyada so'ralgan bo'lsa, xuddi shu tokenni qaytaradi
  const cached = gracePeriodCache.get(refreshToken);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.tokens;
  }

  const payload = verifyRefreshToken(refreshToken);
  const user = await AuthRepository.findUserById(payload.userId);

  if (!user || user.refreshToken !== refreshToken) {
    throw new AppError("Token yaroqsiz yohud eskirgan", 401);
  }

  const tokens = generateTokenPair({ userId: user.id, email: user.email, role: user.role });
  await AuthRepository.updateUserRefreshToken(user.id, tokens.refreshToken);

  gracePeriodCache.set(refreshToken, {
    tokens,
    expiresAt: Date.now() + GRACE_PERIOD_MS,
  });

  // Hotirani tozalash (Memory leak oldini olish)
  for (const [key, value] of gracePeriodCache.entries()) {
    if (Date.now() > value.expiresAt) gracePeriodCache.delete(key);
  }

  return tokens;
};

export const logoutUser = async (userId: number) => {
  await AuthRepository.updateUserRefreshToken(userId, null);
};

export const getMe = async (userId: number) => {
  const user = await AuthRepository.getUserProfile(userId);
  if (!user) throw new AppError("Foydalanuvchi topilmadi", 404);
  return user;
};
