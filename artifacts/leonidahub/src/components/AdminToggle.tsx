import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Settings, Check, ChevronUp } from "lucide-react";

export function AdminToggle() {
  const { currentUser, viewAs, setViewAs, effectiveRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Only visible to actual admins
  if (currentUser?.role !== UserRole.admin) return null;

  const roles = [
    { value: "visitor", label: "Visitante (gratuito)" },
    { value: "cidadao", label: "Cidadão (R$ 29,90)" },
    { value: "vip", label: "VIP (R$ 199,90)" },
    { value: "fundador", label: "Fundador (R$ 399,90)" },
    { value: "admin", label: "Admin (total)" },
  ] as const;

  const currentLabel = roles.find(r => r.value === effectiveRole)?.label;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-56 leonida-card p-2 mb-2 shadow-xl shadow-primary/20 flex flex-col gap-1"
          >
            <div className="px-3 py-2 text-xs font-semibold text-text-muted border-b border-border/50 mb-1">
              Testar experiência como:
            </div>
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => {
                  setViewAs(role.value === "admin" ? null : role.value);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors ${
                  effectiveRole === role.value
                    ? "bg-primary/20 text-primary font-medium"
                    : "text-text hover:bg-surface-hover"
                }`}
              >
                {role.label}
                {effectiveRole === role.value && <Check size={14} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full brand-gradient-bg text-[#0B0B14] font-semibold text-sm shadow-[0_0_15px_rgba(255,46,136,0.4)] hover:shadow-[0_0_25px_rgba(255,46,136,0.6)] transition-all z-50 relative"
      >
        <Settings size={16} />
        <span>Visão: {currentLabel?.split(' ')[0]}</span>
        <ChevronUp size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
}
