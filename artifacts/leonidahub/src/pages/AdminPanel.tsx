import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { LayoutDashboard, Server, MessageSquare, Users, Settings, LogOut, Mail } from "lucide-react";
import { SEED_SERVERS } from "@/data/seed";

export default function AdminPanel() {
  const { currentUser, effectiveRole, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("servidores");

  useEffect(() => {
    // If not logged in at all, redirect
    if (!currentUser) {
      setLocation("/admin/login");
    }
  }, [currentUser, setLocation]);

  if (!currentUser) return null;
  
  // Show restricted view if they try to access admin but aren't
  if (effectiveRole !== "admin") {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="bg-[#14141F] border border-white/10 rounded-3xl p-12 shadow-2xl">
            <h1 className="font-display text-4xl text-white uppercase mb-4">Painel do Usuário</h1>
            <p className="text-text-muted mb-8 text-lg">Olá, {currentUser.name}. Você está logado como <strong className="text-primary uppercase tracking-widest">{effectiveRole}</strong>.</p>
            <p className="text-text-muted mb-8">Esta área administrativa completa é restrita. Ferramentas para o seu plano estão sendo desenvolvidas na V2.</p>
            <button onClick={() => { logout(); setLocation("/"); }} className="btn-secondary px-8 py-3 rounded-xl font-bold">
              Sair da Conta
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: "servidores", label: "Servidores", icon: Server },
    { id: "avaliacoes", label: "Avaliações", icon: MessageSquare },
    { id: "emails", label: "E-mails Capturados", icon: Mail },
    { id: "assinantes", label: "Assinantes", icon: Users },
    { id: "config", label: "Configurações", icon: Settings },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 bg-[#14141F] rounded-2xl border border-white/10 overflow-hidden sticky top-[100px]">
          <div className="p-6 border-b border-white/5 bg-[#0B0B14]">
            <h2 className="font-display text-xl text-white uppercase">Admin</h2>
            <p className="text-xs text-primary font-bold tracking-widest mt-1">SISTEMA BIZERRA</p>
          </div>
          
          <nav className="p-4 flex flex-col gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  activeTab === tab.id 
                    ? "bg-white/10 text-white" 
                    : "text-text-muted hover:bg-white/5 hover:text-white"
                }`}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
            
            <div className="h-px bg-white/5 my-2"></div>
            
            <button
              onClick={() => { logout(); setLocation("/"); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={18} /> Sair
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full bg-[#14141F] rounded-2xl border border-white/10 p-6 md:p-8 min-h-[600px]">
          
          {activeTab === "servidores" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-2xl text-white uppercase">Gerenciar Servidores</h2>
                <button className="btn-primary px-4 py-2 rounded-lg text-sm">
                  + Adicionar Servidor
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#0B0B14] text-xs uppercase tracking-widest text-text-muted">
                    <tr>
                      <th className="p-4 rounded-tl-xl font-bold">Rank</th>
                      <th className="p-4 font-bold">Nome</th>
                      <th className="p-4 font-bold">Estilo</th>
                      <th className="p-4 font-bold">País</th>
                      <th className="p-4 rounded-tr-xl font-bold text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {SEED_SERVERS.map(server => (
                      <tr key={server.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 text-primary font-display">#{server.rank}</td>
                        <td className="p-4 text-white font-bold">{server.name}</td>
                        <td className="p-4 text-text-muted text-sm">{server.style}</td>
                        <td className="p-4 text-text-muted text-sm">{server.country}</td>
                        <td className="p-4 text-right">
                          <button className="text-secondary text-sm font-bold mr-3 hover:underline">Editar</button>
                          <button className="text-red-500 text-sm font-bold hover:underline">Ocultar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "avaliacoes" && (
            <div>
              <h2 className="font-display text-2xl text-white uppercase mb-8">Moderação de Avaliações</h2>
              <div className="text-center py-12 border border-dashed border-white/20 rounded-xl">
                <MessageSquare className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-50" />
                <p className="text-text-muted">Nenhuma avaliação pendente de moderação no momento.</p>
              </div>
            </div>
          )}

          {activeTab === "emails" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-2xl text-white uppercase">Lista de Espera</h2>
                <button className="btn-secondary px-4 py-2 rounded-lg text-sm">
                  Exportar CSV
                </button>
              </div>
              <div className="text-center py-12 border border-dashed border-white/20 rounded-xl">
                <p className="text-text-muted">Dados mockados via localStorage para esta demonstração.</p>
              </div>
            </div>
          )}
          
          {(activeTab === "assinantes" || activeTab === "config") && (
            <div>
              <h2 className="font-display text-2xl text-white uppercase mb-8">Página em Construção</h2>
              <p className="text-text-muted">Estes recursos estarão disponíveis assim que a integração com o banco de dados for concluída na V2.</p>
            </div>
          )}
          
        </div>
      </div>
    </Layout>
  );
}
