import api from "@/lib/api";
import type { ApiCategory } from "./books.service";

export interface CategoriesResponse {
  success: boolean;
  data: ApiCategory[];
}

/**
 * GET /api/categories — Barcha kategoriyalar
 */
export const fetchCategories = async (): Promise<ApiCategory[]> => {
  const res = await api.get<CategoriesResponse>("/categories");
  return res.data.data;
};
