import { Layout } from "@/components/Layout";
import { Link, useParams } from "wouter";
import { useServers } from "@/hooks/useServers";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldCheck, Star, Users, ExternalLink, MessageSquare, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ServerPage() {
  const { slug } = useParams();
  const { effectiveRole } = useAuth();
  const { toast } = useToast();

  const { servers } = useServers();
  const server = servers.find(s => s.slug === slug);
  if (!server) return <Layout><div className="max-w-4xl mx-auto px-4 py-24 text-center text-text-muted">Carregando ou servidor não encontrado...</div></Layout>;
  const canReview = effectiveRole !== "visitor";

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { currentUser } = useAuth();

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canReview || !currentUser) return;

    await addDoc(collection(db, "reviews"), {
      serverSlug: server.slug,
      serverName: server.name,
      userName: currentUser.name ?? currentUser.email,
      rating,
      comment,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    toast({
      title: "Avaliação enviada!",
      description: "Sua avaliação foi enviada para moderação. +20 XP",
    });
    setComment("");
  };

  return (
    <Layout>
      {/* Server Header */}
      <div className="w-full bg-surface border-b border-white/5 pt-12 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient opacity-5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-[#0B0B14] border border-white/10 flex items-center justify-center font-display text-4xl md:text-5xl text-primary shadow-[0_0_30px_rgba(255,46,136,0.3)] shrink-0">
              #{server.rank}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded bg-white/10 text-white text-xs font-bold uppercase tracking-widest">
                  {server.game === 'gtav' ? 'GTA V / FiveM' : 'GTA 6'}
                </span>
                {server.allowlist && (
                  <span className="px-3 py-1 rounded bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck size={14} /> Requer Allowlist
                  </span>
                )}
              </div>

              <h1 className="font-display text-4xl md:text-6xl text-white uppercase tracking-tight mb-4 flex items-center gap-3">
                {server.name}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} className={i < Math.floor(server.rating) ? "fill-accent text-accent" : "text-white/20"} />
                    ))}
                  </div>
                  <span className="font-bold text-white text-lg">{server.rating.toFixed(1)}</span>
                  <span className="text-text-muted">({server.reviewCount} avaliações)</span>
                </div>
                <div className="flex items-center gap-2 text-text-muted font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                  Servidor Online
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col gap-3 shrink-0">
              <a href={server.officialLink} target="_blank" rel="noreferrer" className="btn-primary w-full px-8 py-4 rounded-xl text-center font-bold text-lg flex items-center justify-center gap-2">
                Entrar no Discord <ExternalLink size={20} />
              </a>
              <button className="btn-secondary w-full px-8 py-3 rounded-xl text-center font-bold">
                Favoritar Servidor
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="font-display text-2xl text-white uppercase mb-4">Sobre o Servidor</h2>
            <div className="prose prose-invert max-w-none text-text-muted font-medium leading-relaxed">
              <p>{server.description}</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl text-white uppercase mb-4 flex items-center gap-2">
              <AlertCircle className="text-secondary" /> Como Entrar
            </h2>
            <div className="leonida-card p-6">
              <div className="space-y-4">
                {server.howToEnter?.split('\n').map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold shrink-0 mt-1">
                      {idx + 1}
                    </div>
                    <p className="text-white pt-1">{step.replace(/^\d+\.\s*/, '')}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-end justify-between mb-6">
              <h2 className="font-display text-2xl text-white uppercase flex items-center gap-2">
                <MessageSquare className="text-primary" /> Avaliações da Comunidade
              </h2>
            </div>

            {/* Review Form */}
            <div className="leonida-card p-6 mb-8">
              {canReview ? (
                <form onSubmit={handleReviewSubmit}>
                  <h3 className="text-white font-bold mb-4">Deixe sua avaliação</h3>
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="text-2xl focus:outline-none"
                      >
                        <Star className={star <= rating ? "fill-accent text-accent" : "text-white/20"} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Conte como é sua experiência neste servidor..."
                    required
                    className="w-full bg-[#0B0B14] border border-white/10 rounded-xl p-4 text-white placeholder:text-text-muted focus:outline-none focus:border-primary min-h-[100px] mb-4"
                  />
                  <button type="submit" className="btn-primary px-6 py-2 rounded-lg font-bold">
                    Enviar Avaliação
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <Lock className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-50" />
                  <h3 className="text-white font-bold mb-2">Faça upgrade para avaliar</h3>
                  <p className="text-text-muted text-sm mb-4">Apenas membros Cidadão ou superior podem deixar avaliações nos servidores.</p>
                  <Link href="/planos" className="btn-primary px-6 py-2 rounded-lg inline-block font-bold">
                    Ver Planos
                  </Link>
                </div>
              )}
            </div>

            {/* Mock Reviews List */}
            <div className="space-y-4">
              {[1, 2, 3].map((r) => (
                <div key={r} className="bg-surface border border-white/5 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="font-bold text-white block">Jogador Anonimo {r}</span>
                      <span className="text-xs text-text-muted">Há {r} dias</span>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < 4 ? "fill-accent text-accent" : "text-white/20"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-text-muted text-sm">Ótimo servidor, a staff é muito prestativa e a economia é bem balanceada. Recomendo muito para quem quer um RP sério de verdade.</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="leonida-card p-6">
            <h3 className="font-display text-xl text-white uppercase mb-4 border-b border-white/10 pb-4">Detalhes Técnicos</h3>
            <ul className="space-y-4">
              <li>
                <span className="text-text-muted text-xs uppercase tracking-widest font-bold block mb-1">País/Hospedagem</span>
                <span className="text-white font-medium flex items-center gap-2">
                  {server.country === 'BR' ? '🇧🇷 Brasil' : server.country === 'EUA' ? '🇺🇸 Estados Unidos' : '🌍 Internacional'}
                </span>
              </li>
              <li>
                <span className="text-text-muted text-xs uppercase tracking-widest font-bold block mb-1">Estilo de RP</span>
                <span className="text-white font-medium">{server.style}</span>
              </li>
              <li>
                <span className="text-text-muted text-xs uppercase tracking-widest font-bold block mb-1">Nível Recomendado</span>
                <span className="text-white font-medium capitalize">{server.level === 'veteran' ? 'Veteranos' : server.level === 'beginner' ? 'Iniciantes' : 'Todos os níveis'}</span>
              </li>
              <li>
                <span className="text-text-muted text-xs uppercase tracking-widest font-bold block mb-1">Status Allowlist</span>
                <span className="text-white font-medium">{server.allowlist ? 'Fechado (Requer aprovação)' : 'Aberto ao público'}</span>
              </li>
            </ul>
          </div>

          <div className="leonida-card p-6">
            <h3 className="font-display text-xl text-white uppercase mb-4 border-b border-white/10 pb-4">Badges Oficiais</h3>
            <div className="flex flex-wrap gap-2">
              {server.badges.map(badge => (
                <span key={badge} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-text-muted font-bold">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
