import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Clock, ShieldAlert, MonitorPlay, ArrowRight, Users } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSiteSettings } from "@/hooks/useAdminData";
import { useToast } from "@/hooks/use-toast";

export default function LeonidaWaitlist() {
  const settings = useSiteSettings();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const targetDateString = settings?.waitlistTargetDate || "2026-11-19T00:00:00";
  const parsedTarget = new Date(targetDateString).getTime();
  const targetDate = isNaN(parsedTarget) ? new Date("2026-11-19T00:00:00").getTime() : parsedTarget;

  function calcTL() {
    const diff = targetDate - new Date().getTime();
    if (diff <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0 };
    return {
      dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
      horas: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutos: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      segundos: Math.floor((diff % (1000 * 60)) / 1000)
    };
  }

  const [timeLeft, setTimeLeft] = useState(() => calcTL());

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(calcTL()), 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;

    if (!email) return;

    setIsSaving(true);
    try {
      await addDoc(collection(db, "waitlist"), {
        email,
        name,
        createdAt: serverTimestamp(),
      });
      toast({
        title: "Você está na lista oficial!",
        description: "Te avisaremos assim que os primeiros servidores anunciarem vagas.",
      });
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      toast({
        title: "Erro ao entrar na lista",
        description: "Tente novamente em instantes.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className="bg-[#0B0B14] min-h-screen relative overflow-hidden">
        {/* Dramatic Hero */}
        <div className="absolute inset-0 bg-brand-gradient opacity-10 pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/20 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 pt-32 pb-24 relative z-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-[#14141F] border border-primary/30 px-6 py-2 rounded-full mb-8 shadow-[0_0_20px_rgba(255,46,136,0.3)]">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-primary font-bold tracking-widest uppercase text-sm">Lançamento Oficial: 19 de Novembro de 2026</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white uppercase tracking-tighter leading-[0.9] mb-6">
              A Nova Geração <br /> do <span className="text-transparent bg-clip-text bg-brand-gradient">Roleplay</span> Chegou.
            </h1>
            <p className="text-xl text-text-muted font-medium max-w-2xl mx-auto">
              Gráficos fotorrealistas, física reformulada, e um estado inteiro para dominar. Os servidores de comunidade do GTA 6 vão redefinir o que significa jogar RP.
            </p>
          </motion.div>

          {/* Huge Countdown */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-20 w-full">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="flex flex-col items-center w-24 md:w-32">
                <div className="w-full aspect-square bg-[#14141F] border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 border-b border-white/5"></div>
                  <span className="font-display text-4xl md:text-6xl text-white relative z-10">{value.toString().padStart(2, "0")}</span>
                </div>
                <span className="mt-4 text-sm font-bold uppercase tracking-widest text-text-muted">{unit}</span>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="w-full max-w-xl mx-auto bg-[#14141F] border border-white/10 p-8 rounded-3xl shadow-2xl relative">
            <div className="absolute -top-4 -right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full rotate-12 shadow-lg">
              ACESSO ANTECIPADO
            </div>
            <h3 className="font-display text-2xl text-white uppercase mb-2">Lista de Espera BizerraHUB</h3>
            <p className="text-text-muted mb-6 text-sm">Garanta seu lugar. Os servidores iniciais terão vagas limitadíssimas e filas gigantescas. Quem está na lista entra primeiro.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                placeholder="Seu nome ou Nickname"
                required
                className="w-full bg-[#0B0B14] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary"
              />
              <input
                type="email"
                name="email"
                placeholder="Seu e-mail de contato"
                required
                className="w-full bg-[#0B0B14] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary w-full rounded-xl py-4 text-lg font-bold mt-2"
              >
                {isSaving ? "Processando..." : "Entrar na Lista de Espera"}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-text-muted text-sm font-bold">
              <Users size={16} className="text-secondary" />
              <span>{settings?.waitlistCountBase ?? "28.492"} jogadores já garantiram lugar</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 py-24 relative z-10 border-t border-white/5 mt-12">
          <h2 className="text-center font-display text-3xl md:text-5xl text-white uppercase mb-16">
            O que muda na nova geração?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#14141F] border border-white/10 p-8 rounded-2xl">
              <Zap className="w-12 h-12 text-primary mb-6" />
              <h3 className="font-display text-xl text-white uppercase mb-3">Motor Gráfico RAGE 9</h3>
              <p className="text-text-muted leading-relaxed">Simulação física absurdamente realista. Acidentes de carro, clima dinâmico e balística que vão forçar um RP muito mais cadenciado e sério.</p>
            </div>

            <div className="bg-[#14141F] border border-white/10 p-8 rounded-2xl">
              <MonitorPlay className="w-12 h-12 text-secondary mb-6" />
              <h3 className="font-display text-xl text-white uppercase mb-3">Economia Integrada</h3>
              <p className="text-text-muted leading-relaxed">Sistemas nativos muito mais robustos, permitindo que servidores foquem em criar histórias complexas em vez de programar inventários do zero.</p>
            </div>

            <div className="bg-[#14141F] border border-white/10 p-8 rounded-2xl">
              <ShieldAlert className="w-12 h-12 text-accent mb-6" />
              <h3 className="font-display text-xl text-white uppercase mb-3">Novos Padrões de Whitelist</h3>
              <p className="text-text-muted leading-relaxed">Com o hype do lançamento, as allowlists serão brutais. Servidores vão exigir histórico limpo e fichas extensas. Estar preparado será obrigatório.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
