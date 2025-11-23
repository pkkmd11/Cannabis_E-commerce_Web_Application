import type { Express } from "express";
import { storage } from "../storage";
import { insertSiteSettingsSchema } from "@shared/schema";

/**
 * Settings Routes
 * Handles site settings API endpoints (logo, site name, tagline)
 */
export function registerSettingsRoutes(app: Express) {
  // Get site settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      console.error('Error fetching site settings:', error);
      res.status(500).json({ error: "Failed to fetch site settings" });
    }
  });

  // Update site settings
  app.put("/api/settings", async (req, res) => {
    try {
      const validatedData = insertSiteSettingsSchema.partial().parse(req.body);
      const settings = await storage.updateSiteSettings(validatedData);
      res.json(settings);
    } catch (error) {
      console.error('Error updating site settings:', error);
      res.status(400).json({ error: "Invalid settings data" });
    }
  });
}
