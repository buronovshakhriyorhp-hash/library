import { Link } from "react-router-dom";
import BookCard from "@/components/BookCard";
import { booksData } from "@/data/books";
import { useLanguage } from "@/contexts/LanguageContext";

const authorBooks = booksData.slice(0, 6);

const AuthorSection = () => {
  const { t } = useLanguage();

  return (
    <section id="mualliflar" className="py-8">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-foreground">
            {t("section.authorBooks")}
          </h2>
          <Link to="/author/2" className="text-sm font-semibold text-primary hover:underline">
            {t("section.viewAll")}
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {authorBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AuthorSection;
