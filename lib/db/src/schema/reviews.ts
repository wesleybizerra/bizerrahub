import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { serversTable } from "./servers";

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  serverId: integer("server_id").notNull().references(() => serversTable.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  status: text("status").notNull().default("approved"), // pending | approved | rejected
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviewsTable).omit({ id: true, createdAt: true });
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviewsTable.$inferSelect;
