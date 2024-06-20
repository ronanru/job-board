import { createId } from "@paralleldrive/cuid2";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const jobPostings = sqliteTable("job_posting", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title", { length: 256 }).notNull(),
  companyName: text("company_name", { length: 256 }).notNull(),
  salaryRange: text("salary_range", { length: 256 }).notNull(),
  location: text("location", { length: 256 }).notNull(),
  description: text("description", { length: 1024 }).notNull(),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull(),
  isApproved: int("is_approved", { mode: "boolean" }).notNull().default(false),
  isArchived: int("is_archived", { mode: "boolean" }).notNull().default(false),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: int("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }),
  applicationLink: text("application_link", { length: 256 }).notNull(),
});

export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  githubId: int("github_id").notNull().unique(),
  username: text("username").notNull(),
  isAdmin: int("is_admin", { mode: "boolean" }).notNull().default(false),
});

export const sessions = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: int("expires_at").notNull(),
});
