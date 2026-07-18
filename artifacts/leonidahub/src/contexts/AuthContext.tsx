import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole, UserPlan } from "@workspace/api-client-react";
import { MOCK_USERS } from "../data/seed";

type ViewAsType = "visitor" | "cidadao" | "vip" | "fundador" | "admin";

interface AuthContextType {
  currentUser: User | null;
  viewAs: ViewAsType | null;
  effectiveRole: ViewAsType;
  login: (email: string) => Promise<void>;
  logout: () => void;
  setViewAs: (role: ViewAsType | null) => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [viewAs, setViewAsState] = useState<ViewAsType | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Initialize mock users in localStorage if they don't exist
    const users = localStorage.getItem("bizerra_users");
    if (!users) {
      localStorage.setItem("bizerra_users", JSON.stringify(MOCK_USERS));
    }

    // Hydrate current user from token/localStorage
    const storedToken = localStorage.getItem("bizerra_token");
    const storedUser = localStorage.getItem("bizerra_current_user");
    const storedViewAs = localStorage.getItem("bizerra_view_as") as ViewAsType | null;

    if (storedToken && storedUser) {
      setToken(storedToken);
      setCurrentUser(JSON.parse(storedUser));
    }
    
    if (storedViewAs) {
      setViewAsState(storedViewAs);
    }
  }, []);

  const login = async (email: string) => {
    const users: User[] = JSON.parse(localStorage.getItem("bizerra_users") || "[]");
    const user = users.find(u => u.email === email);
    
    if (user) {
      const mockToken = `mock_token_${user.id}_${Date.now()}`;
      localStorage.setItem("bizerra_token", mockToken);
      localStorage.setItem("bizerra_current_user", JSON.stringify(user));
      setToken(mockToken);
      setCurrentUser(user);
      setViewAsState(null); // Reset viewAs on fresh login
      localStorage.removeItem("bizerra_view_as");
    } else {
      throw new Error("Credenciais inválidas. Tente um dos usuários de teste.");
    }
  };

  const logout = () => {
    localStorage.removeItem("bizerra_token");
    localStorage.removeItem("bizerra_current_user");
    localStorage.removeItem("bizerra_view_as");
    setToken(null);
    setCurrentUser(null);
    setViewAsState(null);
  };

  const setViewAs = (role: ViewAsType | null) => {
    setViewAsState(role);
    if (role) {
      localStorage.setItem("bizerra_view_as", role);
    } else {
      localStorage.removeItem("bizerra_view_as");
    }
  };

  const effectiveRole = viewAs ?? (currentUser?.role as ViewAsType) ?? "visitor";

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        viewAs,
        effectiveRole,
        login,
        logout,
        setViewAs,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
