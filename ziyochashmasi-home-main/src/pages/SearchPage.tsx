import { useSearchParams, Link } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { useBooks } from "@/hooks/useBooks";
import { Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const navigate = useNavigate();
  const [input, setInput] = useState(query);

  const { data, isLoading, isError } = useBooks({ search: query, limit: 24 });
  const results = data?.books || [];
  const total = data?.pagination.total || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) navigate(`/search?q=${encodeURIComponent(input.trim())}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-6">
        <h1 className="font-display text-2xl font-bold text-foreground mb-4 text-left">Qidiruv</h1>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Kitob yoki muallif nomini kiriting..."
            className="flex-1 px-4 py-2.5 border border-border rounded-xl bg-background text-foreground outline-none focus:border-primary transition-colors"
          />
          <button type="submit" className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity">
            <Search className="w-4 h-4" />
          </button>
        </form>

        {query && !isLoading && !isError && (
          <p className="text-sm text-muted-foreground mb-4 text-left">
            "<span className="text-foreground font-semibold">{query}</span>" bo'yicha{" "}
            <span className="font-bold text-foreground">{total} ta</span> natija topildi
          </p>
        )}

        {isLoading && (
          <div className="py-20 text-center text-muted-foreground flex flex-col items-center gap-3">
             <Loader2 className="w-8 h-8 animate-spin text-primary" />
             <p>Izlanmoqda...</p>
          </div>
        )}

        {isError && (
           <div className="py-20 text-center text-muted-foreground">
             <p>Qidiruv davomida xatolik yuz berdi. Qayta urinib ko'ring.</p>
           </div>
        )}

        {!isLoading && !isError && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
        
        {!isLoading && !isError && results.length === 0 && query && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground mb-3">Hech narsa topilmadi</p>
            <Link to="/catalog" className="text-primary hover:underline text-sm">
              Barcha kitoblarni ko'rish →
            </Link>
          </div>
        )}

        {!isLoading && !isError && results.length === 0 && !query && (
          <div className="py-16 text-center text-muted-foreground">
            Qidiruv so'zini kiriting
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
