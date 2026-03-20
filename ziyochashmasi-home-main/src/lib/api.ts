import axios from "axios";

// Backend API URL — .env.local faylidagi VITE_API_URL dan olinadi
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// ================================================================
// Markazlashgan Axios instance
// ================================================================
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===================== REQUEST INTERCEPTOR =====================
// Har bir so'rovga JWT token qo'shadi (agar mavjud bo'lsa)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ===================== RESPONSE INTERCEPTOR =====================
// 401 (Unauthorized) xatosida localStorage tozalanadi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("auth_user");
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/admin/login"
      ) {
        window.location.href = "/login";
      }
    }
    // 403 Forbidden interceptor for spoofed Admin access
    if (error.response?.status === 403 && window.location.pathname.startsWith("/admin")) {
      window.location.href = "/";
    }
    // Backend xato xabari bo'lsa uni ko'rsatish uchun forward qiladi
    return Promise.reject(error);
  }
);

export default api;


