import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: json("name").notNull(), // {en: string, my: string}
  description: json("description").notNull(), // {en: string, my: string}
  quality: text("quality").notNull(), // 'high' | 'medium' | 'smoking-accessories' | 'glass-bong'
  images: json("images").$type<string[]>().notNull().default([]),
  videos: json("videos").$type<string[]>().notNull().default([]),
  specifications: json("specifications").$type<{en: string[], my: string[]}>().default({en: [], my: []}),
  isActive: boolean("is_active").default(true),
  stockStatus: boolean("stock_status").default(true), // true = in stock, false = out of stock
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const siteContent = pgTable("site_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  section: text("section").notNull(), // 'about', 'how-to-order', 'faq', etc.
  content: json("content").notNull(), // {en: any, my: any}
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contactInfo = pgTable("contact_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: text("platform").notNull().unique(), // 'telegram', 'messenger', 'line'
  url: text("url").notNull(),
  qrCode: text("qr_code"), // base64 or URL to QR code image
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const faqItems = pgTable("faq_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: json("question").notNull(), // {en: string, my: string}
  answer: json("answer").notNull(), // {en: string, my: string}
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  siteName: text("site_name").notNull().default("Nyo"),
  tagline: text("tagline").default("Premium Cannabis"),
  logoUrl: text("logo_url"), // URL to uploaded logo image
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: json("name").notNull(), // {en: string, my: string}
  slug: text("slug").notNull().unique(),
  className: text("class_name"),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.object({
    en: z.string(),
    my: z.string(),
  }),
  description: z.object({
    en: z.string(),
    my: z.string(),
  }),
  quality: z.enum(['high', 'medium', 'smoking-accessories', 'glass-bong']),
  images: z.array(z.string()),
  videos: z.array(z.string()).optional(),
  specifications: z.object({
    en: z.array(z.string()),
    my: z.array(z.string()),
  }).optional(),
});

export const insertSiteContentSchema = createInsertSchema(siteContent).omit({
  id: true,
  updatedAt: true,
});

export const insertContactInfoSchema = createInsertSchema(contactInfo).omit({
  id: true,
  updatedAt: true,
});

export const insertFaqItemSchema = createInsertSchema(faqItems).omit({
  id: true,
  updatedAt: true,
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  updatedAt: true,
}).extend({
  name: z.object({
    en: z.string(),
    my: z.string(),
  }),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type SiteContent = typeof siteContent.$inferSelect;
export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;

export type ContactInfo = typeof contactInfo.$inferSelect;
export type InsertContactInfo = z.infer<typeof insertContactInfoSchema>;

export type FaqItem = typeof faqItems.$inferSelect;
export type InsertFaqItem = z.infer<typeof insertFaqItemSchema>;

export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
