import type { Express } from "express";
import { storage } from "../storage";
import { insertFaqItemSchema } from "@shared/schema";

/**
 * FAQ Routes
 * Handles all FAQ-related API endpoints
 */
export function registerFaqRoutes(app: Express) {
  // Get all FAQ items
  app.get("/api/faq", async (req, res) => {
    try {
      const faqItems = await storage.getFaqItems();
      res.json(faqItems);
    } catch (error) {
      console.error('Error fetching FAQ:', error);
      res.status(500).json({ error: "Failed to fetch FAQ" });
    }
  });

  // Create a new FAQ item
  app.post("/api/faq", async (req, res) => {
    try {
      const validatedData = insertFaqItemSchema.parse(req.body);
      const faqItem = await storage.createFaqItem(validatedData);
      res.status(201).json(faqItem);
    } catch (error) {
      console.error('Error creating FAQ item:', error);
      res.status(400).json({ error: "Invalid FAQ data" });
    }
  });

  // Update an existing FAQ item
  app.put("/api/faq/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertFaqItemSchema.partial().parse(req.body);
      const faqItem = await storage.updateFaqItem(id, validatedData);
      if (!faqItem) {
        return res.status(404).json({ error: "FAQ item not found" });
      }
      res.json(faqItem);
    } catch (error) {
      console.error('Error updating FAQ item:', error);
      res.status(400).json({ error: "Invalid FAQ data" });
    }
  });

  // Delete a FAQ item
  app.delete("/api/faq/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteFaqItem(id);
      if (!success) {
        return res.status(404).json({ error: "FAQ item not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting FAQ item:', error);
      res.status(500).json({ error: "Failed to delete FAQ item" });
    }
  });
}
