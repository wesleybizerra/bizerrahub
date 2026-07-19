import { useEffect, useMemo, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { Radio, Clock, ExternalLink } from "lucide-react";

type Category = "Todos" | "GTA 6" | "GTA 5" | "Rockstar";

interface NewsItem {
  id: string;
  category: Exclude<Category, "Todos">;
  title: string;
  summary: string;
  source: string;
}

// Pool de notícias reais (com base em fatos públicos e declarações oficiais da Rockstar/Take-Two,
// reescritas com nossas próprias palavras). Este pool alimenta o feed "ao vivo" da página.
const NEWS_POOL: NewsItem[] = [
  {
    id: "gta6-data-final",
    category: "GTA 6",
    title: "Lançamento de GTA 6 segue confirmado para 19 de novembro de 2026",
    summary:
      "A Rockstar Games mantém a data de lançamento em PS5 e Xbox Series X/S após o adiamento anunciado em relação à janela original de maio de 2026.",
    source: "Rockstar Games / Take-Two",
  },
  {
    id: "gta6-protagonistas",
    category: "GTA 6",
    title: "Lucia Caminos e Jason Duval são os protagonistas confirmados",
    summary:
      "A dupla vive a trama em Leonida, uma releitura moderna de Vice City, no maior mapa já construído pela Rockstar.",
    source: "Rockstar Games",
  },
  {
    id: "gta6-preorder",
    category: "GTA 6",
    title: "Pré-vendas de GTA 6 já estão abertas desde 25 de junho",
    summary:
      "A abertura das pré-vendas veio junto da revelação da capa oficial do jogo, mas sem confirmação imediata de versão para PC.",
    source: "Take-Two Interactive",
  },
  {
    id: "gta6-pc",
    category: "GTA 6",
    title: "Versão para PC não tem data e deve demorar após o lançamento nos consoles",
    summary:
      "Segundo ex-desenvolvedores ouvidos pela imprensa, a Rockstar prioriza PS5 primeiro, seguindo o padrão histórico da franquia.",
    source: "GamesRadar+",
  },
  {
    id: "gta6-zelnick",
    category: "GTA 6",
    title: "Strauss Zelnick reforça confiança na data de novembro em entrevistas recentes",
    summary:
      "O CEO da Take-Two tem repetido a mesma mensagem em teleconferências trimestrais com investidores nos últimos meses.",
    source: "Take-Two Interactive",
  },
  {
    id: "gta6-exclusividade",
    category: "GTA 6",
    title: "Jogo será exclusivo de consoles atuais no lançamento",
    summary:
      "PS4 e Xbox One ficam de fora: GTA 6 chega apenas para PS5 e Xbox Series X/S nesta primeira etapa.",
    source: "Comunicado oficial",
  },
  {
    id: "rockstar-comunicado-atraso",
    category: "Rockstar",
    title: "Rockstar se desculpa pelo novo adiamento e promete jogo 'sem igual'",
    summary:
      "Em nota oficial, o estúdio afirmou que os meses extras de desenvolvimento serão usados para polir a experiência completa.",
    source: "Comunicado Rockstar Games",
  },
  {
    id: "rockstar-trailer",
    category: "Rockstar",
    title: "Comunidade aguarda um possível terceiro trailer do jogo",
    summary:
      "Após dois trailers oficiais divulgados, fãs e veículos especializados especulam sobre uma nova chamada antes do lançamento.",
    source: "Cobertura da imprensa especializada",
  },
  {
    id: "rockstar-resultados",
    category: "Rockstar",
    title: "Teleconferências trimestrais da Take-Two viraram termômetro de novidades",
    summary:
      "Historicamente, é nesses encontros com investidores que a empresa costuma soltar pequenas atualizações sobre o desenvolvimento.",
    source: "Take-Two Interactive",
  },
  {
    id: "gta5-fivem",
    category: "GTA 5",
    title: "Cena de servidores FiveM continua crescendo no Brasil",
    summary:
      "Novos servidores de roleplay brasileiro surgem toda semana, mantendo viva a base de jogadores enquanto GTA 6 não chega.",
    source: "Comunidade BizerraHUB",
  },
  {
    id: "gta5-transicao",
    category: "GTA 5",
    title: "Servidores de GTA V se preparam para a transição gradual rumo a Leonida",
    summary:
      "Donos de servidor já discutem planos de migração de conteúdo e comunidade para quando a nova geração for lançada.",
    source: "Comunidade BizerraHUB",
  },
  {
    id: "gta5-longevidade",
    category: "GTA 5",
    title: "Mais de uma década depois, GTA V segue como base do maior ecossistema RP do mundo",
    summary:
      "O motor de mods e servidores independentes construído sobre o jogo original segue sendo referência mesmo às vésperas do próximo capítulo.",
    source: "Cobertura da imprensa especializada",
  },
];

const CATEGORY_STYLES: Record<Exclude<Category, "Todos">, string> = {
  "GTA 6": "bg-primary/15 text-primary border-primary/30",
  "GTA 5": "bg-secondary/15 text-secondary border-secondary/30",
  Rockstar: "bg-white/10 text-white border-white/20",
};

const REFRESH_SECONDS = 30;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function News() {
  const [feed, setFeed] = useState<NewsItem[]>(() => shuffle(NEWS_POOL));
  const [newestId, setNewestId] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(REFRESH_SECONDS);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [filter, setFilter] = useState<Category>("Todos");
  const poolIndexRef = useRef(0);

  useEffect(() => {
    const tick = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Traz a próxima notícia do pool para o topo do feed, simulando uma atualização ao vivo
          poolIndexRef.current = (poolIndexRef.current + 1) % NEWS_POOL.length;
          const next = NEWS_POOL[poolIndexRef.current];
          setFeed((prevFeed) => [next, ...prevFeed.filter((item) => item.id !== next.id)]);
          setNewestId(next.id);
          setLastUpdated(new Date());
          window.setTimeout(() => setNewestId(null), 5000);
          return REFRESH_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(tick);
  }, []);

  const filteredFeed = useMemo(
    () => (filter === "Todos" ? feed : feed.filter((item) => item.category === filter)),
    [feed, filter],
  );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-24">
        <div className="flex items-center gap-2 mb-4 text-primary">
          <Radio size={18} className="animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest">Feed ao vivo</span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl text-white uppercase tracking-tight mb-4">
          Notícias
        </h1>
        <p className="text-text-muted max-w-2xl mb-8">
          Acompanhe as últimas atualizações sobre a Rockstar Games, GTA 5 e GTA 6. O feed é atualizado
          automaticamente a cada {REFRESH_SECONDS} segundos.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-[#14141F] border border-white/10 rounded-2xl p-4">
          <div className="flex flex-wrap gap-2">
            {(["Todos", "GTA 6", "GTA 5", "Rockstar"] as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border transition-colors ${
                  filter === cat
                    ? "bg-white text-[#0B0B14] border-white"
                    : "bg-transparent text-text-muted border-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Clock size={14} />
            <span>Próxima atualização em {secondsLeft}s</span>
            <span className="hidden sm:inline">
              · Última: {lastUpdated.toLocaleTimeString("pt-BR")}
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-16">
          {filteredFeed.map((item) => (
            <article
              key={item.id}
              className={`bg-[#14141F] border rounded-2xl p-6 transition-all ${
                newestId === item.id ? "border-primary shadow-[0_0_25px_rgba(255,46,136,0.25)]" : "border-white/10"
              }`}
            >
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${CATEGORY_STYLES[item.category]}`}>
                  {item.category}
                </span>
                {newestId === item.id && (
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-brand-gradient text-[#0B0B14]">
                    Novo agora
                  </span>
                )}
              </div>
              <h2 className="font-display text-xl text-white mb-2">{item.title}</h2>
              <p className="text-sm text-text-muted mb-3">{item.summary}</p>
              <span className="text-[11px] text-white/40 flex items-center gap-1">
                <ExternalLink size={12} /> Fonte: {item.source}
              </span>
            </article>
          ))}
        </div>

        <div className="bg-[#14141F] border border-white/10 rounded-2xl p-6 text-xs text-text-muted">
          As notícias acima resumem, com nossas palavras, fatos e declarações públicas da Rockstar Games e
          da Take-Two Interactive. A BizerraHUB não possui vínculo oficial com a Rockstar Games, Take-Two
          Interactive ou Cfx.re (FiveM).
        </div>
      </div>
    </Layout>
  );
}
