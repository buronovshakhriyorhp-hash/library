import { useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Phone,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage, Lang } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useClickOutside } from "@/hooks/useClickOutside";

const langLabels: Record<Lang, string> = { uz: "UZ", ru: "RU", en: "EN" };
const langFlags: Record<Lang, string> = { uz: "🇺🇿", ru: "🇷🇺", en: "🇬🇧" };

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const langRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  useClickOutside(langRef, useCallback(() => setLangOpen(false), []));

  const navLinks = [
    { label: t("nav.books"), href: "/catalog" },
    { label: t("nav.collections"), href: "/catalog?sort=featured" },
    { label: t("nav.authors"), href: "/catalog" },
    { label: t("nav.discounts"), href: "/catalog?discount=true" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      {/* Top bar */}
      <div className="bg-topbar border-b border-border">
        <div className="container flex items-center justify-between py-2 text-sm text-muted-foreground">
          <span className="font-semibold">{t("topbar.slogan")}</span>
          <div className="hidden md:flex items-center gap-4">
            {/* Language switcher */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                aria-expanded={langOpen}
                aria-label="Tilni tanlang"
                className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-secondary transition-colors"
              >
                <span>{langFlags[lang]}</span>
                <span className="font-bold">{langLabels[lang]}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-1 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[100px] z-50">
                  {(["uz", "ru", "en"] as Lang[]).map((l) => (
                    <button
                      type="button"
                      key={l}
                      onClick={() => {
                        setLang(l);
                        setLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors ${
                        l === lang ? "text-primary font-bold" : "text-foreground"
                      }`}
                    >
                      <span>{langFlags[l]}</span>
                      <span>{langLabels[l]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark/Light toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "light" ? "Qorong'i rejim" : "Yorug' rejim"}
              className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-secondary transition-colors"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>

            <a
              href="tel:+998931358100"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              +998 93 135 81 00
            </a>
            <a
              href="https://t.me/Ziyo_kutibxonasi"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              ✈️ Telegram
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container flex items-center justify-between py-3 gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src={logo}
            alt="Ziyo Chashmasi"
            className="h-10 w-10 object-contain"
          />
          <span className="font-display font-bold text-lg text-foreground hidden sm:block">
            Ziyo Chashmasi
          </span>
        </Link>

        {/* Desktop Search & Catalog */}
        <div className="flex-1 max-w-[800px] hidden lg:flex items-center gap-4">
          <button className="flex items-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors shrink-0">
            <Menu className="w-5 h-5" />
            <span>Katalog</span>
          </button>
          
          <form
            onSubmit={handleSearch}
            className="flex-1 flex items-center border-2 border-primary rounded-lg overflow-hidden bg-background h-[44px]"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Qidiruv: kitoblar, mualliflar, nashriyotlar..."
              className="flex-1 px-4 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground h-full"
            />
            <button
              type="submit"
              aria-label="Qidirish"
              className="px-6 h-full bg-primary text-primary-foreground flex flex-col justify-center items-center hover:bg-primary/90 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>

        <div className="flex items-center gap-6">
          {/* Favorites */}
          <Link
            to="/favorites"
            className="hidden sm:flex flex-col items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <Heart className="w-6 h-6" />
            <span>Sevimlilar</span>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="hidden sm:flex flex-col items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors relative"
            aria-label={`Savatcha - ${totalItems} ta mahsulot`}
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </div>
            <span>{t("action.cart")}</span>
          </Link>

          {/* Profile / Auth */}
          {user ? (
            <div className="flex flex-col items-center gap-1 text-xs font-semibold text-muted-foreground relative group cursor-pointer">
              <Link to="/profile" className="flex flex-col items-center hover:text-primary transition-colors">
                <User className="w-6 h-6" />
                <span className="max-w-[70px] truncate">{user.name}</span>
              </Link>
              <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg py-2 min-w-[150px] opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-secondary transition-colors">Mening profilim</Link>
                <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-secondary transition-colors">Buyurtmalarim</Link>
                <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-secondary transition-colors flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Chiqish
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex flex-col items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              <User className="w-6 h-6" />
              <span>Kirish</span>
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="lg:hidden text-foreground"
            aria-label={mobileOpen ? "Menyuni yopish" : "Menyuni ochish"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-in">
          <div className="container py-4 space-y-3">
            {/* Mobile Search */}
            <form
              onSubmit={handleSearch}
              className="flex items-center border border-border rounded-lg overflow-hidden md:hidden"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search.placeholder")}
                className="flex-1 px-4 py-2 text-sm bg-transparent outline-none"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-primary text-primary-foreground"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {navLinks.map((link) => (
              <Link
                key={link.href + link.label}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              {t("action.cart")}
              {totalItems > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile language & theme */}
            <div className="flex items-center gap-3 pt-2 border-t border-border">
              {(["uz", "ru", "en"] as Lang[]).map((l) => (
                <button
                  type="button"
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${
                    l === lang
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {langFlags[l]} {langLabels[l]}
                </button>
              ))}
              <button
                type="button"
                onClick={toggleTheme}
                className="ml-auto p-2 rounded-md bg-secondary text-foreground"
              >
                {theme === "light" ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="flex flex-col gap-1 text-sm text-muted-foreground pt-2 border-t border-border">
              <a
                href="tel:+998931358100"
                className="flex items-center gap-2 hover:text-primary"
              >
                <Phone className="w-3.5 h-3.5" /> +998 93 135 81 00
              </a>
              <a
                href="tel:+998952227002"
                className="flex items-center gap-2 hover:text-primary"
              >
                <Phone className="w-3.5 h-3.5" /> +998 95 222 70 02
              </a>
              <a
                href="https://t.me/Ziyo_kutibxonasi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary"
              >
                ✈️ Telegram
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
