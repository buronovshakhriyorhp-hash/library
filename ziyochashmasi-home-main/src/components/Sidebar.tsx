import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { categories } from "@/data/categories";

const Sidebar = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <nav className="bg-card border border-border rounded-lg overflow-hidden">
        <h3 className="px-4 py-3 font-bold text-sm text-foreground bg-secondary border-b border-border">
          {t("cat.title")}
        </h3>
        <ul className="py-1">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                to={`/category/${cat.slug}`}
                className="block px-4 py-2.5 text-sm text-foreground hover:bg-sidebar-accent hover:text-primary transition-colors"
              >
                {t(cat.key)}
              </Link>
            </li>
          ))}
        </ul>
        <div className="border-t border-border px-4 py-3">
          <button
            type="button"
            onClick={() => navigate("/catalog")}
            className="w-full py-2 text-xs font-bold text-primary hover:underline text-left"
          >
            {t("section.viewAll")}
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
