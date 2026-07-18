import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ServerDoc, createServer, updateServer } from "@/hooks/useServers";
import { useToast } from "@/hooks/use-toast";

interface Props {
    open: boolean;
    onClose: () => void;
    editingServer: ServerDoc | null;
    nextRank: number;
}

const EMPTY = {
    rank: 1, rankChange: 0, trending: false, featured: false,
    name: "", slug: "", country: "BR", style: "", allowlist: true,
    level: "all", rating: 5, reviewCount: 0, description: "",
    badges: "", game: "gtav", officialLink: "", howToEnter: "",
};

export default function ServerFormModal({ open, onClose, editingServer, nextRank }: Props) {
    const [form, setForm] = useState<any>(EMPTY);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (editingServer) {
            setForm({ ...editingServer, badges: editingServer.badges.join(", ") });
        } else {
            setForm({ ...EMPTY, rank: nextRank });
        }
    }, [editingServer, open, nextRank]);

    const handleChange = (field: string, value: any) => setForm((f: any) => ({ ...f, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const slug =
                form.slug ||
                form.name.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

            const payload = {
                ...form,
                slug,
                rank: Number(form.rank),
                rankChange: Number(form.rankChange),
                rating: Number(form.rating),
                reviewCount: Number(form.reviewCount),
                badges: typeof form.badges === "string"
                    ? form.badges.split(",").map((b: string) => b.trim()).filter(Boolean)
                    : form.badges,
            };
            delete payload.id;

            if (editingServer) {
                await updateServer(editingServer.id, payload);
                toast({ title: "Servidor atualizado!" });
            } else {
                await createServer(payload);
                toast({ title: "Servidor adicionado!" });
            }
            onClose();
        } catch (err: any) {
            toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="bg-[#14141F] border-white/10 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingServer ? "Editar Servidor" : "Adicionar Servidor"}</DialogTitle>
                    <DialogDescription className="text-text-muted">Preencha os dados do servidor no diretório.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold uppercase text-text-muted mb-1 block">Nome</label>
                            <input required value={form.name} onChange={(e) => handleChange("name", e.target.value)}
                                className="w-full bg-[#0B0B14] border border-white/10 rounded-lg px-3 py-2" />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-text-muted mb-1 block">Slug (opcional)</label>
                            <input value={form.slug} onChange={(e) => handleChange("slug", e.target.value)}
                                placeholder="gerado automaticamente"
                                className="w-full bg-[#0B0B14] border border-white/10 rounded-lg px-3 py-2" />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-text-muted mb-1 block">Rank</label>
                            <input type="number" required value={form.rank} onChange={(e) => handleChange("rank", e.target.value)}
                                className="w-full bg-[#0B0B14] border border-white/10 rounded-lg px-3 py-2" />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-text-muted mb-1 block">Variação de Rank</label>
                            <input type="number" value={form.rankChange} onChange={(e) => handleChange("rankChange", e.target.value)}
                                className="w-full bg-[#0B0B14] border border-white/10 rounded-lg px-3 py-2" />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-text-muted mb-1 block">País</label>
                            <input required value={form.country} onChange={(e) => handleChange("country", e.target.value)}
                                className="w-full bg-[#0B0B14] border border-white/10 rounded-lg px-3 py-2" />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-text-muted mb-1 block">Estilo</label>
                            <input required value={form.style} onChange={(e) => handleChange("style", e.target.value)}
                                className="w-full bg-[#0B0B14] border border-white/10 rounded-lg px-3 py-2" />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-text-muted mb-1 block">Nível</label>
                            <select value={form.level} onChange={(e) => handleChange("level", e.target.value)}
                                className="w-full bg-[#0B0B14] border border-white/10 rounded-lg px-3 py-2">
                                <option value="beginner">Iniciante</option>
                                <option value="veteran">Veterano</option>
                                <option value="all">Todos</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-text-muted mb-1 block">Jogo</label>
                            <select value={form.game} onChange={(e) => handleChange("game", e.target.value)}
                                className="w-full bg-[#0B0B14] border border-white/10 rounded-lg px-3 py-2">
                                <option value="gtav">GTA V / FiveM</option>
                                <option value="gta6">GTA 6</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-text-muted mb-1 block">Nota (0-5)</label>
                            <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => handleChange("rating", e.target.value)}
                                className="w-full bg-[#0B0B14] border border-white/10 rounded-lg px-3 py-2" />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-text-muted mb-1 block">Qtd. Avaliações</label>
                            <input type="number" value={form.reviewCount} onChange={(e) => handleChange("reviewCount", e.target.value)}
                                className="w-full bg-[#0B0B14] border border-white/10 rounded-lg px-3 py-2" />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={form.allowlist} onChange={(e) => handleChange("allowlist", e.target.checked)} />
                            Requer Allowlist
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={form.trending} onChange={(e) => handleChange("trending", e.target.checked)} />
                            Em alta
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={form.featured} onChange={(e) => handleChange("featured", e.target.checked)} />
                            Destaque
                        </label>
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase text-text-muted mb-1 block">Link oficial (Discord/site)</label>
                        <input required value={form.officialLink} onChange={(e) => handleChange("officialLink", e.target.value)}
                            className="w-full bg-[#0B0B14] border border-white/10 rounded-lg px-3 py-2" />
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase text-text-muted mb-1 block">Badges (separe por vírgula)</label>
                        <input value={form.badges} onChange={(e) => handleChange("badges", e.target.value)}
                            placeholder="Comunidade BR, Whitelist rápida"
                            className="w-full bg-[#0B0B14] border border-white/10 rounded-lg px-3 py-2" />
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase text-text-muted mb-1 block">Descrição</label>
                        <textarea required rows={3} value={form.description} onChange={(e) => handleChange("description", e.target.value)}
                            className="w-full bg-[#0B0B14] border border-white/10 rounded-lg px-3 py-2" />
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase text-text-muted mb-1 block">Como entrar (passo a passo)</label>
                        <textarea required rows={4} value={form.howToEnter} onChange={(e) => handleChange("howToEnter", e.target.value)}
                            className="w-full bg-[#0B0B14] border border-white/10 rounded-lg px-3 py-2" />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10">
                            Cancelar
                        </button>
                        <button type="submit" disabled={saving} className="btn-primary px-6 py-3 rounded-xl font-bold disabled:opacity-50">
                            {saving ? "Salvando..." : "Salvar Servidor"}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
