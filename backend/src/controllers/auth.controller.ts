import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { sendSuccess } from "../middleware/error.middleware";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

export const register = async (req: Request, res: Response) => {
  const { user, tokens } = await authService.registerUser(req.body);

  res.cookie("refreshToken", tokens.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.cookie("accessToken", tokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });

  sendSuccess(res, { user }, "Ro'yxatdan o'tildi", 201);
};

export const login = async (req: Request, res: Response) => {
  const { user, tokens } = await authService.loginUser(req.body);

  res.cookie("refreshToken", tokens.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.cookie("accessToken", tokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });

  sendSuccess(res, { user }, "Muvaffaqiyatli kirdingiz");
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  
  const tokens = await authService.refreshUserToken(refreshToken);

  res.cookie("refreshToken", tokens.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.cookie("accessToken", tokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });

  sendSuccess(res, null, "Token yangilandi");
};

export const logout = async (req: Request, res: Response) => {
  if (req.user) {
    await authService.logoutUser(req.user.userId);
  }
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  sendSuccess(res, null, "Chiqildi");
};

export const getMe = async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!.userId);
  sendSuccess(res, user);
};
