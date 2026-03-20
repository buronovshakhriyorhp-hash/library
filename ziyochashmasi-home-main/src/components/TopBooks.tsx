import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import BookCard from "@/components/BookCard";
import { useBooks } from "@/hooks/useBooks";
import { useLanguage } from "@/contexts/LanguageContext";

const TopBooks = () => {
  const { t } = useLanguage();
  const { data, isLoading } = useBooks({ sort: "featured", limit: 6, page: 1 });
  const [page, setPage] = useState(0);
  const perPage = 3;

  const topBooks = data?.books ?? [];
  const pages = Math.ceil(topBooks.length / perPage);
  const visible = topBooks.slice(page * perPage, (page + 1) * perPage);

  return (
    <section className="py-8 bg-secondary/50">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-foreground">
            {t("section.topBooks")}
          </h2>
          <Link to="/catalog?sort=rating" className="text-sm font-semibold text-primary hover:underline">
            {t("section.viewAll")}
          </Link>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-xl bg-secondary animate-pulse" />
            ))}
          </div>
        )}

        {/* Books carousel */}
        {!isLoading && topBooks.length > 0 && (
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {visible.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  aria-label="Oldingi sahifa"
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center disabled:opacity-30 text-foreground hover:bg-secondary transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: pages }).map((_, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setPage(i)}
                    aria-label={`${i + 1}-sahifa`}
                    className={`w-8 h-8 rounded-full text-sm font-bold transition-colors ${
                      i === page
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-foreground hover:bg-secondary"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
                  disabled={page === pages - 1}
                  aria-label="Keyingi sahifa"
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center disabled:opacity-30 text-foreground hover:bg-secondary transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default TopBooks;
