import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User, LoginCredentials, RegisterData } from "@/types";
import { authService } from "@/services/auth.service";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load: check if we have an active session
  useEffect(() => {
    const checkAuth = async () => {
      // Opt: faqat flag bo'lsa serverni so'raymiz
      const hasSession = localStorage.getItem("has_session");
      if (hasSession === "true") {
        try {
          const res = await authService.getMe();
          if (res.success && res.data) {
            setUser(res.data);
          }
        } catch (error) {
           // Token eskirgan bo'lishi mumkin, refreshni urinib ko'ramiz
           try {
              await authService.refresh();
              const retry = await authService.getMe();
              setUser(retry.data);
           } catch (e: any) {
              // FAQAT 401 yoki 403 xatolarda avtomatik chiqish
              if (e.response?.status === 401 || e.response?.status === 403) {
                setUser(null);
                localStorage.removeItem("has_session");
              }
           }
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const res = await authService.login(credentials);
    if (res.success && res.data?.user) {
      setUser(res.data.user);
      localStorage.setItem("has_session", "true");
    } else {
      throw new Error("Login failed");
    }
  };

  const register = async (data: RegisterData) => {
    const res = await authService.register(data);
    if (res.success && res.data?.user) {
      setUser(res.data.user);
      localStorage.setItem("has_session", "true");
    } else {
      throw new Error("Register failed");
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // ignore
    } finally {
      setUser(null);
      localStorage.removeItem("has_session");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
