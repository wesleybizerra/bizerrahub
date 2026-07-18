// STUB gerado automaticamente só para destravar o build.
// Este pacote sumiu do repositório (não estava commitado no GitHub).
// Substitua pelo conteúdo real do seu projeto original assim que possível.
// Os valores abaixo foram inferidos do uso em artifacts/leonidahub/src
// (AuthContext.tsx, AdminToggle.tsx, seed.ts, LeonidaWaitlist.tsx).

export const UserRole = {
  visitor: "visitor",
  cidadao: "cidadao",
  vip: "vip",
  fundador: "fundador",
  admin: "admin",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserPlan = {
  free: "free",
  cidadao: "cidadao",
  vip: "vip",
  fundador: "fundador",
} as const;
export type UserPlan = (typeof UserPlan)[keyof typeof UserPlan];

export const ServerGame = {
  gtav: "gtav",
  gta6: "gta6",
} as const;
export type ServerGame = (typeof ServerGame)[keyof typeof ServerGame];

export const ServerLevel = {
  beginner: "beginner",
  veteran: "veteran",
  all: "all",
} as const;
export type ServerLevel = (typeof ServerLevel)[keyof typeof ServerLevel];

export interface User {
  id: number;
  email: string;
  name: string | null;
  role: UserRole;
  plan: UserPlan;
}
