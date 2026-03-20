import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import type { LoginCredentials } from "@/types";

const LoginPage = () => {
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
      navigate(-1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xato yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-12 flex justify-center">
        <div className="w-full max-w-sm">
          <div className="bg-card border border-border rounded-2xl shadow-sm p-8">
            <h1 className="font-display text-2xl font-bold text-foreground text-center mb-1">
              Kirish
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Akkauntingizga kiring
            </p>

            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email kiritish shart",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Noto'g'ri email" },
                  })}
                  className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground outline-none focus:border-primary transition-colors"
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-foreground">Parol</label>
                  <button 
                    type="button" 
                    onClick={() => toast.info("Parolni tiklash funksiyasi tez orada ishga tushadi.")}
                    className="text-xs text-primary hover:underline"
                  >
                    Parolni unutdingizmi?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: "Parol kiritish shart" })}
                    className="w-full px-3 py-2.5 pr-10 border border-border rounded-lg bg-background text-foreground outline-none focus:border-primary transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="remember" className="text-sm font-medium text-foreground cursor-pointer">
                  Meni eslab qol
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Kirish"
                )}
              </button>
            </form>

            <p className="text-sm text-center text-muted-foreground mt-5">
              Akkauntingiz yo'qmi?{" "}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Ro'yxatdan o'ting
              </Link>
            </p>

            {/* Demo credentials */}
            <div className="mt-4 p-3 bg-secondary rounded-lg text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Test ma'lumotlar:</p>
              <p>👤 user@test.uz / test123</p>
              <p>🔑 admin@ziyochashmasi.uz / ZiyoAdmin2025!</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
