import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAdminOrders, useUpdateOrderStatus } from "@/hooks/useOrders";

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Kutilmoqda", color: "bg-yellow-100/80 text-yellow-700" },
  paid: { label: "To'langan", color: "bg-blue-100/80 text-blue-700" },
  processing: { label: "Jarayonda", color: "bg-orange-100/80 text-orange-700" },
  shipped: { label: "Yo'lda", color: "bg-purple-100/80 text-purple-700" },
  delivered: { label: "Yetkazildi", color: "bg-green-100/80 text-green-700" },
  cancelled: { label: "Bekor qilingan", color: "bg-red-100/80 text-red-700" },
};

const AdminOrdersPage = () => {
  const [filterStatus, setFilterStatus] = useState("");
  
  const { data: orders = [], isLoading } = useAdminOrders();
  const { mutate: updateStatus } = useUpdateOrderStatus();

  const filtered = filterStatus ? orders.filter((o) => o.status === filterStatus) : orders;

  return (
    <div className="min-h-screen bg-secondary/30 pb-20">
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-bold text-foreground">Buyurtmalar</span>
        </div>
      </header>

      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button type="button" onClick={() => setFilterStatus("")}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${!filterStatus ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-secondary"}`}>
            Barchasi
          </button>
          {Object.entries(statusLabels).map(([key, { label }]) => (
            <button key={key} type="button" onClick={() => setFilterStatus(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${filterStatus === key ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-secondary"}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/50 border-b border-border text-left">
                  <th className="px-4 py-3 font-semibold text-foreground">#</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Mijoz / Telefon</th>
                  <th className="px-4 py-3 font-semibold text-foreground hidden sm:table-cell">Sana</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Jami (UZS)</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Holat</th>
                  <th className="px-4 py-3 font-semibold text-foreground text-right">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                   <tr>
                     <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                        Yuklanmoqda...
                     </td>
                   </tr>
                )}
                {!isLoading && filtered.length === 0 && (
                   <tr>
                     <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        Hozircha buyurtmalar yo'q
                     </td>
                   </tr>
                )}
                {!isLoading && filtered.map((order) => {
                  const s = statusLabels[order.status] || { label: order.status, color: "bg-secondary text-foreground" };
                  return (
                    <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-muted-foreground">#{order.id}</td>
                      <td className="px-4 py-3 text-left">
                        <p className="font-semibold text-foreground">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{order.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell text-left">
                        {new Date(order.createdAt).toLocaleDateString("uz-UZ", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 font-bold text-primary text-left">
                        {order.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-left">
                        <span className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${s.color}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus({ id: order.id, status: e.target.value })}
                          className="text-xs border border-border rounded-lg px-2 py-1.5 bg-background text-foreground outline-none focus:border-primary transition-colors cursor-pointer"
                        >
                          {Object.entries(statusLabels).map(([k, { label }]) => (
                            <option key={k} value={k}>{label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
