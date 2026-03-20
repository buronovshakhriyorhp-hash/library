import { Link } from "react-router-dom";
import BookCard from "@/components/BookCard";
import { useBooks } from "@/hooks/useBooks";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, AlertCircle } from "lucide-react";

const BooksGrid = () => {
  const { t } = useLanguage();
  const { data, isLoading, isError } = useBooks({ limit: 12, page: 1 });

  return (
    <section id="kitoblar" className="py-8">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-foreground">
            {t("section.available")}
          </h2>
          <Link
            to="/catalog"
            className="text-sm font-semibold text-primary hover:underline"
          >
            {t("section.viewAll")}
          </Link>
        </div>

        {/* Loading holati */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-xl bg-secondary/50 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Xato holati */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <AlertCircle className="w-10 h-10 text-destructive" />
            <p className="text-muted-foreground text-sm">
              Ma'lumot yuklanmadi. Backend server ishlab turganini tekshiring.
            </p>
            <Link to="/catalog" className="text-sm text-primary hover:underline">
              Qayta urinish →
            </Link>
          </div>
        )}

        {/* Muvaffaqiyatli holat */}
        {!isLoading && !isError && data && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data.books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}

        {/* Bo'sh holat */}
        {!isLoading && !isError && data?.books.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            <p>Hozircha kitoblar yo'q</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BooksGrid;
