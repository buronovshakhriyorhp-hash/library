import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { newsData } from "@/data/news";
import { useLanguage } from "@/contexts/LanguageContext";

const NewsListPage = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-6">
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">
          {t("section.news")}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {newsData.map((item) => {
            const title =
              lang === "ru" ? item.titleRu || item.title
              : lang === "en" ? item.titleEn || item.title
              : item.title;
            const body =
              lang === "ru" ? item.bodyRu || item.body
              : lang === "en" ? item.bodyEn || item.body
              : item.body;
            return (
              <Link
                key={item.id}
                to={`/news/${item.id}`}
                className="group bg-card border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.date}
                </div>
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  {title}
                </h3>
                {body && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{body}</p>
                )}
                <span className="text-xs text-primary font-semibold mt-3 inline-block">
                  Batafsil o'qish →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewsListPage;
