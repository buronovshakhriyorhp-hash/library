import { Link } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";

const mockUsers = [
  { id: 1, name: "Admin User", email: "admin@ziyochashmasi.uz", role: "admin", orders: 0, joined: "01.01.2025" },
  { id: 2, name: "Test Foydalanuvchi", email: "user@test.uz", role: "user", orders: 2, joined: "01.03.2025" },
  { id: 3, name: "Ahmadjon Toshmatov", email: "ahmadjon@test.uz", role: "user", orders: 5, joined: "15.02.2025" },
  { id: 4, name: "Malika Yusupova", email: "malika@test.uz", role: "user", orders: 1, joined: "10.03.2025" },
];

const AdminUsersPage = () => (
  <div className="min-h-screen bg-secondary/30">
    <header className="bg-card border-b border-border px-6 py-4 flex items-center gap-3 sticky top-0 z-40">
      <Link to="/admin" className="text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-5 h-5" />
      </Link>
      <span className="font-bold text-foreground">Foydalanuvchilar ({mockUsers.length})</span>
    </header>
    <div className="p-6">
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-foreground">Foydalanuvchi</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground hidden sm:table-cell">Rol</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground hidden md:table-cell">Buyurtmalar</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground hidden lg:table-cell">Qo'shilgan</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      u.role === "admin" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                    }`}>
                      {u.role === "admin" ? "Admin" : "Foydalanuvchi"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{u.orders}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default AdminUsersPage;
