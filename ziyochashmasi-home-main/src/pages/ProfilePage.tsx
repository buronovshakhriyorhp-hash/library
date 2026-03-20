import { Link } from "react-router-dom";
import { User, Package, LogOut, MapPin, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

// Mock orders for profile (Stage 4 da API bilan)
const mockOrders = [
  {
    id: 1001,
    date: "19.03.2026",
    status: "delivered",
    total: 89000,
    items: ["Alkimyogar", "Evrilish"],
  },
  {
    id: 1002,
    date: "15.03.2026",
    status: "shipped",
    total: 50000,
    items: ["Uch og'ayni"],
  },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Kutilmoqda", color: "text-yellow-600 bg-yellow-100" },
  paid: { label: "To'langan", color: "text-blue-600 bg-blue-100" },
  shipped: { label: "Yo'lda", color: "text-purple-600 bg-purple-100" },
  delivered: { label: "Yetkazildi", color: "text-green-600 bg-green-100" },
  cancelled: { label: "Bekor", color: "text-red-600 bg-red-100" },
};

const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-6">
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">Mening profilim</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile card */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-foreground">{user?.name}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                {user?.phone && (
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <Phone className="w-3 h-3" /> {user.phone}
                  </p>
                )}
              </div>
              <span
                className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                  user?.role === "admin"
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {user?.role === "admin" ? "Administrator" : "Foydalanuvchi"}
              </span>

              <div className="space-y-2 pt-2">
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block w-full py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center justify-center gap-2 w-full py-2 border border-border text-foreground rounded-xl text-sm hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Chiqish
                </button>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="lg:col-span-2">
            <h2 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Buyurtmalar tarixi
            </h2>
            {mockOrders.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
                Hali buyurtma berilmagan
              </div>
            ) : (
              <div className="space-y-3">
                {mockOrders.map((order) => {
                  const s = statusLabels[order.status];
                  return (
                    <div
                      key={order.id}
                      className="bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-foreground">
                            #{order.id}
                          </span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.color}`}>
                            {s.label}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {order.items.join(", ")}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {order.date}
                        </p>
                      </div>
                      <span className="font-bold text-primary shrink-0">
                        {order.total.toLocaleString()} UZS
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-4">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                Xarid qilishni davom ettirish →
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
