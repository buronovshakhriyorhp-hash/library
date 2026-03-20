import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { booksData } from "@/data/books";
import { getAuthorById } from "@/data/authors";
import { useLanguage } from "@/contexts/LanguageContext";

const AuthorPage = () => {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLanguage();
  const author = getAuthorById(Number(id));
  const books = booksData.filter((b) => b.authorId === Number(id));

  if (!author) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground mb-4">Muallif topilmadi</p>
          <Link to="/catalog" className="text-primary hover:underline">Katalogga qaytish</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const name = lang === "ru" ? author.nameRu || author.name : author.name;
  const bio = lang === "ru" ? author.bioRu || author.bio : author.bio;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">Bosh sahifa</Link>
          <span>/</span>
          <span className="text-foreground">{name}</span>
        </div>

        {/* Author header */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 flex gap-6 items-start">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-3xl font-bold text-primary">
            {name.charAt(0)}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-1">{name}</h1>
            {bio && <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">{bio}</p>}
            <p className="text-sm text-muted-foreground mt-2">{books.length} ta asar</p>
          </div>
        </div>

        {/* Author books */}
        <h2 className="font-bold text-xl text-foreground mb-4">Asarlari</h2>
        {books.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Hozircha asarlar mavjud emas</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AuthorPage;
