import { Router, type IRouter } from "express";
import { eq, ilike, and, desc, asc, sql, count } from "drizzle-orm";
import { db, serversTable, reviewsTable, emailsTable } from "@workspace/db";

const router: IRouter = Router();

function parseServer(s: typeof serversTable.$inferSelect) {
  return {
    id: s.id,
    name: s.name,
    slug: s.slug,
    description: s.description,
    country: s.country,
    style: s.style,
    allowlist: s.allowlist,
    level: s.level,
    rating: s.rating,
    reviewCount: s.reviewCount,
    rank: s.rank,
    rankChange: s.rankChange,
    trending: s.trending,
    featured: s.featured,
    badges: (() => { try { return JSON.parse(s.badges); } catch { return []; } })(),
    game: s.game,
    officialLink: s.officialLink,
    discordLink: s.discordLink,
    playerCount: s.playerCount,
    weeklyVisits: s.weeklyVisits,
  };
}

router.get("/servers", async (req, res): Promise<void> => {
  const { page = "1", limit = "20", search, style, country, allowlist, level, sort } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, parseInt(limit, 10) || 20);
  const offset = (pageNum - 1) * limitNum;

  const conditions = [];
  if (search) conditions.push(ilike(serversTable.name, `%${search}%`));
  if (style) conditions.push(eq(serversTable.style, style));
  if (country) conditions.push(eq(serversTable.country, country));
  if (allowlist === "true") conditions.push(eq(serversTable.allowlist, true));
  if (allowlist === "false") conditions.push(eq(serversTable.allowlist, false));
  if (level) conditions.push(eq(serversTable.level, level));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  let orderBy;
  if (sort === "rating") orderBy = desc(serversTable.rating);
  else if (sort === "recent") orderBy = desc(serversTable.createdAt);
  else orderBy = asc(serversTable.rank);

  const [servers, totalResult] = await Promise.all([
    db.select().from(serversTable).where(where).orderBy(orderBy).limit(limitNum).offset(offset),
    db.select({ count: count() }).from(serversTable).where(where),
  ]);

  const total = totalResult[0]?.count ?? 0;

  res.json({
    servers: servers.map(parseServer),
    total,
    page: pageNum,
    limit: limitNum,
  });
});

router.get("/servers/top5", async (_req, res): Promise<void> => {
  const servers = await db.select().from(serversTable).orderBy(asc(serversTable.rank)).limit(5);
  res.json(servers.map(parseServer));
});

router.get("/servers/stats", async (_req, res): Promise<void> => {
  const [serverCount, reviewCount, emailCount] = await Promise.all([
    db.select({ count: count() }).from(serversTable),
    db.select({ count: count() }).from(reviewsTable).where(eq(reviewsTable.status, "approved")),
    db.select({ count: count() }).from(emailsTable),
  ]);

  res.json({
    serverCount: serverCount[0]?.count ?? 0,
    reviewCount: reviewCount[0]?.count ?? 0,
    waitlistCount: emailCount[0]?.count ?? 0,
  });
});

router.get("/servers/:slug", async (req, res): Promise<void> => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const [server] = await db.select().from(serversTable).where(eq(serversTable.slug, slug));
  if (!server) {
    res.status(404).json({ error: "Servidor não encontrado" });
    return;
  }

  // Track visit
  await db.update(serversTable).set({ visits: (server.visits ?? 0) + 1 }).where(eq(serversTable.id, server.id));

  res.json({
    ...parseServer(server),
    howToEnter: server.howToEnter,
    requirements: server.requirements,
    stats: {
      visits: (server.visits ?? 0) + 1,
      clicks: server.clicksHowToEnter ?? 0,
    },
  });
});

router.post("/servers", async (req, res): Promise<void> => {
  const { name, slug, description, country, style, allowlist, level, badges, game, officialLink, discordLink, featured } = req.body;
  if (!name || !slug || !country || !style) {
    res.status(400).json({ error: "Campos obrigatórios ausentes" });
    return;
  }

  const [server] = await db.insert(serversTable).values({
    name,
    slug,
    description,
    country,
    style,
    allowlist: Boolean(allowlist),
    level: level || "all",
    badges: JSON.stringify(badges || []),
    game: game || "gtav",
    officialLink,
    discordLink,
    featured: Boolean(featured),
    rank: 99,
  }).returning();

  res.status(201).json(parseServer(server));
});

router.put("/servers/:slug", async (req, res): Promise<void> => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const { name, description, country, style, allowlist, level, badges, game, officialLink, discordLink, featured } = req.body;

  const [server] = await db.update(serversTable).set({
    name,
    description,
    country,
    style,
    allowlist: Boolean(allowlist),
    level,
    badges: JSON.stringify(badges || []),
    game,
    officialLink,
    discordLink,
    featured: Boolean(featured),
    updatedAt: new Date(),
  }).where(eq(serversTable.slug, slug)).returning();

  if (!server) {
    res.status(404).json({ error: "Servidor não encontrado" });
    return;
  }

  res.json(parseServer(server));
});

router.delete("/servers/:slug", async (req, res): Promise<void> => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const [deleted] = await db.delete(serversTable).where(eq(serversTable.slug, slug)).returning();
  if (!deleted) {
    res.status(404).json({ error: "Servidor não encontrado" });
    return;
  }
  res.sendStatus(204);
});

export default router;
