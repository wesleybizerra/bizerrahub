import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { SEED_SERVERS } from "@/data/seed";
import { Trophy, Star, MessageSquare, ArrowRight, ShieldCheck, Zap, Users, MonitorPlay, Clock } from "lucide-react";
import { useJoinWaitlist } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

function calcTimeLeft(targetDate: number) {
  const difference = targetDate - new Date().getTime();
  if (difference <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0 };
  return {
    dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
    horas: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutos: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    segundos: Math.floor((difference % (1000 * 60)) / 1000)
  };
}

function Countdown() {
  const targetDate = new Date("2026-11-19T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      const tl = calcTimeLeft(targetDate);
      setTimeLeft(tl);
      if (tl.dias === 0 && tl.horas === 0 && tl.minutos === 0 && tl.segundos === 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6 mt-12 mb-8">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-24 sm:h-24 leonida-card flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.2)] border-secondary/30 relative overflow-hidden group">
            <div className="absolute inset-0 bg-secondary/5 group-hover:bg-secondary/10 transition-colors"></div>
            <span className="font-display text-2xl sm:text-4xl text-white relative z-10">{value.toString().padStart(2, "0")}</span>
          </div>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-secondary mt-2">{unit}</span>
        </div>
      ))}
    </div>
  );
}

