import { Layout } from "@/components/Layout";
import { BookOpen, Shield, Users, MonitorPlay, AlertTriangle } from "lucide-react";

export default function Guide() {
  return (
    <Layout>
      <div className="bg-[#0B0B14] border-b border-white/5 pt-16 pb-16 relative">
        <div className="absolute inset-0 bg-brand-gradient opacity-[0.03] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <BookOpen className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="font-display text-4xl md:text-6xl text-white uppercase tracking-tight mb-4">
            Guia do Iniciante no RP
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            Tudo o que você precisa saber para começar sua jornada no mundo do Roleplay sem cometer os erros clássicos.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row gap-12">
        {/* TOC Sidebar */}
        <div className="md:w-1/4 hidden md:block shrink-0">
          <div className="sticky top-[100px] leonida-card p-6">
            <h3 className="font-bold text-white uppercase tracking-widest text-xs mb-4">Índice</h3>
            <ul className="space-y-3">
              <li><a href="#o-que-e" className="text-sm font-medium text-primary hover:text-primary transition-colors">1. O que é Roleplay?</a></li>
              <li><a href="#allowlist" className="text-sm font-medium text-text-muted hover:text-white transition-colors">2. Como funciona a Allowlist?</a></li>
              <li><a href="#etiqueta" className="text-sm font-medium text-text-muted hover:text-white transition-colors">3. Etiqueta (As Regras de Ouro)</a></li>
              <li><a href="#escolher" className="text-sm font-medium text-text-muted hover:text-white transition-colors">4. Como escolher o servidor</a></li>
              <li><a href="#fivem" className="text-sm font-medium text-text-muted hover:text-white transition-colors">5. Primeiros passos no FiveM</a></li>
            </ul>
          </div>
        </div>

        {/* Article Content */}
        <div className="md:w-3/4 max-w-3xl">
          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:uppercase prose-p:text-text-muted prose-p:leading-relaxed prose-a:text-secondary">
            
            <section id="o-que-e" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Users size={24} />
                </div>
                <h2 className="text-3xl text-white m-0">1. O que é Roleplay (RP)?</h2>
              </div>
              <p>
                Roleplay significa "interpretação de papéis". Ao entrar em um servidor de RP, você deixa de ser você mesmo. Você cria um personagem (com nome, história, medos, sotaque e objetivos) e vive a vida dele dentro da cidade virtual.
              </p>
              <p>
                Não é sobre ganhar, ficar rico rápido ou atirar em todo mundo (como no GTA Online normal). É sobre criar histórias memoráveis em conjunto. Se o seu personagem leva um tiro, ele sente dor. Se ele é preso, ele sofre as consequências. A imersão é o pilar de tudo.
              </p>
            </section>

            <section id="allowlist" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                  <Shield size={24} />
                </div>
                <h2 className="text-3xl text-white m-0">2. Como funciona a Allowlist?</h2>
              </div>
              <p>
                A Allowlist (ou Whitelist) é a porta de entrada dos servidores mais organizados. É um processo seletivo para garantir que apenas pessoas que entendem e respeitam as regras entrem no jogo.
              </p>
              <div className="bg-surface border border-white/10 p-6 rounded-xl my-6 not-prose">
                <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-sm">O Processo Típico</h4>
                <ol className="space-y-4">
                  <li className="flex gap-4">
                    <span className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">1</span>
                    <p className="text-text-muted text-sm">Entrar no Discord do servidor e vincular contas.</p>
                  </li>
                  <li className="flex gap-4">
                    <span className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">2</span>
                    <p className="text-text-muted text-sm">Ler todas as regras (sim, leia todas, eles farão pegadinhas sobre isso).</p>
                  </li>
                  <li className="flex gap-4">
                    <span className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">3</span>
                    <p className="text-text-muted text-sm">Preencher a ficha do seu personagem: background, objetivos, falhas.</p>
                  </li>
                  <li className="flex gap-4">
                    <span className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">4</span>
                    <p className="text-white font-medium text-sm">A Entrevista (oral ou escrita). Um staff testará seu conhecimento sobre regras vitais como VDM, RDM e Powergaming.</p>
                  </li>
                </ol>
              </div>
            </section>

            <section id="etiqueta" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                  <AlertTriangle size={24} />
                </div>
                <h2 className="text-3xl text-white m-0">3. Etiqueta e Regras de Ouro</h2>
              </div>
              <p>Existem termos que você PRECISA saber antes de pisar em qualquer servidor. Cometer essas infrações geralmente resulta em banimento permanente.</p>
              
              <ul className="not-prose space-y-4 mt-6">
                <li className="bg-[#14141F] p-4 rounded-lg border-l-2 border-primary">
                  <strong className="text-white block mb-1">RDM (Random Deathmatch)</strong>
                  <span className="text-text-muted text-sm">Matar outro jogador sem motivo prévio ou sem gerar RP antes. Você não pode sair atirando do nada.</span>
                </li>
                <li className="bg-[#14141F] p-4 rounded-lg border-l-2 border-primary">
                  <strong className="text-white block mb-1">VDM (Vehicle Deathmatch)</strong>
                  <span className="text-text-muted text-sm">Usar um veículo como arma para atropelar pessoas intencionalmente (exceto em situações raríssimas e muito bem justificadas no RP).</span>
                </li>
                <li className="bg-[#14141F] p-4 rounded-lg border-l-2 border-secondary">
                  <strong className="text-white block mb-1">Metagaming</strong>
                  <span className="text-text-muted text-sm">Usar informações obtidas fora do jogo (como assistir a live de outro jogador) dentro do jogo. Seu personagem só sabe o que ele viveu.</span>
                </li>
                <li className="bg-[#14141F] p-4 rounded-lg border-l-2 border-secondary">
                  <strong className="text-white block mb-1">Powergaming</strong>
                  <span className="text-text-muted text-sm">Fazer coisas irreais que te dão vantagem injusta (ex: capotar o carro 5 vezes, sair correndo como se nada tivesse acontecido e atirar). Roleplay o seu dano!</span>
                </li>
              </ul>
            </section>

            <section id="escolher" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl text-white m-0 mb-6">4. Como escolher seu servidor</h2>
              <p>
                Nem todo servidor é igual. Alguns focam em realismo extremo (onde abastecer o carro e pagar imposto demora horas), outros em ação rápida com regras mais flexíveis. Use nossos filtros na página de <a href="/servidores">Servidores</a> para buscar por "RP Sério", "Descontraído" ou focado em "Economia". Se for sua primeira vez, busque por "Iniciante-friendly".
              </p>
            </section>

            <section id="fivem" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white">
                  <MonitorPlay size={24} />
                </div>
                <h2 className="text-3xl text-white m-0">5. Primeiros passos no FiveM</h2>
              </div>
              <p>
                Para jogar, você precisa de uma cópia original do GTA V instalada no seu PC. Depois, baixe o <strong>FiveM</strong> (cliente modificado gratuito). Instale, abra o FiveM, faça login e conecte-se ao IP do servidor que você foi aprovado. Configure seu microfone (crucial para o RP) nas configurações do FiveM antes de entrar.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
