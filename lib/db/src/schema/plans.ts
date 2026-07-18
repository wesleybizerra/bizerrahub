import { pgTable, serial, text, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const plansTable = pgTable("plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // free | cidadao | vip | fundador
  priceMonthly: real("price_monthly").notNull().default(0),
  priceAnnual: real("price_annual"),
  annualEnabled: boolean("annual_enabled").notNull().default(false),
  popular: boolean("popular").notNull().default(false),
  benefits: text("benefits").notNull().default("[]"), // JSON array as text
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPlanSchema = createInsertSchema(plansTable).omit({ id: true, createdAt: true });
export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type Plan = typeof plansTable.$inferSelect;