function ServerCard({ server, index }: { server: any, index: number }) {
  return (
    <Link href={`/servidor/${server.slug}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="leonida-card p-5 group cursor-pointer h-full flex flex-col"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-surface border border-white/10 flex items-center justify-center font-display text-xl text-primary shadow-[0_0_15px_rgba(255,46,136,0.3)]">
              #{server.rank}
            </div>
            <div>
              <h3 className="font-display text-xl text-white group-hover:text-primary transition-colors flex items-center gap-2">
                {server.name}
                {server.country === 'BR' ? '🇧🇷' : server.country === 'EUA' ? '🇺🇸' : '🌍'}
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
                {server.trending && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-accent/10 text-accent px-2 py-0.5 rounded flex items-center gap-1">
                    <Zap size={10} /> Em Alta
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
          <span className="text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
            <ArrowRight size={18} />
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

export default function Home() {
  const top5 = SEED_SERVERS.slice(0, 5);
  const joinWaitlist = useJoinWaitlist();
  const { toast } = useToast();

  const handleWaitlistSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    
    if (email) {
      joinWaitlist.mutate({ data: { email } }, {
        onSuccess: () => {
          toast({
            title: "Pronto! Você tá na lista.",
            description: "Avisaremos assim que os servidores abrirem.",
          });
          (e.target as HTMLFormElement).reset();
        },
        onError: () => {
          toast({
            title: "Você já está na lista!",
            description: "Fique de olho no seu e-mail.",
          });
        }
      });
    }
  };

  return (
    <Layout>
      {/* Hero Section with custom CSS art */}
      <section className="relative w-full overflow-hidden pt-20 pb-32">
        {/* Background artwork */}
        <div className="absolute inset-0 z-0 pointer-events-none flex flex-col justify-end">
          {/* Sunset Gradient */}
          <div className="absolute bottom-0 w-full h-[80%] bg-gradient-to-t from-primary/10 via-[#1A0B2E]/50 to-transparent"></div>
          
          {/* Retro Grid */}
          <div className="absolute bottom-0 w-full h-[40%] bg-[linear-gradient(transparent_0%,rgba(0,229,255,0.2)_2%,transparent_3%),linear-gradient(90deg,transparent_0%,rgba(0,229,255,0.2)_2%,transparent_3%)] bg-[size:100px_40px] [transform:perspective(500px)_rotateX(60deg)] origin-bottom opacity-30"></div>
          
          {/* Palms Silhouette */}
          <svg className="absolute bottom-0 left-0 w-full h-auto opacity-20" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#0B0B14" d="M0,320L1440,320L1440,250L1350,260C1320,265,1290,260,1270,240C1250,220,1230,190,1190,180C1150,170,1100,180,1070,210C1040,240,1020,280,980,290C940,300,890,280,850,250C810,220,770,180,720,170C670,160,610,180,560,210C510,240,450,280,390,290C330,300,270,280,210,250C150,220,90,180,45,160L0,140Z"></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white tracking-tighter uppercase max-w-4xl mx-auto leading-[0.9]">
              Encontre seu servidor.<br />
              <span className="brand-gradient-text">Viva sua história.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-text-muted font-medium max-w-2xl mx-auto">
              O hub definitivo do roleplay brasileiro — hoje com GTA V, em breve com a nova geração.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full"
          >
            <Countdown />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex gap-4"
          >
            <Link href="/servidores" className="btn-primary px-8 py-4 rounded-xl text-lg flex items-center gap-2">
              Explorar Servidores <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/10 bg-surface/50 py-10 relative overflow-hidden backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="py-4 md:py-0 flex flex-col items-center justify-center">
              <span className="font-display text-4xl text-white mb-1 tracking-tighter">
                <MonitorPlay size={32} className="inline text-primary mr-3 mb-1" />
                7+
              </span>
              <span className="text-sm font-bold uppercase tracking-widest text-text-muted">Servidores Listados</span>
            </div>
            <div className="py-4 md:py-0 flex flex-col items-center justify-center">
              <span className="font-display text-4xl text-white mb-1 tracking-tighter">
                <Star size={32} className="inline text-accent mr-3 mb-1" />
                14.000+
              </span>
              <span className="text-sm font-bold uppercase tracking-widest text-text-muted">Avaliações</span>
            </div>
            <div className="py-4 md:py-0 flex flex-col items-center justify-center">
              <span className="font-display text-4xl text-white mb-1 tracking-tighter">
                <Users size={32} className="inline text-secondary mr-3 mb-1" />
                28.000+
              </span>
              <span className="text-sm font-bold uppercase tracking-widest text-text-muted">Na Lista de Espera</span>
            </div>
          </div>
        </div>
      </section>

      {/* Top 5 Servers */}
      <section className="py-24 max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-5xl text-white tracking-tight uppercase flex items-center gap-3">
              <Trophy className="text-accent w-8 h-8 md:w-12 md:h-12" /> 
              Top 5 da Semana
            </h2>
            <p className="text-text-muted mt-2 font-medium">Os servidores mais jogados e bem avaliados pela comunidade.</p>
          </div>
          <Link href="/servidores" className="hidden md:flex text-primary font-bold hover:text-white transition-colors items-center gap-1 group">
            Ver todos <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {top5.map((server, idx) => (
            <ServerCard key={server.id} server={server} index={idx} />
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link href="/servidores" className="btn-secondary w-full py-3 rounded-xl inline-block">
            Ver todos os servidores
          </Link>
        </div>
      </section>

      {/* What is RP? */}
      <section className="py-24 bg-surface relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1">
            <h2 className="font-display text-4xl text-white tracking-tight uppercase mb-6">O que é Roleplay?</h2>
            <p className="text-lg text-text-muted leading-relaxed mb-6 font-medium">
              Roleplay é atuar. Você entra no jogo não como você mesmo, mas como um personagem que você cria. Você deve respeitar as regras do mundo (como a física), interagir com outros jogadores como se fosse vida real, e nunca quebrar o personagem.
            </p>
            <p className="text-lg text-text-muted leading-relaxed mb-8 font-medium">
              Seja um policial, um médico, um mecânico, ou um criminoso. Cada servidor tem suas regras (Allowlist), economia e estilo. A única regra universal é: a história vem primeiro.
            </p>
            <Link href="/guia" className="text-secondary font-bold hover:text-white transition-colors flex items-center gap-2 text-lg">
              Ler o guia completo do iniciante <ArrowRight size={20} />
            </Link>
          </div>
          <div className="flex-1 w-full relative">
            <div className="aspect-video bg-[#0B0B14] rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-brand-gradient opacity-10"></div>
              <MonitorPlay size={64} className="text-primary opacity-50" />
            </div>
          </div>
        </div>
      </section>

      {/* Email Capture Highlight */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient opacity-10"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,#0B0B14)]"></div>
        
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 border border-white/20">
            <Clock size={16} className="text-secondary" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">Migração GTA 6</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl text-white tracking-tight uppercase mb-6">
            Seja o primeiro a jogar.
          </h2>
          <p className="text-xl text-text-muted mb-10 font-medium max-w-xl mx-auto">
            Quando os servidores da nova geração abrirem, você recebe o aviso antes de todo mundo.
          </p>
          
          <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input 
              type="email" 
              name="email"
              required
              placeholder="Seu melhor e-mail" 
              className="flex-1 bg-surface border border-white/20 rounded-xl px-6 py-4 text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-lg"
            />
            <button 
              type="submit" 
              disabled={joinWaitlist.isPending}
              className="btn-primary rounded-xl px-8 py-4 text-lg font-bold disabled:opacity-50"
            >
              {joinWaitlist.isPending ? "Entrando..." : "Quero ser avisado"}
            </button>
          </form>
          <p className="mt-4 text-sm text-text-muted font-bold tracking-widest uppercase">
            Junte-se a 28.000+ jogadores na lista
          </p>
        </div>
      </section>
    </Layout>
  );
}
