// STUB gerado automaticamente só para destravar o build.
// Este pacote sumiu do repositório (não estava commitado no GitHub).
// Substitua pelo conteúdo real do seu projeto original assim que possível —
// aqui só recriamos o que já era usado em artifacts/api-server/src/routes/health.ts.
import { z } from "zod";

export const HealthCheckResponse = z.object({
  status: z.literal("ok"),
});
export type HealthCheckResponse = z.infer<typeof HealthCheckResponse>;
