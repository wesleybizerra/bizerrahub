import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Gift, Trophy, X, Sparkles, Ticket } from "lucide-react";
import { useGamification } from "@/contexts/GamificationContext";

export function GamificationWidget() {
  const {
    points,
    streak,
    level,
    levelName,
    progressToNextLevel,
    pointsToNextLevel,
    badges,
    allBadges,
    toasts,
    dailyRewardAvailable,
    discountCode,
    discountPercent,
    claimDailyReward,
    dismissToast,
  } = useGamification();

  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      {/* Toast stack */}
      <div className="fixed top-20 right-4 z-[80] flex flex-col gap-2 items-end pointer-events-none max-w-[90vw]">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              className={`pointer-events-auto rounded-xl px-4 py-3 shadow-lg border text-sm font-bold flex items-center gap-2 ${
                toast.type === "levelup"
                  ? "bg-brand-gradient text-[#0B0B14] border-transparent"
                  : toast.type === "badge"
                  ? "bg-[#14141F] text-white border-primary/50"
                  : "bg-[#14141F] text-white border-white/10"
              }`}
              onClick={() => dismissToast(toast.id)}
            >
              <Sparkles size={16} className="shrink-0" />
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating launcher */}
      <motion.button
        onClick={() => setIsPanelOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-[70] flex items-center gap-2 bg-[#14141F] border border-primary/40 shadow-[0_0_20px_rgba(255,46,136,0.25)] rounded-full pl-3 pr-4 py-2.5 text-white"
      >
        <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-brand-gradient text-[#0B0B14] font-display text-sm">
          {level}
          {dailyRewardAvailable && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-pulse" />
          )}
        </span>
        <span className="hidden sm:flex flex-col items-start leading-tight">
          <span className="text-xs font-bold">{points} pts</span>
          <span className="text-[10px] text-text-muted flex items-center gap-1">
            <Flame size={10} className="text-primary" /> {streak} dias
          </span>
        </span>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[90]"
              onClick={() => setIsPanelOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              className="fixed bottom-0 sm:bottom-6 right-0 sm:right-6 left-0 sm:left-auto z-[95] w-full sm:w-[380px] max-h-[85vh] overflow-y-auto bg-[#14141F] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl text-white uppercase flex items-center gap-2">
                  <Trophy size={20} className="text-primary" /> Sua Jornada
                </h3>
                <button onClick={() => setIsPanelOpen(false)} className="text-text-muted hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="bg-[#0B0B14] border border-white/10 rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-bold text-sm">{levelName}</span>
                  <span className="text-xs text-text-muted">{points} pts</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-gradient rounded-full transition-all"
                    style={{ width: `${progressToNextLevel}%` }}
                  />
                </div>
                <p className="text-[11px] text-text-muted mt-2">
                  {pointsToNextLevel > 0
                    ? `Faltam ${pointsToNextLevel} pontos para o próximo nível`
                    : "Nível máximo alcançado — você é uma lenda!"}
                </p>
              </div>

              <div className="flex items-center gap-3 bg-[#0B0B14] border border-white/10 rounded-2xl p-4 mb-4">
                <Flame className="text-primary" size={24} />
                <div>
                  <p className="text-white font-bold text-sm">{streak} dias seguidos</p>
                  <p className="text-[11px] text-text-muted">Volte todo dia para manter sua sequência</p>
                </div>
              </div>

              <button
                onClick={claimDailyReward}
                disabled={!dailyRewardAvailable}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm mb-4 transition-colors ${
                  dailyRewardAvailable
                    ? "btn-primary"
                    : "bg-white/5 text-text-muted cursor-not-allowed border border-white/10"
                }`}
              >
                <Gift size={18} />
                {dailyRewardAvailable ? "Resgatar recompensa diária (+25 pts)" : "Recompensa de hoje já resgatada"}
              </button>

              {discountCode && (
                <div className="bg-brand-gradient/10 border border-primary/30 rounded-2xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Ticket size={18} className="text-primary" />
                    <span className="text-white font-bold text-sm">Cupom desbloqueado: {discountPercent}% OFF</span>
                  </div>
                  <p className="text-[11px] text-text-muted mb-2">
                    Recompensa por sua fidelidade. Use o código abaixo ao assinar um plano.
                  </p>
                  <div className="bg-[#0B0B14] border border-dashed border-primary/50 rounded-lg px-3 py-2 text-center font-display text-primary tracking-widest">
                    {discountCode}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3">
                  Conquistas ({badges.length}/{allBadges.length})
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {allBadges.map((badge) => {
                    const unlocked = badges.some((b) => b.id === badge.id);
                    return (
                      <div
                        key={badge.id}
                        title={`${badge.label} — ${badge.description}`}
                        className={`aspect-square rounded-xl flex items-center justify-center text-xl border ${
                          unlocked
                            ? "bg-brand-gradient/20 border-primary/40"
                            : "bg-white/5 border-white/5 grayscale opacity-30"
                        }`}
                      >
                        {badge.icon}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
