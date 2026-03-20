import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/books";

const CartPage = () => {
  const { items, totalPrice, totalItems, removeFromCart, updateQuantity, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 flex flex-col items-center text-center">
          <ShoppingBag className="w-20 h-20 text-muted-foreground mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Savatchangiz bo'sh
          </h2>
          <p className="text-muted-foreground mb-6">
            Kitoblar katalogidan o'zingiz yoqtirgan kitoblarni qo'shing
          </p>
          <Link
            to="/catalog"
            className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Katalogga o'tish
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Savatcha ({totalItems} kitob)
          </h1>
          <button
            type="button"
            onClick={clearCart}
            className="flex items-center gap-1.5 text-sm text-destructive hover:underline"
          >
            <Trash2 className="w-4 h-4" />
            Tozalash
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(({ book, quantity }) => (
              <div
                key={book.id}
                className="flex gap-4 bg-card border border-border rounded-xl p-4"
              >
                <Link to={`/book/${book.id}`} className="shrink-0">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-16 h-20 object-cover rounded-lg"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/book/${book.id}`}
                    className="font-bold text-foreground hover:text-primary transition-colors line-clamp-2"
                  >
                    {book.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                  <p className="font-bold text-primary mt-1">
                    {formatPrice(book.price)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {/* Quantity */}
                  <div className="flex items-center gap-2 border border-border rounded-lg overflow-hidden">
                    <button
                      type="button"
                      aria-label="Kamaytirish"
                      onClick={() => updateQuantity(book.id, quantity - 1)}
                      disabled={quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-40"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Ko'paytirish"
                      onClick={() => updateQuantity(book.id, quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {/* Subtotal */}
                  <span className="text-sm font-semibold text-foreground">
                    {formatPrice(book.price * quantity)}
                  </span>
                  {/* Remove */}
                  <button
                    type="button"
                    aria-label="O'chirish"
                    onClick={() => removeFromCart(book.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-5 sticky top-24 space-y-4">
              <h3 className="font-bold text-foreground text-lg">Buyurtma xulosasi</h3>
              <div className="space-y-2 text-sm">
                {items.map(({ book, quantity }) => (
                  <div key={book.id} className="flex justify-between text-muted-foreground">
                    <span className="truncate max-w-[60%]">{book.title}</span>
                    <span className="font-semibold text-foreground">
                      x{quantity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                <span>Jami:</span>
                <span className="text-primary">{formatPrice(totalPrice)}</span>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Yetkazib berish qiymati keyingi bosqichda aniqlanadi
              </div>
              <Link
                to="/checkout"
                className="block w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl text-center hover:opacity-90 transition-opacity"
              >
                Buyurtma berish →
              </Link>
              <Link
                to="/catalog"
                className="block w-full py-2 border border-border text-foreground font-semibold rounded-xl text-center hover:bg-secondary transition-colors text-sm"
              >
                ← Xaridni davom ettirish
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
