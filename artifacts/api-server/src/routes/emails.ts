import { Router, type IRouter } from "express";
import { db, emailsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.post("/emails/waitlist", async (req, res): Promise<void> => {
  const { email, name } = req.body;
  if (!email) {
    res.status(400).json({ error: "Email é obrigatório" });
    return;
  }

  // Check if already registered
  const [existing] = await db.select().from(emailsTable).where(eq(emailsTable.email, email.toLowerCase().trim()));
  if (existing) {
    res.status(201).json({
      id: existing.id,
      email: existing.email,
      name: existing.name,
      createdAt: existing.createdAt.toISOString(),
    });
    return;
  }

  const [entry] = await db.insert(emailsTable).values({
    email: email.toLowerCase().trim(),
    name: name || null,
  }).returning();

  res.status(201).json({
    id: entry.id,
    email: entry.email,
    name: entry.name,
    createdAt: entry.createdAt.toISOString(),
  });
});

router.get("/emails/waitlist", async (_req, res): Promise<void> => {
  const emails = await db.select().from(emailsTable).orderBy(emailsTable.createdAt);
  res.json(emails.map(e => ({
    id: e.id,
    email: e.email,
    name: e.name,
    createdAt: e.createdAt.toISOString(),
  })));
});

export default router;
