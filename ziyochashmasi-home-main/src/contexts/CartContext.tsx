import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { CartItem, Book } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (bookId: number) => boolean;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
  };

  const addToCart = useCallback(
    (book: Book, quantity: number = 1) => {
      setItems((prev) => {
        const existing = prev.find((item) => item.book.id === book.id);
        let newItems: CartItem[];
        if (existing) {
          newItems = prev.map((item) =>
            item.book.id === book.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [...prev, { book, quantity }];
        }
        localStorage.setItem("cart", JSON.stringify(newItems));
        return newItems;
      });
      toast({
        title: "Savatchaga qo'shildi",
        description: book.title,
      });
    },
    [toast]
  );

  const removeFromCart = useCallback((bookId: number) => {
    setItems((prev) => {
      const newItems = prev.filter((item) => item.book.id !== bookId);
      localStorage.setItem("cart", JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((bookId: number, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => {
      const newItems = prev.map((item) =>
        item.book.id === bookId ? { ...item, quantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    saveCart([]);
  }, []);

  const isInCart = useCallback(
    (bookId: number) => items.some((item) => item.book.id === bookId),
    [items]
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
