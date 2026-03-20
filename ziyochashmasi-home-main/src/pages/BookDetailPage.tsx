import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Star, BookOpen, Users, Plus, Minus, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBook, useBooks } from "@/hooks/useBooks";

export const formatPrice = (price: number): string =>
  price.toLocaleString("uz-UZ") + " UZS";

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>(); // backend qabul qiladi slug yoki id
  const { addToCart } = useCart();
  const { lang } = useLanguage();
  const [quantity, setQuantity] = useState(1);

  // Bitta kitobni ID yoki slug orqali olish
  const { data: book, isLoading, isError } = useBook(id);

  // O'xshash kitoblar (bitta kategoriya, hozirgi kitobdan tashqari)
  const { data: relatedData } = useBooks({ category: book?.categorySlug, limit: 7 });
  const relatedBooks = relatedData?.books.filter((b) => b.id !== book?.id).slice(0, 6) ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Biroz kuting...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground text-lg mb-4">Kitob topilmadi yoki xatolik yuz berdi</p>
          <Link to="/catalog" className="text-primary hover:underline">
            Katalogga qaytish →
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const title =
    lang === "ru" ? book.titleRu || book.title
    : lang === "en" ? book.titleEn || book.title
    : book.title;

  const description =
    lang === "ru" ? book.descriptionRu || book.description
    : lang === "en" ? book.descriptionEn || book.description
    : book.description;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Bosh sahifa</Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-primary transition-colors">Katalog</Link>
          <span>/</span>
          <span className="text-foreground">{title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Book image */}
          <div className="lg:col-span-1">
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-secondary shadow-lg max-w-sm mx-auto md:mx-0">
              <img
                src={book.image}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Book info */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <div>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                {book.category}
              </span>
              <h1 className="font-display text-3xl font-bold text-foreground mt-2">
                {title}
              </h1>
              <p className="text-muted-foreground mt-1">{book.author}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(book.rating)
                        ? "fill-star text-star"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {book.rating.toFixed(1)} ({book.reviews} sharh)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(book.price)}
              </span>
              {book.discount && book.discount > 0 && (
                <span className="text-sm line-through text-muted-foreground">
                  {formatPrice(Math.round(book.price / (1 - book.discount / 100)))}
                </span>
              )}
            </div>

            {/* Stock status */}
            <div className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
              book.inStock ? "text-green-600" : "text-destructive"
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                book.inStock ? "bg-green-500" : "bg-destructive"
              }`} />
              {book.inStock ? "Sotuvda mavjud" : "Sotuvda yo'q"}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg overflow-hidden bg-background h-12">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || !book.inStock}
                    className="w-12 h-full flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4 text-foreground" />
                  </button>
                  <span className="w-12 text-center font-bold text-foreground">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!book.inStock || quantity >= book.stockCount}
                    className="w-12 h-full flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4 text-foreground" />
                  </button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Mavjud: <span className="font-bold text-foreground">{book.stockCount || 0} ta</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => addToCart(book, quantity)}
                  disabled={!book.inStock}
                  className="flex-1 min-w-[200px] flex justify-center items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Savatchaga qo'shish
                </button>
                <Link
                  to="/cart"
                  className="flex-1 min-w-[200px] flex justify-center items-center gap-2 px-6 py-3.5 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary/5 transition-colors text-center"
                  onClick={() => addToCart(book, quantity)}
                >
                  Bir zumda sotib olish
                </Link>
              </div>
            </div>

            {/* Details */}
            {(book.pages || book.year || book.isbn || book.publisher) && (
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border mt-4">
                {book.pages && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    <span>{book.pages} sahifa</span>
                  </div>
                )}
                {book.year && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Yil: </span>
                    {book.year}
                  </div>
                )}
                {book.publisher && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Nashriyot: </span>
                    {book.publisher}
                  </div>
                )}
                {book.isbn && (
                  <div className="text-sm text-muted-foreground col-span-2">
                    <span className="font-semibold text-foreground">ISBN: </span>
                    {book.isbn}
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            {description && (
              <div className="pt-4 border-t border-border mt-4 text-left">
                <h3 className="font-bold text-foreground mb-2">Kitob haqida</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {description}
                </p>
              </div>
            )}

            {/* Author Action */}
            {book.authorId && (
              <div className="pt-4 border-t border-border mt-4 text-left">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Muallif kitoblari
                </h3>
                <Link
                  to={`/catalog?authorId=${book.authorId}`}
                  className="text-sm text-primary hover:underline mt-1 inline-block"
                >
                  Barcha kitoblarini ko'rish →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-12 bg-card border border-border rounded-xl p-6 text-left">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary" /> 
              Mijozlar sharhlari
            </h2>
            <button className="px-4 py-2 border border-primary text-primary font-bold bg-transparent rounded-lg hover:bg-primary/5 transition-colors">
              Sharh yozish
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
            <div className="flex flex-col items-center justify-center p-6 bg-secondary/50 rounded-xl">
              <span className="text-5xl font-bold text-foreground">{book.rating.toFixed(1)}</span>
              <div className="flex items-center gap-0.5 mt-2 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(book.rating)
                        ? "fill-star text-star"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">Umumiy reyting dizayni asosida</span>
            </div>
            
            <div className="space-y-4">
              {/* Fake reviews placeholder to match UX needs */}
              <p className="text-muted-foreground italic text-center py-6 border border-dashed border-border rounded-lg">
                Hozircha sharhlar yo'q. Birinchi bo'lib sharh qoldiring!
              </p>
            </div>
          </div>
        </div>

        {/* Related books */}
        {relatedBooks.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              O'xshash kitoblar
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedBooks.map((b) => (
                <BookCard key={b.id} book={b} compact />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BookDetailPage;
