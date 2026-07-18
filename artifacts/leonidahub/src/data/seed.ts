import { UserRole, UserPlan, ServerGame, ServerLevel } from "@workspace/api-client-react";

export const SEED_SERVERS = [
  {
    id: 1, rank: 1, rankChange: 2, trending: true, featured: true,
    name: "Cidade Alta", slug: "cidade-alta", country: "BR",
    style: "RP Sério", allowlist: true, level: ServerLevel.veteran,
    rating: 4.8, reviewCount: 2341,
    description: "O maior servidor de roleplay do Brasil. Com anos de história, o Cidade Alta é referência nacional, reconhecido por seus tutoriais internos completos e comunidade engajada. Aqui, cada personagem tem uma história que vale a pena contar.",
    badges: ["Comunidade BR", "Whitelist rápida", "Iniciante-friendly"],
    game: ServerGame.gtav, officialLink: "https://discord.gg/cidadealta",
    howToEnter: "1. Entre no Discord oficial\n2. Leia as regras no canal #regras\n3. Abra um ticket para whitelist\n4. Aguarde a entrevista (geralmente 24-48h)\n5. Após aprovação, instale o FiveM e conecte"
  },
  {
    id: 2, rank: 2, rankChange: -1, trending: false, featured: false,
    name: "Complexo", slug: "complexo", country: "BR",
    style: "Descontraído", allowlist: true, level: ServerLevel.all,
    rating: 4.6, reviewCount: 1876,
    description: "Principal rival do Cidade Alta, o Complexo se destaca por seus eventos regulares e atmosfera mais descontraída. Perfeito para quem quer RP de qualidade sem tanta rigidez, com uma comunidade sempre animada.",
    badges: ["Comunidade BR", "Economia hardcore"],
    game: ServerGame.gtav, officialLink: "https://discord.gg/complexo",
    howToEnter: "1. Acesse o Discord do Complexo\n2. Verifique seu e-mail no servidor\n3. Siga as instruções do canal #como-entrar\n4. Envie sua ficha de personagem\n5. Conecte via FiveM após aprovação"
  },
  {
    id: 3, rank: 3, rankChange: 1, trending: true, featured: false,
    name: "Bahamas City", slug: "bahamas-city", country: "BR",
    style: "RP Sério", allowlist: true, level: ServerLevel.veteran,
    rating: 4.5, reviewCount: 987,
    description: "Para quem curte histórias longas e narrativas imersivas. O Bahamas City é reconhecido pela organização impecável e pelo RP narrativo de alto nível — aqui seu personagem pode evoluir ao longo de semanas de história.",
    badges: ["Comunidade BR"],
    game: ServerGame.gtav, officialLink: "https://discord.gg/bahamascity",
    howToEnter: "1. Entre no Discord e leia o #guia-de-entrada\n2. Crie sua ficha de personagem detalhada\n3. Envie para avaliação\n4. Aguarde feedback da staff\n5. Acesse o servidor após aprovação"
  },
  {
    id: 4, rank: 4, rankChange: 0, trending: false, featured: false,
    name: "FiveCity", slug: "fivecity", country: "BR",
    style: "Equilíbrio", allowlist: true, level: ServerLevel.all,
    rating: 4.4, reviewCount: 1243,
    description: "O equilíbrio perfeito entre realismo e diversão. FiveCity é famoso pela qualidade de voz otimizada para imersão e pelos eventos semanais que mantêm a comunidade sempre ativa e engajada.",
    badges: ["Iniciante-friendly", "Comunidade BR"],
    game: ServerGame.gtav, officialLink: "https://discord.gg/fivecity",
    howToEnter: "1. Acesse o Discord do FiveCity\n2. Leia o canal #boas-vindas\n3. Complete o formulário de whitelist\n4. Faça a entrevista com um staff\n5. Baixe o FiveM e conecte"
  },
  {
    id: 5, rank: 5, rankChange: 3, trending: true, featured: false,
    name: "NoPixel", slug: "nopixel", country: "EUA",
    style: "RP Sério", allowlist: true, level: ServerLevel.veteran,
    rating: 4.9, reviewCount: 8743,
    description: "O servidor de roleplay mais famoso do mundo, lar de grandes streamers internacionais. O NoPixel define o padrão mundial de RP — entrar aqui é o objetivo de muitos jogadores, mas o processo seletivo é um dos mais rigorosos.",
    badges: ["Whitelist rápida"],
    game: ServerGame.gtav, officialLink: "https://nopixel.net",
    howToEnter: "1. Acesse nopixel.net e crie uma conta\n2. Preencha a aplicação detalhada em inglês\n3. Aguarde o processo seletivo (pode levar semanas)\n4. Se aprovado, conecte via FiveM\n5. Leia todas as regras antes de entrar"
  },
  {
    id: 6, rank: 6, rankChange: -2, trending: false, featured: false,
    name: "Eclipse RP", slug: "eclipse-rp", country: "Internacional",
    style: "Economia e Facções", allowlist: true, level: ServerLevel.veteran,
    rating: 4.3, reviewCount: 3412,
    description: "Um dos maiores servidores internacionais, o Eclipse RP é especialista em economia complexa e sistema de facções. Ideal para veteranos que buscam um ambiente competitivo com regras bem estabelecidas.",
    badges: ["Economia hardcore"],
    game: ServerGame.gtav, officialLink: "https://discord.gg/eclipserp",
    howToEnter: "1. Visite eclipserp.com\n2. Registre-se com seu nome de usuário\n3. Leia o rulebook completo\n4. Faça o quiz de regras\n5. Conecte ao servidor"
  },
  {
    id: 7, rank: 7, rankChange: 1, trending: false, featured: false,
    name: "GrandRP", slug: "grandrp", country: "Internacional",
    style: "Free-to-join", allowlist: false, level: ServerLevel.beginner,
    rating: 4.0, reviewCount: 5621,
    description: "A porta de entrada para o mundo do roleplay. O GrandRP não exige whitelist, tornando-se a escolha perfeita para iniciantes que ainda estão aprendendo as regras do RP. Comunidade massiva e sempre acolhedora.",
    badges: ["Iniciante-friendly"],
    game: ServerGame.gtav, officialLink: "https://discord.gg/grandrp",
    howToEnter: "1. Baixe o FiveM (fivem.net)\n2. Procure GrandRP na lista de servidores\n3. Conecte diretamente — sem whitelist!\n4. Leia o tutorial in-game\n5. Crie seu personagem e comece a jogar"
  }
];

export const MOCK_USERS = [
  { id: 1, email: "wesleybizerra1@gmail.com", name: "Admin Wesley", role: UserRole.admin, plan: UserPlan.fundador },
  { id: 2, email: "cidadao_test@bizerrahub.com", name: "Cidadão Teste", role: UserRole.cidadao, plan: UserPlan.cidadao },
  { id: 3, email: "vip_test@bizerrahub.com", name: "VIP Teste", role: UserRole.vip, plan: UserPlan.vip },
  { id: 4, email: "fundador_test@bizerrahub.com", name: "Fundador Teste", role: UserRole.fundador, plan: UserPlan.fundador },
];
