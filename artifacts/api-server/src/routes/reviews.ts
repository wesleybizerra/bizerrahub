import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, reviewsTable, serversTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/servers/:slug/reviews", async (req, res): Promise<void> => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const [server] = await db.select().from(serversTable).where(eq(serversTable.slug, slug));
  if (!server) {
    res.status(404).json({ error: "Servidor não encontrado" });
    return;
  }

  const reviews = await db.select().from(reviewsTable)
    .where(eq(reviewsTable.serverId, server.id));

  res.json(reviews.map(r => ({
    id: r.id,
    serverId: r.serverId,
    authorName: r.authorName,
    authorEmail: r.authorEmail,
    rating: r.rating,
    comment: r.comment,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
  })));
});

router.post("/servers/:slug/reviews", async (req, res): Promise<void> => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const { authorName, authorEmail, rating, comment } = req.body;

  if (!authorName || !authorEmail || !rating || !comment) {
    res.status(400).json({ error: "Todos os campos são obrigatórios" });
    return;
  }

  if (rating < 1 || rating > 5) {
    res.status(400).json({ error: "Avaliação deve ser entre 1 e 5" });
    return;
  }

  const [server] = await db.select().from(serversTable).where(eq(serversTable.slug, slug));
  if (!server) {
    res.status(404).json({ error: "Servidor não encontrado" });
    return;
  }

  const [review] = await db.insert(reviewsTable).values({
    serverId: server.id,
    authorName,
    authorEmail,
    rating: parseInt(String(rating), 10),
    comment,
    status: "approved",
  }).returning();

  // Update server rating average
  const allReviews = await db.select().from(reviewsTable)
    .where(eq(reviewsTable.serverId, server.id));
  const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
  await db.update(serversTable).set({
    rating: Math.round(avg * 10) / 10,
    reviewCount: allReviews.length,
  }).where(eq(serversTable.id, server.id));

  res.status(201).json({
    id: review.id,
    serverId: review.serverId,
    authorName: review.authorName,
    authorEmail: review.authorEmail,
    rating: review.rating,
    comment: review.comment,
    status: review.status,
    createdAt: review.createdAt.toISOString(),
  });
});

router.patch("/reviews/:id/moderate", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    res.status(400).json({ error: "Status inválido" });
    return;
  }

  const [review] = await db.update(reviewsTable).set({ status }).where(eq(reviewsTable.id, id)).returning();
  if (!review) {
    res.status(404).json({ error: "Avaliação não encontrada" });
    return;
  }

  res.json({
    id: review.id,
    serverId: review.serverId,
    authorName: review.authorName,
    authorEmail: review.authorEmail,
    rating: review.rating,
    comment: review.comment,
    status: review.status,
    createdAt: review.createdAt.toISOString(),
  });
});

export default router;
