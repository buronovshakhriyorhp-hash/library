import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import { newsData } from "@/data/news";
import type { NewsItem } from "@/types";

const AdminNewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>(newsData);

  const handleDelete = (id: number) => {
    if (confirm("Yangilikni o'chirishni tasdiqlaysizmi?")) {
      setNews((prev) => prev.filter((n) => n.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-bold text-foreground">Yangiliklar</span>
        </div>
        <button type="button"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          Yangilik qo'shish
        </button>
      </header>
      <div className="p-6">
        <div className="space-y-3">
          {news.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">{item.date}</p>
                <p className="font-semibold text-foreground line-clamp-1">{item.title}</p>
                {item.body && <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.body}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminNewsPage;
