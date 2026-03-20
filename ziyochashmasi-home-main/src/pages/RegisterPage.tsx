import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import type { RegisterData } from "@/types";

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterData & { confirmPassword: string }>();
  const password = watch("password");

  const onSubmit = async (data: RegisterData & { confirmPassword: string }) => {
    setError("");
    setIsLoading(true);
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password, phone: data.phone });
      navigate("/");
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
              Ro'yxatdan o'tish
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Yangi akkount yarating
            </p>

            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Ism</label>
                <input
                  {...register("name", { required: "Ism kiritish shart", minLength: { value: 2, message: "Kamida 2 ta harf" } })}
                  className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground outline-none focus:border-primary transition-colors"
                  placeholder="To'liq ismingiz"
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email kiritish shart",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Noto'g'ri email" },
                  })}
                  className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground outline-none focus:border-primary transition-colors"
                  placeholder="email@example.com"
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Telefon (ixtiyoriy)</label>
                <input
                  {...register("phone")}
                  className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground outline-none focus:border-primary transition-colors"
                  placeholder="+998 XX XXX XX XX"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Parol</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: "Parol kiritish shart", minLength: { value: 6, message: "Kamida 6 ta belgi" } })}
                    className="w-full px-3 py-2.5 pr-10 border border-border rounded-lg bg-background text-foreground outline-none focus:border-primary transition-colors"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Parolni tasdiqlang</label>
                <input
                  type="password"
                  {...register("confirmPassword", {
                    required: "Parolni tasdiqlang",
                    validate: (v) => v === password || "Parollar mos kelmadi",
                  })}
                  className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Ro'yxatdan o'tish"}
              </button>
            </form>

            <p className="text-sm text-center text-muted-foreground mt-5">
              Akkauntingiz bormi?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">Kirish</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;
