import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { LoginCredentials } from "@/types";

const AdminLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    setError("");
    setIsLoading(true);
    try {
      await login(data);
      navigate("/admin");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xato yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Ziyo Chashmasi boshqaruvi</p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Email</label>
              <input
                type="email"
                {...register("email", { required: "Email kiritish shart" })}
                className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground outline-none focus:border-primary transition-colors"
                placeholder="admin@ziyochashmasi.uz"
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Parol</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Parol kiritish shart" })}
                  className="w-full px-3 py-2.5 pr-10 border border-border rounded-lg bg-background text-foreground outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Kirish"}
            </button>
          </form>
          <div className="mt-4 p-3 bg-secondary rounded-lg text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Kirish uchun:</span> admin@ziyochashmasi.uz / ZiyoAdmin2025!
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
