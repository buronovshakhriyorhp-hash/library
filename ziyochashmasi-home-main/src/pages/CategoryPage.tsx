import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBooks } from "@/hooks/useBooks";
import { useCategories } from "@/hooks/useCategories";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLanguage();

  const { data: categories = [] } = useCategories();
  const category = categories.find((c) => c.slug === slug);

  const { data: booksData, isLoading, isError } = useBooks({ category: slug, limit: 24 });
  const books = booksData?.books ?? [];

  if (categories.length > 0 && !category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground mb-4">Kategoriya topilmadi</p>
          <Link to="/catalog" className="text-primary hover:underline">Katalogga qaytish</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 text-left">
          <Link to="/" className="hover:text-primary">Bosh sahifa</Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-primary">Katalog</Link>
          <span>/</span>
          <span className="text-foreground">{category ? t(category.key) : slug}</span>
        </div>
        
        <h1 className="font-display text-2xl font-bold text-foreground mb-6 text-left">
          {category ? t(category.key) : <div className="h-8 w-48 bg-secondary animate-pulse rounded" />}
          {!isLoading && <span className="text-base text-muted-foreground font-normal ml-2">({booksData?.pagination.total ?? 0} ta kitob)</span>}
        </h1>

        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-xl bg-secondary animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <div className="py-16 text-center text-muted-foreground">
            Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.
          </div>
        )}

        {!isLoading && !isError && books.length > 0 && (
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
             {books.map((book) => (
               <BookCard key={book.id} book={book} />
             ))}
           </div>
        )}

        {!isLoading && !isError && books.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            <p>Bu kategoriyada hozircha kitoblar yo'q</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;
