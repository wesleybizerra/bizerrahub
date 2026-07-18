import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const { currentUser, effectiveRole, viewAs } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { href: "/servidores", label: "Servidores" },
    { href: "/guia", label: "Guia" },
    { href: "/leonida", label: "GTA 6" },
    { href: "/planos", label: "Planos" },
    { href: "/sobre", label: "Sobre" },
  ];

  return (
    <>
      {/* Required Top Banner */}
      <div className="sticky top-0 z-[60] w-full bg-[#14141F] border-b border-white/5 border-l-4 border-l-[#FF2E88] py-1.5 px-4 text-center flex items-center justify-center">
        <p className="text-xs md:text-sm font-medium text-[#F2F2F7]">
          📍 Dados atuais: servidores de GTA V (FiveM). Migração automática para GTA 6 no lançamento — 19/11/2026.
        </p>
      </div>

      <nav className="w-full border-b border-white/10 bg-[#0B0B14]/80 backdrop-blur-md sticky top-[32px] md:top-[36px] z-[50]">
        {/* Admin Warning Badge */}
        {viewAs && (
          <div className="bg-amber-500/20 text-amber-500 text-xs font-bold py-1 px-4 text-center w-full uppercase tracking-wider">
            MODO ADMIN — VISUALIZANDO COMO: {viewAs.toUpperCase()}
          </div>
        )}
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1 group">
            <span className="font-display text-2xl tracking-tighter text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all">
              BIZERRA
            </span>
            <span className="font-display text-2xl tracking-tighter text-white">HUB</span>
            <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(255,46,136,0.8)] ml-1 mb-1"></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors hover:text-primary ${
                    location === link.href ? "text-primary" : "text-text-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-white leading-tight">{currentUser.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{effectiveRole}</span>
                  </div>
                  <Link href="/admin" className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center hover:border-primary transition-colors text-white">
                    <UserIcon size={18} />
                  </Link>
                </div>
              ) : (
                <Link href="/admin/login" className="text-sm font-bold py-2 px-6 rounded-full btn-primary inline-flex items-center justify-center">
                  Entrar
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#0B0B14] pt-[120px] px-6"
          >
            <div className="flex flex-col gap-6 text-2xl font-display">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="h-px w-full bg-white/10 my-4"></div>
              
              {currentUser ? (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 text-lg font-sans font-bold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary">
                    <UserIcon size={20} />
                  </div>
                  <span>{currentUser.name} <span className="text-primary text-sm">({effectiveRole})</span></span>
                </Link>
              ) : (
                <Link
                  href="/admin/login"
                  className="btn-primary py-4 px-6 rounded-xl text-center text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Entrar na conta
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
