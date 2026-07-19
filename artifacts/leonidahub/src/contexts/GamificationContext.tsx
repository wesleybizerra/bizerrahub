import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useRef, useCallback } from "react";

const STORAGE_KEY = "bizerrahub_gamification_v1";

export interface Badge {
  id: string;
  label: string;
  description: string;
  icon: string;
}

interface GamificationState {
  points: number;
  streak: number;
  lastVisitDate: string | null;
  visitedPages: string[];
  badges: string[];
  dailyRewardClaimedOn: string | null;
  hasClickedPlan: boolean;
  purchaseClicks: number;
}

interface ToastEvent {
  id: number;
  message: string;
  type: "points" | "levelup" | "badge" | "coupon";
}

interface GamificationContextValue {
  points: number;
  streak: number;
  level: number;
  levelName: string;
  progressToNextLevel: number; // 0-100
  pointsToNextLevel: number;
  badges: Badge[];
  allBadges: Badge[];
  toasts: ToastEvent[];
  dailyRewardAvailable: boolean;
  discountCode: string | null;
  discountPercent: number;
  registerPageVisit: (path: string) => void;
  registerPlanView: () => void;
  registerPurchaseClick: (planName: string) => void;
  claimDailyReward: () => void;
  dismissToast: (id: number) => void;
}

const LEVELS = [
  { level: 1, name: "Novato de Los Santos", minPoints: 0 },
  { level: 2, name: "Cidadão de Leonida", minPoints: 150 },
  { level: 3, name: "Veterano do RP", minPoints: 400 },
  { level: 4, name: "Lenda das Ruas", minPoints: 800 },
  { level: 5, name: "Ícone da BizerraHUB", minPoints: 1500 },
];

