import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCurrentMe, logout, withdraw } from "@/api/auth";
import { INIT_AUTH_CONTEXT } from "@/shared/constants/auth";
import type { User } from "@/shared/type/user";

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  user?: User;
  login: (user: User) => void;
  handleLogout: () => Promise<void>;
  handleWithdraw: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(INIT_AUTH_CONTEXT);

// Context를 쉽게 사용하기 위한 Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [user, setUser] = useState<User>();

  const clearAuth = useCallback(() => {
    setIsAuthenticated(false);
    setUser(undefined);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await getCurrentMe();

        if (response.success && response.data) {
          setIsAuthenticated(true);
          setUser(response.data);
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("user", JSON.stringify(response.data));
          return;
        }

        clearAuth();
      } catch {
        clearAuth();
      } finally {
        setIsAuthInitialized(true);
      }
    };

    void initializeAuth();
  }, [clearAuth]);

  const login = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = async () => {
    await logout();

    clearAuth();
  };

  const handleWithdraw = async () => {
    const response = await withdraw();

    if (!response.success) {
      throw new Error("회원 탈퇴에 실패했습니다.");
    }

    clearAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthInitialized,
        user,
        login,
        handleLogout,
        handleWithdraw,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
