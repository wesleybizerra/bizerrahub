import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useLocation } from "wouter";
import { Lock, Mail, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { login, register } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (mode === "register") {
        await register(name, email, password);
        toast({ title: "Cadastro realizado com sucesso!" });
      } else {
        await login(email, password);
        toast({ title: "Login efetuado com sucesso!" });
      }
      setLocation("/admin");
    } catch (err: any) {
      toast({
        title: mode === "register" ? "Erro ao cadastrar" : "Erro ao entrar",
        description: traduzErro(err.code) || err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  function traduzErro(code?: string) {
    switch (code) {
      case "auth/missing-password": return "Digite uma senha.";
      case "auth/weak-password": return "A senha precisa ter no mínimo 6 caracteres.";
      case "auth/email-already-in-use": return "Já existe uma conta com esse e-mail.";
      case "auth/invalid-email": return "E-mail inválido.";
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "E-mail ou senha incorretos.";
      default: return null;
    }
  }

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[400px] bg-primary/20 blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md bg-[#14141F] border border-white/10 p-8 rounded-3xl relative z-10 shadow-2xl">
          <div className="w-16 h-16 bg-[#0B0B14] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
            <Lock className="text-primary w-8 h-8" />
          </div>

          <h1 className="font-display text-3xl text-white text-center uppercase tracking-tight mb-2">
            Acesso Restrito
          </h1>
          <p className="text-text-muted text-center text-sm mb-8">
            Painel de administração e acesso aos planos.
          </p>

          <div className="flex bg-[#0B0B14] border border-white/10 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                mode === "login" ? "bg-primary/20 text-primary" : "text-text-muted hover:text-white"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                mode === "register" ? "bg-primary/20 text-primary" : "text-text-muted hover:text-white"
              }`}
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-widest mb-2 pl-2">Nome</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Seu nome"
                    className="w-full bg-[#0B0B14] border border-white/10 rounded-xl py-4 px-4 text-white focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-widest mb-2 pl-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="w-full bg-[#0B0B14] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-widest mb-2 pl-2">Senha</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-[#0B0B14] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-4 rounded-xl text-lg mt-4 disabled:opacity-50"
            >
              {isLoading ? "Validando..." : mode === "register" ? "Cadastrar" : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
