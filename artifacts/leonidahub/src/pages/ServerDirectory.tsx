import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { useState } from "react";
import { SEED_SERVERS } from "@/data/seed";
import { ShieldCheck, Zap, Star, MessageSquare, Search, Filter, Lock, Play } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ServerDirectory() {
  const { effectiveRole } = useAuth();
  const isLocked = effectiveRole === "visitor";
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);

  const handleFilterClick = () => {
    if (isLocked) {
      setShowPaywall(true);
    }
  };

  const servers = SEED_SERVERS;

  return (
    <Layout>
      <div className="border-b border-white/5 bg-[#0B0B14] sticky top-[72px] md:top-[76px] z-40 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
            <input 
              type="text" 
              placeholder="Buscar servidor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={handleFilterClick}
              readOnly={isLocked}
              className={`w-full bg-surface border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors ${isLocked ? 'cursor-not-allowed opacity-70' : ''}`}
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto hide-scrollbar pb-1 md:pb-0">
            {["País", "Estilo", "Allowlist", "Nível", "Ordenar por"].map((filter) => (
              <button 
                key={filter}
                onClick={handleFilterClick}
                className="flex items-center gap-2 bg-surface border border-white/10 rounded-xl px-4 py-3 text-sm font-semibold text-white whitespace-nowrap hover:bg-white/5 transition-colors relative"
              >
                {filter} <Filter size={14} className="text-primary" />
                {isLocked && <Lock size={12} className="absolute top-2 right-2 text-text-muted opacity-50" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-white uppercase tracking-tight">Diretório de Servidores</h1>
          <p className="text-text-muted mt-2 text-lg">Encontre sua próxima casa no Roleplay.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.map((server, idx) => {
            const isBlurred = idx >= 5 && isLocked;

            return (
              <div key={server.id} className="relative">
                <Link href={isBlurred ? "#" : `/servidor/${server.slug}`} onClick={(e) => {
                  if (isBlurred) {
                    e.preventDefault();
                    setShowPaywall(true);
                  }
                }}>
                  <div className={`leonida-card p-5 group h-full flex flex-col ${isBlurred ? 'opacity-40 blur-sm pointer-events-none' : 'cursor-pointer'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#0B0B14] border border-white/10 flex items-center justify-center font-display text-xl text-primary shadow-[0_0_15px_rgba(255,46,136,0.3)]">
                          #{server.rank}
                        </div>
                        <div>
                          <h3 className="font-display text-xl text-white group-hover:text-primary transition-colors flex items-center gap-2">
                            {server.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded text-text-muted">
                              {server.style}
                            </span>
                            {server.allowlist && (
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded flex items-center gap-1">
                                <ShieldCheck size={10} /> Allowlist
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-text-muted line-clamp-2 mb-6 flex-1">
                      {server.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-accent font-bold text-sm">
                          <Star size={14} className="fill-accent" />
                          {server.rating.toFixed(1)}
                        </div>
                        <div className="flex items-center gap-1 text-text-muted font-bold text-sm">
                          <MessageSquare size={14} />
                          {server.reviewCount}
                        </div>
                      </div>
                      <span className="text-primary font-bold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={14} className="fill-primary" /> Jogar
                      </span>
                    </div>
                  </div>
                </Link>

                {isBlurred && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface/50 rounded-xl backdrop-blur-sm border border-white/10">
                    <Lock className="w-12 h-12 text-primary mb-4" />
                    <h4 className="font-display text-xl text-white mb-2">Conteúdo Bloqueado</h4>
                    <p className="text-sm text-text-muted mb-4 text-center px-6">Assine para ver o ranking completo além do Top 5.</p>
                    <button 
                      onClick={() => setShowPaywall(true)}
                      className="btn-primary px-6 py-2 rounded-lg text-sm"
                    >
                      Desbloquear Acesso
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={showPaywall} onOpenChange={setShowPaywall}>
        <DialogContent className="bg-surface border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl uppercase">Desbloqueie o Diretório</DialogTitle>
            <DialogDescription className="text-text-muted text-base">
              Visitantes só têm acesso aos Top 5 servidores. Assine um plano para ver o ranking completo, usar filtros avançados e avaliar servidores.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-lg">Cidadão</h4>
                <p className="text-sm text-text-muted">Acesso completo + Avaliações</p>
              </div>
              <div className="text-right">
                <span className="block font-display text-xl text-primary">R$ 29,90</span>
                <span className="text-xs text-text-muted">/mês</span>
              </div>
            </div>
            
            <div className="p-4 rounded-xl border border-secondary/30 bg-secondary/5 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-lg">VIP</h4>
                <p className="text-sm text-text-muted">Tudo + Guias de Whitelist</p>
              </div>
              <div className="text-right">
                <span className="block font-display text-xl text-secondary">R$ 199,90</span>
                <span className="text-xs text-text-muted">/mês</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-2">
            <Link href="/planos" className="btn-primary w-full text-center py-3 rounded-xl text-lg">
              Ver todos os planos
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
