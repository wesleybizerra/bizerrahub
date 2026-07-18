import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  role: text("role").notNull().default("visitor"), // visitor | cidadao | vip | fundador | admin
  plan: text("plan").notNull().default("free"),    // free | cidadao | vip | fundador
  badge: text("badge"),
  xp: integer("xp").notNull().default(0),
  stripeCustomerId: text("stripe_customer_id"),
  active: text("active").notNull().default("true"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
