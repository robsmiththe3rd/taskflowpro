import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// GTD System Tables
export const gtdTasks = pgTable("gtd_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  text: text("text").notNull(),
  category: text("category").notNull(), // "high_focus", "quick_work", "quick_personal", "home", "waiting_for", "someday"
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  projectId: varchar("project_id"), // Optional foreign key to gtdProjects
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const gtdProjects = pgTable("gtd_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  status: text("status").notNull(), // "active", "on_hold", "completed"
  notes: text("notes"),
  areaId: varchar("area_id"), // Optional foreign key to gtdAreas
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const gtdAreas = pgTable("gtd_areas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const gtdGoals = pgTable("gtd_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  text: text("text").notNull(),
  timeframe: text("timeframe").notNull(), // "vision", "3_5_year", "1_2_year"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertTaskSchema = createInsertSchema(gtdTasks).omit({ id: true, createdAt: true });
export const insertProjectSchema = createInsertSchema(gtdProjects).omit({ id: true, createdAt: true });
export const insertAreaSchema = createInsertSchema(gtdAreas).omit({ id: true, createdAt: true });
export const insertGoalSchema = createInsertSchema(gtdGoals).omit({ id: true, createdAt: true });

// Types
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof gtdTasks.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof gtdProjects.$inferSelect;
export type InsertArea = z.infer<typeof insertAreaSchema>;
export type Area = typeof gtdAreas.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof gtdGoals.$inferSelect;

// Legacy user schema for compatibility
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
