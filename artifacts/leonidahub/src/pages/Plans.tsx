import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Check, Star, Mail, Ticket, Copy } from "lucide-react";
import { Link } from "wouter";
import { useGamification } from "@/contexts/GamificationContext";

const WHATSAPP_SUBSCRIBE_LINK =
  "https://api.whatsapp.com/send/?phone=71981574664&text&type=phone_number&app_absent=0";

export default function Plans() {
  const { registerPlanView, registerPurchaseClick, discountCode, discountPercent, level, points } = useGamification();

  useEffect(() => {
    registerPlanView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const plans = [
    {
      id: "cidadao",
      name: "Cidadão",
      price: "10,00",
      description: "Para jogadores que querem explorar e participar ativamente.",
      popular: false,
      color: "border-white/10",
      features: [
        "Lista completa de servidores liberada",
        "Busca e filtros avançados",
        "Avaliar e comentar em servidores",
        "Favoritar servidores",
        "Alerta por e-mail de vagas",
        "Badge 'Cidadão' no perfil"
      ]
    },
    {
      id: "vip",
      name: "VIP",
      price: "20,00",
      description: "Acesso premium para quem leva o RP a sério.",
      popular: true,
      color: "border-primary shadow-[0_0_30px_rgba(255,46,136,0.2)]",
      features: [
        "Tudo do plano Cidadão",
        "Guias premium passo a passo de allowlist",
        "Alertas prioritários de GTA 6",
        "Comunidade exclusiva no Discord",
        "Perfil destacado nas avaliações",
        "Badge 'VIP' exclusiva"
      ]
    },
    {
      id: "fundador",
      name: "Fundador",
      price: "30,00",
      description: "Para donos de servidores e patrocinadores do hub.",
      popular: false,
      color: "border-white/10",
      features: [
        "Tudo do plano VIP",
        "Servidor em destaque no topo do diretório",
        "Página de estatísticas do seu servidor",
        "Selo permanente 'Fundador'",
        "Canal direto de sugestões de features",
        "Acesso antecipado a novas ferramentas"
      ]
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-6xl text-white uppercase tracking-tight mb-4">
            Suba de Nível
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            Desbloqueie todo o potencial do diretório, garanta vantagens para aprovações de allowlist e destaque seu perfil na comunidade.
          </p>

          <p className="mt-4 text-xs text-text-muted uppercase tracking-widest">
            Você está no nível {level} · {points} pontos acumulados
          </p>

          {discountCode && (
            <div className="mt-6 inline-flex items-center gap-3 bg-[#14141F] border border-primary/40 rounded-2xl px-5 py-3">
              <Ticket size={18} className="text-primary" />
              <span className="text-sm text-white">
                Cupom de fidelidade: <span className="font-display text-primary tracking-widest">{discountCode}</span>{" "}
                <span className="text-text-muted">({discountPercent}% OFF, informe ao assinar)</span>
              </span>
              <button
                onClick={() => navigator.clipboard?.writeText(discountCode)}
                className="text-text-muted hover:text-white"
                title="Copiar cupom"
              >
                <Copy size={16} />
              </button>
            </div>
          )}
          
          <div className="mt-8 inline-flex bg-[#14141F] border border-white/10 rounded-full p-1">
            <button className="px-6 py-2 rounded-full bg-white/10 text-white font-bold text-sm">Mensal</button>
            <button className="px-6 py-2 rounded-full text-text-muted font-bold text-sm flex items-center gap-2 cursor-not-allowed opacity-50">
              Anual <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-[10px] uppercase">Em breve</span>
            </button>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
          {plans.map((plan) => {
            const ctaClass = plan.popular
              ? "w-full py-4 rounded-xl font-bold mb-8 transition-colors text-center block btn-primary text-lg"
              : "w-full py-4 rounded-xl font-bold mb-8 transition-colors text-center block bg-white/5 text-white hover:bg-white/10 border border-white/10";

            return (
              <div 
                key={plan.id} 
                className={`bg-[#14141F] border rounded-3xl p-8 flex flex-col relative transition-transform hover:-translate-y-2 ${plan.color}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-gradient text-[#0B0B14] font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full">
                    Mais Popular
                  </div>
                )}
                
                <h3 className="font-display text-2xl text-white mb-2">{plan.name}</h3>
                <p className="text-text-muted text-sm mb-6 h-10">{plan.description}</p>
                
                <div className="flex items-end gap-1 mb-8">
                  <span className="text-white font-display text-4xl">R$ {plan.price}</span>
                  <span className="text-text-muted font-bold mb-1">/mês</span>
                </div>
                
                
                  href={WHATSAPP_SUBSCRIBE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => registerPurchaseClick(plan.name)}
                  className={ctaClass}
                >
                  Assinar {plan.name}
                </a>
                
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">O que inclui:</h4>
                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-secondary shrink-0" />
                        <span className="text-sm text-text-muted">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Footer */}
        <div className="bg-[#14141F] border border-white/10 rounded-3xl p-12 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-gradient opacity-5"></div>
          <Mail className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <h2 className="font-display text-3xl text-white uppercase mb-4 relative z-10">Não decide agora?</h2>
          <p className="text-text-muted mb-8 relative z-10">Sem problemas. Entre na nossa lista de espera gratuitamente e seja avisado sobre os servidores de GTA 6.</p>
          <Link href="/leonida" className="btn-secondary px-8 py-4 rounded-xl font-bold inline-block relative z-10">
            Entrar na Lista de Espera Grátis
          </Link>
        </div>
      </div>
    </Layout>
  );
}
