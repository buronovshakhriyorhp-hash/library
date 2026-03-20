import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { SlidersHorizontal, X, AlertCircle, Loader2 } from "lucide-react";
import { useBooks } from "@/hooks/useBooks";
import { useCategories } from "@/hooks/useCategories";

const PRICE_MAX = 100000;

const CatalogPage = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const selectedCategory = searchParams.get("category") || "";
  const sortBy = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page")) || 1;
  const perPage = 12;

  // Local state for price filter (optimistic UI)
  const [priceMax, setPriceMax] = useState(PRICE_MAX);
  const [showFilter, setShowFilter] = useState(false);

  // Data fetching
  const { data: categoriesData = [] } = useCategories();
  const {
    data: booksData,
    isLoading,
    isError,
  } = useBooks({
    category: selectedCategory,
    sort: sortBy as any,
    maxPrice: priceMax !== PRICE_MAX ? priceMax : undefined,
    page,
    limit: perPage,
  });

  const books = booksData?.books ?? [];
  const pagination = booksData?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  // Handlers
  const handleCategoryChange = (slug: string) => {
    setSearchParams((prev) => {
      if (slug) prev.set("category", slug);
      else prev.delete("category");
      prev.set("page", "1");
      return prev;
    });
  };

  const handleSortChange = (sort: string) => {
    setSearchParams((prev) => {
      if (sort) prev.set("sort", sort);
      else prev.delete("sort");
      prev.set("page", "1");
      return prev;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setSearchParams({});
    setPriceMax(PRICE_MAX);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Kitoblar katalogi
          </h1>
          <button
            type="button"
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-secondary transition-colors lg:hidden"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtr
          </button>
        </div>

        <div className="flex gap-6">
          {/* Filter Panel */}
          <aside
            className={`w-64 shrink-0 space-y-4 ${
              showFilter ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">Filtrlar</h3>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-primary hover:underline"
                >
                  Tozalash
                </button>
              </div>

              {/* Categories */}
              <div className="mb-4 text-left">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 text-left">
                  {t("cat.title")}
                </h4>
                <ul className="space-y-1">
                  <li>
                    <button
                      type="button"
                      onClick={() => handleCategoryChange("")}
                      className={`w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${
                        !selectedCategory
                          ? "bg-primary/10 text-primary font-semibold"
                          : "hover:bg-secondary"
                      }`}
                    >
                      Barchasi
                    </button>
                  </li>
                  {categoriesData.map((cat) => (
                    <li key={cat.id}>
                      <button
                        type="button"
                        onClick={() => handleCategoryChange(cat.slug)}
                        className={`w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${
                          selectedCategory === cat.slug
                            ? "bg-primary/10 text-primary font-semibold"
                            : "hover:bg-secondary"
                        }`}
                      >
                        {t(cat.key)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price range */}
              <div className="text-left">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 text-left">
                  Narx (UZS)
                </h4>
                <input
                  type="range"
                  min={10000}
                  max={PRICE_MAX}
                  step={5000}
                  value={priceMax}
                  onChange={(e) => handlePageChange(1) || setPriceMax(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>10,000</span>
                  <span className="font-bold text-foreground">
                    {priceMax.toLocaleString()} UZS
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Sort & count */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                {isLoading ? "Izlanmoqda..." : `${pagination?.total ?? 0} ta kitob topildi`}
              </span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background text-foreground outline-none"
              >
                <option value="">Saralash</option>
                <option value="price_asc">Narx: arzon →</option>
                <option value="price_desc">Narx: qimmat →</option>
                <option value="rating">Reyting bo'yicha</option>
                <option value="featured">Tanlangan</option>
              </select>
            </div>

            {/* ERROR */}
            {isError && (
              <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                <AlertCircle className="w-12 h-12 text-destructive mb-3" />
                <p>Ma'lumotlarni yuklashda xatolik yuz berdi.</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-3 text-sm text-primary hover:underline"
                >
                  Qayta urinish
                </button>
              </div>
            )}

            {/* LOADING */}
            {isLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-secondary animate-pulse rounded-xl" />
                ))}
              </div>
            )}

            {/* GRID */}
            {!isLoading && !isError && books.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}

            {/* EMPTY */}
            {!isLoading && !isError && books.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <X className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Siz qidirgan mezonlarga mos kitob topilmadi</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-3 text-sm text-primary hover:underline"
                >
                  Filtrlarni tozalash
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="px-3 py-1.5 rounded border border-border text-sm disabled:opacity-40 hover:bg-secondary transition-colors"
                >
                  ←
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-8 h-8 rounded text-sm font-bold transition-colors ${
                      i + 1 === page
                        ? "bg-primary text-primary-foreground"
                        : "border border-border hover:bg-secondary"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  className="px-3 py-1.5 rounded border border-border text-sm disabled:opacity-40 hover:bg-secondary transition-colors"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CatalogPage;
