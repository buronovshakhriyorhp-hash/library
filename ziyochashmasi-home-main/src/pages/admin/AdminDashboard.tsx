import { Link, useNavigate } from "react-router-dom";
import { BookOpen, ShoppingBag, Users, Newspaper, LogOut, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { booksData } from "@/data/books";
import { newsData } from "@/data/news";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  const stats = [
    { label: "Kitoblar", value: booksData.length, icon: BookOpen, href: "/admin/books", color: "bg-blue-500" },
    { label: "Buyurtmalar", value: 12, icon: ShoppingBag, href: "/admin/orders", color: "bg-green-500" },
    { label: "Foydalanuvchilar", value: 48, icon: Users, href: "/admin/users", color: "bg-purple-500" },
    { label: "Yangiliklar", value: newsData.length, icon: Newspaper, href: "/admin/news", color: "bg-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Admin Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-primary" />
          <span className="font-bold text-foreground">Admin Panel</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:block">{user?.name}</span>
          <Link to="/" className="text-sm text-primary hover:underline">Saytga qaytish</Link>
          <button type="button" onClick={handleLogout} aria-label="Chiqish"
            className="text-muted-foreground hover:text-destructive transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="p-6">
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, href, color }) => (
            <Link key={label} to={href}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow group">
              <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-2xl font-bold text-foreground">{value}</span>
              <p className="text-sm text-muted-foreground mt-0.5 group-hover:text-primary transition-colors">{label}</p>
            </Link>
          ))}
        </div>

        {/* Quick nav */}
        <h2 className="font-bold text-foreground mb-4">Tezkor havolalar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { href: "/admin/books", label: "Kitoblarni boshqarish", icon: BookOpen },
            { href: "/admin/orders", label: "Buyurtmalar", icon: ShoppingBag },
            { href: "/admin/users", label: "Foydalanuvchilar", icon: Users },
            { href: "/admin/news", label: "Yangiliklar", icon: Newspaper },
          ].map(({ href, label, icon: Icon }) => (
            <Link key={href} to={href}
              className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-sm transition-all">
              <Icon className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm text-foreground">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
