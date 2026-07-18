// STUB gerado automaticamente só para destravar o build.
// Este pacote sumiu do repositório (não estava commitado no GitHub).
// Substitua pelo conteúdo real do seu projeto original assim que possível.
// Os hooks abaixo batem com o uso em Home.tsx / LeonidaWaitlist.tsx e
// chamam os endpoints reais já existentes em artifacts/api-server/src/routes.
import { useMutation, useQuery } from "@tanstack/react-query";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

interface JoinWaitlistInput {
  data: { email: string; name?: string };
}

export function useJoinWaitlist() {
  return useMutation({
    mutationFn: async ({ data }: JoinWaitlistInput) => {
      const res = await fetch(`${API_BASE}/emails/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Falha ao entrar na lista de espera");
      }
      return res.json();
    },
  });
}

interface ServerStats {
  serverCount: number;
  reviewCount: number;
  waitlistCount: number;
}

export function useGetServerStats() {
  return useQuery({
    queryKey: ["server-stats"],
    queryFn: async (): Promise<ServerStats> => {
      const res = await fetch(`${API_BASE}/servers/stats`);
      if (!res.ok) {
        throw new Error("Falha ao buscar estatísticas dos servidores");
      }
      return res.json();
    },
  });
}
