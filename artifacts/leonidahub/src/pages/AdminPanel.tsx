import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { LayoutDashboard, Server, MessageSquare, Users, Settings, LogOut, Mail, Trash2, Pencil, Flame, Trophy, Gift, Star } from "lucide-react";
import { useServers, deleteServer, ServerDoc } from "@/hooks/useServers";
import {
  useReviews, useWaitlist, useSubscribers, useLeaderboard,
  approveReview, rejectReview, changeUserPlan,
  useSiteSettings, saveSiteSettings,
} from "@/hooks/useAdminData";
import ServerFormModal from "@/components/ServerFormModal";
import { useToast } from "@/hooks/use-toast";

function UserDashboard() {
  const { currentUser, dailyCheckIn, logout } = useAuth();
  const [, setLocation] = useLocation();
  const leaderboard = useLeaderboard();
  const { toast } = useToast();
  if (!currentUser) return null;

  const xpParaProximoNivel = 100 - (currentUser.xp % 100);
  const planLabel = { free: "Visitante", cidadao: "Cidadão", vip: "VIP", fundador: "Fundador" }[currentUser.plan];
  const jaFezCheckinHoje = currentUser.lastCheckIn === new Date().toISOString().slice(0, 10);

  const cupom = currentUser.level >= 10 ? "LVL10-20OFF" : currentUser.level >= 5 ? "LVL5-10OFF" : null;

  const handleCheckIn = async () => {
    const result = await dailyCheckIn();
    if (result) {
      toast({ title: `+${result.xpGanho} XP!`, description: `Sequência de ${result.streak} dia(s). Volte amanhã!` });
    } else {
      toast({ title: "Você já fez check-in hoje", description: "Volte amanhã para continuar sua sequência." });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="bg-[#14141F] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-white uppercase">Olá, {currentUser.name}</h1>
            <p className="text-text-muted mt-1">
              Plano <strong className="text-primary uppercase">{planLabel}</strong> · Nível {currentUser.level}
            </p>
          </div>
          <button onClick={() => { logout(); setLocation("/"); }} className="btn-secondary px-6 py-3 rounded-xl font-bold shrink-0">
            Sair da Conta
          </button>
        </div>

        {/* Barra de XP */}
        <div className="mb-2 flex justify-between text-sm text-text-muted">
          <span>{currentUser.xp} XP</span>
          <span>Faltam {xpParaProximoNivel} XP para o nível {currentUser.level + 1}</span>
        </div>
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-8">
          <div className="h-full bg-brand-gradient" style={{ width: `${100 - xpParaProximoNivel}%` }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0B0B14] border border-white/10 rounded-2xl p-6 flex items-center gap-4">
            <Flame className="text-primary w-8 h-8" />
            <div>
              <p className="text-2xl font-display text-white">{currentUser.streak}</p>
              <p className="text-xs text-text-muted uppercase">Dias seguidos</p>
            </div>
          </div>
          <div className="bg-[#0B0B14] border border-white/10 rounded-2xl p-6 flex items-center gap-4">
            <Trophy className="text-accent w-8 h-8" />
            <div>
              <p className="text-2xl font-display text-white">{currentUser.badges.length}</p>
              <p className="text-xs text-text-muted uppercase">Badges conquistadas</p>
            </div>
          </div>
          <div className="bg-[#0B0B14] border border-white/10 rounded-2xl p-6 flex items-center gap-4">
            <Star className="text-secondary w-8 h-8" />
            <div>
              <p className="text-2xl font-display text-white">{currentUser.level}</p>
              <p className="text-xs text-text-muted uppercase">Nível atual</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleCheckIn}
          disabled={jaFezCheckinHoje}
          className="btn-primary w-full md:w-auto px-8 py-4 rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {jaFezCheckinHoje ? "✓ Check-in de hoje já resgatado" : "Resgatar Check-in Diário (+XP)"}
        </button>

        {cupom && (
          <div className="mt-6 bg-primary/10 border border-primary/30 rounded-2xl p-6 flex items-center gap-4">
            <Gift className="text-primary w-8 h-8 shrink-0" />
            <div>
              <p className="text-white font-bold">Você desbloqueou um cupom de desconto!</p>
              <p className="text-text-muted text-sm">Use o código <strong className="text-primary">{cupom}</strong> ao assinar ou renovar seu plano pelo WhatsApp.</p>
            </div>
          </div>
        )}

        {currentUser.badges.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {currentUser.badges.map((b) => (
              <span key={b} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white font-bold">🏅 {b}</span>
            ))}
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="bg-[#14141F] border border-white/10 rounded-3xl p-8">
        <h2 className="font-display text-2xl text-white uppercase mb-6 flex items-center gap-2">
          <Trophy className="text-accent" /> Ranking de Jogadores
        </h2>
        <div className="space-y-2">
          {leaderboard.map((u, idx) => (
            <div key={u.id} className={`flex items-center justify-between p-4 rounded-xl ${u.id === currentUser.uid ? "bg-primary/10 border border-primary/30" : "bg-white/5"}`}>
              <div className="flex items-center gap-4">
                <span className="font-display text-lg text-text-muted w-6">#{idx + 1}</span>
                <span className="text-white font-bold">{u.name ?? "Jogador"}</span>
              </div>
              <span className="text-primary font-bold">{u.xp} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const { currentUser, effectiveRole, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("servidores");
  const { toast } = useToast();

  const { servers } = useServers();
  const reviews = useReviews();
  const emails = useWaitlist();
  const subscribers = useSubscribers();
  const settings = useSiteSettings();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<ServerDoc | null>(null);

  const [settingsForm, setSettingsForm] = useState({
    whatsappNumber: "",
    waitlistTargetDate: "",
    waitlistCountBase: 0,
  });
  useEffect(() => {
    if (settings) setSettingsForm(settings);
  }, [settings]);

  useEffect(() => {
    if (!currentUser) setLocation("/admin/login");
  }, [currentUser, setLocation]);

  if (!currentUser) return null;

  if (effectiveRole !== "admin") {
    return (
      <Layout>
        <UserDashboard />
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

  const handleAdd = () => { setEditingServer(null); setModalOpen(true); };
  const handleEdit = (s: ServerDoc) => { setEditingServer(s); setModalOpen(true); };
  const handleRemove = async (s: ServerDoc) => {
    if (confirm(`Remover "${s.name}" do diretório?`)) {
      await deleteServer(s.id);
      toast({ title: "Servidor removido" });
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSiteSettings({ ...settingsForm, waitlistCountBase: Number(settingsForm.waitlistCountBase) });
    toast({ title: "Configurações salvas!" });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8 items-start">
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === tab.id ? "bg-white/10 text-white" : "text-text-muted hover:bg-white/5 hover:text-white"
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

        <div className="flex-1 w-full bg-[#14141F] rounded-2xl border border-white/10 p-6 md:p-8 min-h-[600px]">

          {activeTab === "servidores" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-2xl text-white uppercase">Gerenciar Servidores</h2>
                <button onClick={handleAdd} className="btn-primary px-4 py-2 rounded-lg text-sm">
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
                    {servers.map(server => (
                      <tr key={server.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 text-primary font-display">#{server.rank}</td>
                        <td className="p-4 text-white font-bold">{server.name}</td>
                        <td className="p-4 text-text-muted text-sm">{server.style}</td>
                        <td className="p-4 text-text-muted text-sm">{server.country}</td>
                        <td className="p-4 text-right">
                          <button onClick={() => handleEdit(server)} className="text-secondary text-sm font-bold mr-3 hover:underline inline-flex items-center gap-1">
                            <Pencil size={14} /> Editar
                          </button>
                          <button onClick={() => handleRemove(server)} className="text-red-500 text-sm font-bold hover:underline inline-flex items-center gap-1">
                            <Trash2 size={14} /> Remover
                          </button>
                        </td>
                      </tr>
                    ))}
                    {servers.length === 0 && (
                      <tr><td colSpan={5} className="p-8 text-center text-text-muted">Nenhum servidor cadastrado ainda.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "avaliacoes" && (
            <div>
              <h2 className="font-display text-2xl text-white uppercase mb-8">Moderação de Avaliações</h2>
              {reviews.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-white/20 rounded-xl">
                  <MessageSquare className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-50" />
                  <p className="text-text-muted">Nenhuma avaliação pendente de moderação no momento.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r.id} className="bg-[#0B0B14] border border-white/10 rounded-xl p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-white font-bold">{r.userName} → {r.serverName}</p>
                          <p className="text-xs text-text-muted uppercase">{r.status === "approved" ? "Aprovada" : "Pendente"}</p>
                        </div>
                        <span className="text-accent font-bold">{r.rating}★</span>
                      </div>
                      <p className="text-text-muted text-sm mb-4">{r.comment}</p>
                      {r.status !== "approved" && (
                        <div className="flex gap-3">
                          <button onClick={() => approveReview(r.id)} className="btn-primary px-4 py-1.5 rounded-lg text-xs">Aprovar</button>
                          <button onClick={() => rejectReview(r.id)} className="text-red-500 text-xs font-bold hover:underline">Rejeitar</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "emails" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-2xl text-white uppercase">Lista de Espera</h2>
                <button
                  onClick={() => {
                    const csv = "nome,email\n" + emails.map(e => `${e.name},${e.email}`).join("\n");
                    const blob = new Blob([csv], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url; a.download = "lista-de-espera.csv"; a.click();
                  }}
                  className="btn-secondary px-4 py-2 rounded-lg text-sm"
                >
                  Exportar CSV
                </button>
              </div>
              {emails.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-white/20 rounded-xl">
                  <p className="text-text-muted">Nenhum e-mail capturado ainda.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#0B0B14] text-xs uppercase tracking-widest text-text-muted">
                      <tr><th className="p-3">Nome</th><th className="p-3">E-mail</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {emails.map(e => (
                        <tr key={e.id}><td className="p-3 text-white">{e.name}</td><td className="p-3 text-text-muted">{e.email}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "assinantes" && (
            <div>
              <h2 className="font-display text-2xl text-white uppercase mb-8">Assinantes</h2>
              {subscribers.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-white/20 rounded-xl">
                  <p className="text-text-muted">Nenhum assinante ainda. Após confirmar o pagamento via WhatsApp, atualize o plano do usuário aqui.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#0B0B14] text-xs uppercase tracking-widest text-text-muted">
                      <tr><th className="p-3">Nome</th><th className="p-3">E-mail</th><th className="p-3">Plano</th><th className="p-3">Cargo</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {subscribers.map(s => (
                        <tr key={s.id}>
                          <td className="p-3 text-white">{s.name ?? "-"}</td>
                          <td className="p-3 text-text-muted">{s.email}</td>
                          <td className="p-3">
                            <select
                              defaultValue={s.plan}
                              onChange={(e) => changeUserPlan(s.id, e.target.value, e.target.value === "free" ? "visitor" : e.target.value)}
                              className="bg-[#0B0B14] border border-white/10 rounded-lg px-2 py-1 text-sm"
                            >
                              <option value="free">Free</option>
                              <option value="cidadao">Cidadão</option>
                              <option value="vip">VIP</option>
                              <option value="fundador">Fundador</option>
                            </select>
                          </td>
                          <td className="p-3 text-text-muted text-sm">{s.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "config" && (
            <div>
              <h2 className="font-display text-2xl text-white uppercase mb-8">Configurações do Site</h2>
              <form onSubmit={handleSaveSettings} className="space-y-6 max-w-lg">
                <div>
                  <label className="text-xs font-bold uppercase text-text-muted mb-1 block">Número do WhatsApp (com DDI/DDD)</label>
                  <input
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm(f => ({ ...f, whatsappNumber: e.target.value }))}
                    placeholder="5571981574664"
                    className="w-full bg-[#0B0B14] border border-white/10 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-text-muted mb-1 block">Data alvo da contagem regressiva (Leonida/GTA 6)</label>
                  <input
                    type="datetime-local"
                    value={settingsForm.waitlistTargetDate}
                    onChange={(e) => setSettingsForm(f => ({ ...f, waitlistTargetDate: e.target.value }))}
                    className="w-full bg-[#0B0B14] border border-white/10 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-text-muted mb-1 block">Base do contador da lista de espera</label>
                  <input
                    type="number"
                    value={settingsForm.waitlistCountBase}
                    onChange={(e) => setSettingsForm(f => ({ ...f, waitlistCountBase: Number(e.target.value) }))}
                    className="w-full bg-[#0B0B14] border border-white/10 rounded-lg px-3 py-2"
                  />
                </div>
                <button type="submit" className="btn-primary px-6 py-3 rounded-xl font-bold">Salvar Configurações</button>
              </form>
            </div>
          )}

        </div>
      </div>

      <ServerFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editingServer={editingServer}
        nextRank={servers.length + 1}
      />
    </Layout>
  );
}
