import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { newsData } from "@/data/news";

const NewsSection = () => {
  const { lang, t } = useLanguage();
  const displayNews = newsData.slice(0, 4);

  return (
    <section id="yangiliklar" className="py-8">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-foreground">
            {t("section.news")}
          </h2>
          <Link to="/news" className="text-sm font-semibold text-primary hover:underline">
            {t("section.newsLink")}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayNews.map((item) => {
            const title =
              lang === "ru" ? item.titleRu || item.title
              : lang === "en" ? item.titleEn || item.title
              : item.title;
            return (
              <Link
                key={item.id}
                to={`/news/${item.id}`}
                className="group bg-card border border-border rounded-lg p-5 hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                  <Calendar className="w-3 h-3" />
                  {item.date}
                </div>
                <h4 className="font-bold text-sm text-foreground mt-2 group-hover:text-primary transition-colors line-clamp-2">
                  {title}
                </h4>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