export const ALL_BADGES: Badge[] = [
  { id: "primeira-visita", label: "Bem-vindo(a)", description: "Chegou pela primeira vez à BizerraHUB", icon: "🎮" },
  { id: "streak-3", label: "Presença Confirmada", description: "3 dias seguidos visitando o site", icon: "🔥" },
  { id: "streak-7", label: "Rato de Vice City", description: "7 dias seguidos visitando o site", icon: "🌆" },
  { id: "explorador", label: "Explorador de Servidores", description: "Visitou o diretório de servidores", icon: "🗺️" },
  { id: "curioso-planos", label: "De Olho nos Planos", description: "Conferiu a página de planos", icon: "💎" },
  { id: "quase-la", label: "Quase Lá", description: "Clicou para assinar um plano", icon: "🚀" },
  { id: "leitor-noticias", label: "Repórter de Leonida", description: "Acompanhou as notícias de GTA 6", icon: "📰" },
];

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string) {
  const d1 = new Date(a).getTime();
  const d2 = new Date(b).getTime();
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

function loadState(): GamificationState {
  if (typeof window === "undefined") {
    return { points: 0, streak: 0, lastVisitDate: null, visitedPages: [], badges: [], dailyRewardClaimedOn: null, hasClickedPlan: false, purchaseClicks: 0 };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore corrupt storage
  }
  return { points: 0, streak: 0, lastVisitDate: null, visitedPages: [], badges: [], dailyRewardClaimedOn: null, hasClickedPlan: false, purchaseClicks: 0 };
}

const GamificationContext = createContext<GamificationContextValue | null>(null);

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GamificationState>(loadState);
  const [toasts, setToasts] = useState<ToastEvent[]>([]);
  const toastIdRef = useRef(0);
  const initializedRef = useRef(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage may be unavailable (private mode) — fail silently
    }
  }, [state]);

  const pushToast = useCallback((message: string, type: ToastEvent["type"]) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const awardBadge = useCallback((badgeId: string) => {
    setState((prev) => {
      if (prev.badges.includes(badgeId)) return prev;
      const badge = ALL_BADGES.find((b) => b.id === badgeId);
      if (badge) pushToast(`Nova conquista: ${badge.icon} ${badge.label}`, "badge");
      return { ...prev, badges: [...prev.badges, badgeId] };
    });
  }, [pushToast]);

  const addPoints = useCallback((amount: number, reason?: string) => {
    setState((prev) => {
      const before = LEVELS.filter((l) => prev.points >= l.minPoints).pop()!.level;
      const newPoints = prev.points + amount;
      const after = LEVELS.filter((l) => newPoints >= l.minPoints).pop()!.level;
      if (reason) pushToast(`+${amount} pontos — ${reason}`, "points");
      if (after > before) {
        const newLevelInfo = LEVELS.find((l) => l.level === after)!;
        window.setTimeout(() => pushToast(`Você subiu de nível! Agora é ${newLevelInfo.name} 🎉`, "levelup"), 500);
      }
      return { ...prev, points: newPoints };
    });
  }, [pushToast]);

  // Daily visit / streak handling — runs once on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    setState((prev) => {
      const today = todayStr();
      if (prev.lastVisitDate === today) return prev;

      let newStreak = 1;
      if (prev.lastVisitDate) {
        const gap = daysBetween(prev.lastVisitDate, today);
        newStreak = gap === 1 ? prev.streak + 1 : 1;
      }

      const isFirstEver = !prev.lastVisitDate;
      const next = { ...prev, lastVisitDate: today, streak: newStreak };

      window.setTimeout(() => {
        if (isFirstEver) {
          awardBadge("primeira-visita");
          addPoints(20, "primeira visita");
        } else {
          addPoints(10, `dia ${newStreak} seguido no site`);
        }
        if (newStreak === 3) awardBadge("streak-3");
        if (newStreak >= 7) awardBadge("streak-7");
      }, 300);

      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const registerPageVisit = useCallback((path: string) => {
    setState((prev) => {
      if (prev.visitedPages.includes(path)) return prev;
      window.setTimeout(() => addPoints(5, "explorando o site"), 100);
      if (path === "/servidores") window.setTimeout(() => awardBadge("explorador"), 150);
      if (path === "/noticias") window.setTimeout(() => awardBadge("leitor-noticias"), 150);
      return { ...prev, visitedPages: [...prev.visitedPages, path] };
    });
  }, [addPoints, awardBadge]);

  const registerPlanView = useCallback(() => {
    setState((prev) => {
      if (prev.hasClickedPlan) return prev;
      window.setTimeout(() => {
        addPoints(15, "conferindo os planos");
        awardBadge("curioso-planos");
      }, 100);
      return { ...prev, hasClickedPlan: true };
    });
  }, [addPoints, awardBadge]);

  const registerPurchaseClick = useCallback((planName: string) => {
    setState((prev) => ({ ...prev, purchaseClicks: prev.purchaseClicks + 1 }));
    addPoints(40, `interesse no plano ${planName}`);
    awardBadge("quase-la");
  }, [addPoints, awardBadge]);

  const claimDailyReward = useCallback(() => {
    const today = todayStr();
    setState((prev) => {
      if (prev.dailyRewardClaimedOn === today) return prev;
      window.setTimeout(() => addPoints(25, "recompensa diária resgatada"), 100);
      return { ...prev, dailyRewardClaimedOn: today };
    });
  }, [addPoints]);

  const level = LEVELS.filter((l) => state.points >= l.minPoints).pop()!.level;
  const currentLevelInfo = LEVELS.find((l) => l.level === level)!;
  const nextLevelInfo = LEVELS.find((l) => l.level === level + 1);

  const progressToNextLevel = nextLevelInfo
    ? Math.min(100, Math.round(((state.points - currentLevelInfo.minPoints) / (nextLevelInfo.minPoints - currentLevelInfo.minPoints)) * 100))
    : 100;

  const pointsToNextLevel = nextLevelInfo ? nextLevelInfo.minPoints - state.points : 0;

  const badges = useMemo(() => ALL_BADGES.filter((b) => state.badges.includes(b.id)), [state.badges]);

  // Discount reward for loyal / engaged users — the more they explore & the higher their level, the better the code
  const discountPercent = level >= 4 ? 20 : level >= 3 ? 15 : level >= 2 ? 10 : 0;
  const discountCode = discountPercent > 0 ? `LEONIDA${discountPercent}` : null;

  const dailyRewardAvailable = state.dailyRewardClaimedOn !== todayStr();

  const value: GamificationContextValue = {
    points: state.points,
    streak: state.streak,
    level,
    levelName: currentLevelInfo.name,
    progressToNextLevel,
    pointsToNextLevel,
    badges,
    allBadges: ALL_BADGES,
    toasts,
    dailyRewardAvailable,
    discountCode,
    discountPercent,
    registerPageVisit,
    registerPlanView,
    registerPurchaseClick,
    claimDailyReward,
    dismissToast,
  };

  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
}

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error("useGamification deve ser usado dentro de GamificationProvider");
  return ctx;
}
