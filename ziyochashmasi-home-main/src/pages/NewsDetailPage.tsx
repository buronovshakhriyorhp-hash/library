import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getNewsById } from "@/data/news";
import { useLanguage } from "@/contexts/LanguageContext";

const NewsDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLanguage();
  const news = getNewsById(Number(id));

  if (!news) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground mb-4">Yangilik topilmadi</p>
          <Link to="/news" className="text-primary hover:underline">Yangiliklarga qaytish</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const title = lang === "ru" ? news.titleRu || news.title : lang === "en" ? news.titleEn || news.title : news.title;
  const body = lang === "ru" ? news.bodyRu || news.body : lang === "en" ? news.bodyEn || news.body : news.body;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-6 max-w-2xl">
        <Link to="/news" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Yangiliklarga qaytish
        </Link>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          <Calendar className="w-3.5 h-3.5" />
          {news.date}
        </div>

        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 leading-snug">
          {title}
        </h1>

        {body && (
          <div className="prose prose-sm text-muted-foreground leading-relaxed max-w-none">
            {body.split("\n").map((paragraph, i) => (
              <p key={i} className="mb-4">{paragraph}</p>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default NewsDetailPage;
