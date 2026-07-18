import { pgTable, serial, text, boolean, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const serversTable = pgTable("servers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  country: text("country").notNull(),
  style: text("style").notNull(),
  allowlist: boolean("allowlist").notNull().default(false),
  level: text("level").notNull().default("all"), // beginner | veteran | all
  rating: real("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  rank: integer("rank").notNull().default(99),
  rankChange: integer("rank_change").default(0),
  trending: boolean("trending").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  badges: text("badges").notNull().default("[]"), // JSON array as text
  game: text("game").notNull().default("gtav"),   // gtav | gta6
  officialLink: text("official_link"),
  discordLink: text("discord_link"),
  playerCount: integer("player_count"),
  weeklyVisits: integer("weekly_visits").default(0),
  howToEnter: text("how_to_enter"),
  requirements: text("requirements"),
  visits: integer("visits").notNull().default(0),
  clicksHowToEnter: integer("clicks_how_to_enter").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertServerSchema = createInsertSchema(serversTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertServer = z.infer<typeof insertServerSchema>;
export type Server = typeof serversTable.$inferSelect;
