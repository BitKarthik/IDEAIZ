import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password"),
  name: text("name").notNull(),
  birthDate: timestamp("birth_date"),
  birthTime: text("birth_time"),
  birthPlace: text("birth_place"),
  birthLatitude: real("birth_latitude"),
  birthLongitude: real("birth_longitude"),
  isSubscribed: boolean("is_subscribed").default(false),
  trialEndsAt: timestamp("trial_ends_at"),
  questionsAsked: integer("questions_asked").default(0),
  dailyStreak: integer("daily_streak").default(0),
  lastActiveAt: timestamp("last_active_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  password: true,
}).partial();

export const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type User = typeof users.$inferSelect;
