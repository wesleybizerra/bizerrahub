import { Layout } from "@/components/Layout";
import { Github, Twitter, MessageCircle } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-24">
        <h1 className="font-display text-5xl md:text-7xl text-white uppercase tracking-tight mb-8">
          Sobre o Projeto
        </h1>
        
        <div className="prose prose-invert prose-lg max-w-none text-text-muted">
          <div className="bg-[#14141F] p-8 rounded-2xl border border-white/10 mb-12">
            <h2 className="font-display text-2xl text-white uppercase mb-4 mt-0">Quem Somos</h2>
            <p>
              BizerraHUB nasceu de uma paixão pela cena de roleplay brasileira. Com dezenas de servidores excelentes surgindo todos os dias no FiveM, percebemos que faltava um lugar central onde os jogadores pudessem descobrir, avaliar e discutir suas experiências.
            </p>
            <p>
              Mais do que apenas um diretório de GTA V, este projeto é a preparação para o que vem a seguir. Estamos construindo a infraestrutura comunitária para suportar os servidores não-oficiais de GTA 6 assim que a nova geração for lançada em novembro de 2026.
            </p>
          </div>

          <div className="bg-[#14141F] p-8 rounded-2xl border border-primary/20 mb-12">
            <h2 className="font-display text-2xl text-white uppercase mb-4 mt-0 text-primary">Aviso Legal</h2>
            <p className="font-bold">
              BizerraHUB é estritamente um site de fãs e comunidade.
            </p>
            <p className="text-sm">
              Não possuímos vínculo, afiliação, patrocínio ou aprovação da Rockstar Games, Take-Two Interactive ou da Cfx.re (FiveM). "GTA V", "Grand Theft Auto", e referências a jogos futuros são marcas registradas de seus respectivos donos. Todos os servidores listados aqui são operados por terceiros independentes de nossa plataforma.
            </p>
          </div>

          <h2 className="font-display text-3xl text-white uppercase mb-6">Fale com a gente</h2>
          
          <form className="bg-[#14141F] p-8 rounded-2xl border border-white/10 space-y-6 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-white uppercase tracking-widest mb-2">Nome</label>
                <input type="text" className="w-full bg-[#0B0B14] border border-white/10 rounded-xl p-4 text-white focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-white uppercase tracking-widest mb-2">E-mail</label>
                <input type="email" className="w-full bg-[#0B0B14] border border-white/10 rounded-xl p-4 text-white focus:border-primary focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-white uppercase tracking-widest mb-2">Mensagem</label>
              <textarea className="w-full bg-[#0B0B14] border border-white/10 rounded-xl p-4 text-white focus:border-primary focus:outline-none min-h-[150px]"></textarea>
            </div>
            <button type="button" className="btn-primary px-8 py-3 rounded-xl font-bold">
              Enviar Mensagem
            </button>
          </form>

          <div className="flex gap-4 items-center justify-center pt-8 border-t border-white/10">
            <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-[#0B0B14] transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-[#0B0B14] transition-colors">
              <MessageCircle size={20} />
            </a>
            <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-[#0B0B14] transition-colors">
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
