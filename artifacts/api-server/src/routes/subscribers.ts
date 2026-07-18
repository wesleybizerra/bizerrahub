import { Router, type IRouter } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/subscribers", async (_req, res): Promise<void> => {
  const users = await db.select().from(usersTable).orderBy(usersTable.createdAt);
  res.json(users.map(u => ({
    id: u.id,
    email: u.email,
    name: u.name,
    plan: u.plan,
    active: u.active === "true",
    stripeCustomerId: u.stripeCustomerId,
    createdAt: u.createdAt.toISOString(),
  })));
});

router.patch("/subscribers/:id/plan", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  const { plan, active } = req.body;

  const updateData: Record<string, unknown> = {};
  if (plan) {
    updateData.plan = plan;
    // Also update role based on plan
    const roleMap: Record<string, string> = {
      free: "visitor",
      cidadao: "cidadao",
      vip: "vip",
      fundador: "fundador",
    };
    updateData.role = roleMap[plan] || "visitor";
  }
  if (typeof active !== "undefined") {
    updateData.active = String(active);
  }

  const [user] = await db.update(usersTable).set(updateData).where(eq(usersTable.id, id)).returning();
  if (!user) {
    res.status(404).json({ error: "Assinante não encontrado" });
    return;
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    active: user.active === "true",
    stripeCustomerId: user.stripeCustomerId,
    createdAt: user.createdAt.toISOString(),
  });
});

export default router;
