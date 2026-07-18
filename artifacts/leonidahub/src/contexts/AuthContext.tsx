import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export type UserRole = "visitor" | "cidadao" | "vip" | "fundador" | "admin";
export type UserPlan = "free" | "cidadao" | "vip" | "fundador";
type ViewAsType = UserRole;

export interface AppUser {
  uid: string;
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  plan: UserPlan;
  xp: number;
  level: number;
  streak: number;
  lastCheckIn: string | null;
  badges: string[];
}

interface AuthContextType {
  currentUser: AppUser | null;
  viewAs: ViewAsType | null;
  effectiveRole: ViewAsType;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setViewAs: (role: ViewAsType | null) => void;
  dailyCheckIn: () => Promise<{ xpGanho: number; streak: number } | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function levelFromXp(xp: number) {
  return Math.floor(xp / 100) + 1;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [viewAs, setViewAsState] = useState<ViewAsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedViewAs = localStorage.getItem("bizerra_view_as") as ViewAsType | null;
    if (storedViewAs) setViewAsState(storedViewAs);

    let unsubProfile: (() => void) | undefined;

    const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
      if (unsubProfile) unsubProfile();

      if (!fbUser) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      const userRef = doc(db, "users", fbUser.uid);
      unsubProfile = onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
          const data: any = snap.data();
          setCurrentUser({
            uid: fbUser.uid,
            id: fbUser.uid,
            email: data.email ?? fbUser.email ?? "",
            name: data.name ?? fbUser.displayName ?? null,
            role: data.role ?? "visitor",
            plan: data.plan ?? "free",
            xp: data.xp ?? 0,
            level: levelFromXp(data.xp ?? 0),
            streak: data.streak ?? 0,
            lastCheckIn: data.lastCheckIn ?? null,
            badges: data.badges ?? [],
          });
        }
        setLoading(false);
      });
    });

    return () => {
      unsubAuth();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
  };

  const register = async (name: string, email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db, "users", cred.user.uid), {
      email: email.trim().toLowerCase(),
      name,
      role: "visitor",
      plan: "free",
      xp: 0,
      streak: 0,
      lastCheckIn: null,
      badges: [],
      createdAt: serverTimestamp(),
    });
  };

  const logout = () => {
    signOut(auth);
    setViewAsState(null);
    localStorage.removeItem("bizerra_view_as");
  };

  const setViewAs = (role: ViewAsType | null) => {
    setViewAsState(role);
    if (role) localStorage.setItem("bizerra_view_as", role);
    else localStorage.removeItem("bizerra_view_as");
  };

  // ---- Gamificação: check-in diário ----
  const dailyCheckIn = async () => {
    if (!currentUser) return null;
    const today = new Date().toISOString().slice(0, 10);
    if (currentUser.lastCheckIn === today) return null;

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const novoStreak = currentUser.lastCheckIn === yesterday ? currentUser.streak + 1 : 1;
    const xpGanho = 10 + Math.min(novoStreak * 2, 40);
    const novoXp = currentUser.xp + xpGanho;
    const novoLevel = levelFromXp(novoXp);

    const badges = [...currentUser.badges];
    if (novoLevel >= 3 && !badges.includes("Bronze")) badges.push("Bronze");
    if (novoLevel >= 6 && !badges.includes("Prata")) badges.push("Prata");
    if (novoLevel >= 10 && !badges.includes("Ouro")) badges.push("Ouro");

    await setDoc(
      doc(db, "users", currentUser.uid),
      { xp: novoXp, streak: novoStreak, lastCheckIn: today, badges },
      { merge: true }
    );

    return { xpGanho, streak: novoStreak };
  };

  const effectiveRole = viewAs ?? currentUser?.role ?? "visitor";

  return (
    <AuthContext.Provider
      value={{ currentUser, viewAs, effectiveRole, loading, login, register, logout, setViewAs, dailyCheckIn }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
