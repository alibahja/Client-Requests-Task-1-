import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { authApi } from "../api/auth.api";
import { tokenStorage } from "../api/axios";
import type { LoginPayload, RegisterPayload, User } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => tokenStorage.get());
  const [isBootstrapping, setIsBootstrapping] = useState<boolean>(!!tokenStorage.get());

  // On mount: if we have a token, verify it by fetching /auth/me
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const existing = tokenStorage.get();
      if (!existing) {
        setIsBootstrapping(false);
        return;
      }
      try {
        const me = await authApi.me();
        if (!cancelled) {
          setUser(me);
          setToken(existing);
        }
      } catch {
        // Token invalid/expired — clear everything
        tokenStorage.clear();
        if (!cancelled) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const { user: u, token: t } = await authApi.login(payload);
    tokenStorage.set(t);
    setUser(u);
    setToken(t);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const { user: u, token: t } = await authApi.register(payload);
    tokenStorage.set(t);
    setUser(u);
    setToken(t);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isBootstrapping,
      login,
      register,
      logout,
    }),
    [user, token, isBootstrapping, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}