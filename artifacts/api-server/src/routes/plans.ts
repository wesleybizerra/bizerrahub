import { Router, type IRouter } from "express";
import { db, plansTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/plans", async (_req, res): Promise<void> => {
  const plans = await db.select().from(plansTable).orderBy(plansTable.priceMonthly);
  res.json(plans.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    priceMonthly: p.priceMonthly,
    priceAnnual: p.priceAnnual,
    annualEnabled: p.annualEnabled,
    popular: p.popular,
    benefits: (() => { try { return JSON.parse(p.benefits); } catch { return []; } })(),
  })));
});

router.put("/plans", async (req, res): Promise<void> => {
  const { id, name, slug, priceMonthly, priceAnnual, annualEnabled, popular, benefits } = req.body;
  if (!id) {
    res.status(400).json({ error: "ID do plano é obrigatório" });
    return;
  }

  const [plan] = await db.update(plansTable).set({
    name,
    priceMonthly,
    priceAnnual,
    annualEnabled: Boolean(annualEnabled),
    popular: Boolean(popular),
    benefits: JSON.stringify(benefits || []),
  }).where(eq(plansTable.id, id)).returning();

  if (!plan) {
    res.status(404).json({ error: "Plano não encontrado" });
    return;
  }

  res.json({
    id: plan.id,
    name: plan.name,
    slug: plan.slug,
    priceMonthly: plan.priceMonthly,
    priceAnnual: plan.priceAnnual,
    annualEnabled: plan.annualEnabled,
    popular: plan.popular,
    benefits: (() => { try { return JSON.parse(plan.benefits); } catch { return []; } })(),
  });
});

export default router;
