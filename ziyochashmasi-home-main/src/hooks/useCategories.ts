import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/categories.service";

// ===================== QUERY KEY =====================
export const CATEGORY_KEYS = {
  all: ["categories"] as const,
};

// ===================== useCategories =====================
/**
 * Barcha kategoriyalarni API dan oladi.
 * CatalogPage, Sidebar va Header uchun ishlatiladi.
 */
export const useCategories = () => {
  return useQuery({
    queryKey: CATEGORY_KEYS.all,
    queryFn: fetchCategories,
    staleTime: 30 * 60 * 1000, // 30 daqiqa — kategoriyalar kamdan-kam o'zgaradi
    select: (data) =>
      data.map((cat) => ({
        id: cat.id,
        slug: cat.slug,
        nameUz: cat.nameUz,
        nameRu: cat.nameRu,
        nameEn: cat.nameEn,
        icon: cat.icon,
        count: cat._count?.books ?? 0,
        // i18n uchun moslashtirilgan key
        key: `cat.${cat.slug.replace(/-/g, "_")}`,
      })),
  });
};
