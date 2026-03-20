import api from "@/lib/api";
import type { LoginCredentials, RegisterData, User } from "@/types";
import { isAxiosError } from "axios";

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

const handleAuthError = (error: unknown): never => {
  if (isAxiosError(error) && error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw error;
};

export const authService = {
  login: async (credentials: LoginCredentials) => {
    try {
      const res = await api.post<AuthResponse>("/auth/login", credentials);
      return res.data;
    } catch (e) {
      handleAuthError(e);
    }
  },

  register: async (data: RegisterData) => {
    try {
      const res = await api.post<AuthResponse>("/auth/register", data);
      return res.data;
    } catch (e) {
      handleAuthError(e);
    }
  },

  logout: async () => {
    try {
      const res = await api.post<{ success: boolean; message: string }>("/auth/logout");
      return res.data;
    } catch (e) {
      handleAuthError(e);
    }
  },

  getMe: async () => {
    const res = await api.get<{ success: boolean; data: User }>("/auth/me");
    return res.data;
  },

  refresh: async () => {
    const res = await api.post<{ success: boolean; message: string }>("/auth/refresh");
    return res.data;
  }
};
