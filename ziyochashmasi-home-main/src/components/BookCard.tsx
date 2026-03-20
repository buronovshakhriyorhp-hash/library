import { Star, ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import type { Book } from "@/types";
import { formatPrice } from "@/data/books";

interface BookCardProps {
  book: Book;
  compact?: boolean;
}

const BookCard = ({ book, compact = false }: BookCardProps) => {
  const { t } = useLanguage();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book);
  };

  return (
    <Link
      to={`/book/${book.id}`}
      className="bg-card border border-border rounded-lg overflow-hidden group hover:shadow-lg transition-all duration-300 hover:border-primary/30 flex flex-col"
    >
      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden bg-secondary relative">
        <img
          src={book.image}
          alt={book.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {book.discount && (
          <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded">
            -{book.discount}%
          </span>
        )}
        {!book.inStock && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <span className="text-xs font-bold text-muted-foreground bg-background/80 px-2 py-1 rounded">
              Sotuvda yo'q
            </span>
          </div>
        )}
        {/* Quick wishlist */}
        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          aria-label="Sevimlilarga qo'shish"
          className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors text-muted-foreground hover:text-destructive shadow-sm"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <h4 className="font-bold text-sm text-foreground truncate">{book.title}</h4>
        {!compact && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{book.author}</p>
        )}
        {/* Stars */}
        <div className="flex items-center gap-0.5 mt-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const filled = i < Math.floor(book.rating);
            const half = !filled && i < book.rating;
            return (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  filled
                    ? "fill-star text-star"
                    : half
                    ? "fill-star/50 text-star"
                    : "text-muted-foreground"
                }`}
              />
            );
          })}
          <span className="text-xs text-muted-foreground ml-1">
            ({book.reviews} {t("book.reviews")})
          </span>
        </div>
        {/* Price */}
        <div className="mt-1.5 flex flex-col justify-end min-h-[40px]">
          {book.discount > 0 ? (
            <>
              <span className="text-xs text-muted-foreground line-through font-medium">
                {formatPrice(book.price)}
              </span>
              <span className="font-bold text-primary text-[15px] leading-tight flex items-center">
                {formatPrice(Math.floor(book.price * (100 - book.discount) / 100))}
              </span>
            </>
          ) : (
            <span className="font-bold text-foreground text-[15px] leading-tight mt-auto">
              {formatPrice(book.price)}
            </span>
          )}
        </div>
        {/* Add to cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!book.inStock}
          className="mt-2 w-full py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {t("book.quickBuy")}
        </button>
      </div>
    </Link>
  );
};

export default BookCard;
