import type { Express } from "express";
import { storage } from "../storage";

/**
 * Content Routes
 * Handles site content API endpoints (About Us, How to Order, etc.)
 */
export function registerContentRoutes(app: Express) {
  // Get all site content
  app.get("/api/content", async (req, res) => {
    try {
      const content = await storage.getSiteContent();
      res.json(content);
    } catch (error) {
      console.error('Error fetching content:', error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  // Get site content by section
  app.get("/api/content/:section", async (req, res) => {
    try {
      const { section } = req.params;
      const content = await storage.getSiteContentBySection(section);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      console.error('Error fetching content:', error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });
}
