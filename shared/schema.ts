import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(), // 'critical', 'warning', 'watch', 'info'
  type: text("type").notNull(), // 'wildfire', 'earthquake', 'flood', 'storm', etc.
  location: text("location").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  isActive: boolean("is_active").notNull().default(true),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
  imageUrl: text("image_url"),
  actionUrl: text("action_url"),
});

export const safetyGuides = pgTable("safety_guides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'earthquake', 'fire', 'flood', 'general'
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  priority: integer("priority").notNull().default(0),
});

export const emergencyContacts = pgTable("emergency_contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  type: text("type").notNull(), // 'emergency', 'medical', 'personal'
  description: text("description"),
  isDefault: boolean("is_default").notNull().default(false),
});

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  location: text("location"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  notificationsEnabled: boolean("notifications_enabled").notNull().default(true),
  darkMode: boolean("dark_mode").notNull().default(false),
  emergencyContactId: integer("emergency_contact_id"),
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  timestamp: true,
});

export const insertSafetyGuideSchema = createInsertSchema(safetyGuides).omit({
  id: true,
});

export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).omit({
  id: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
});

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type SafetyGuide = typeof safetyGuides.$inferSelect;
export type InsertSafetyGuide = z.infer<typeof insertSafetyGuideSchema>;
export type EmergencyContact = typeof emergencyContacts.$inferSelect;
export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;
export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
