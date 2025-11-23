import type { Express } from "express";
import { storage } from "../storage";
import { insertContactInfoSchema } from "@shared/schema";

/**
 * Contact Routes
 * Handles contact information API endpoints
 */
export function registerContactRoutes(app: Express) {
  // Get all contact information
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContactInfo();
      res.json(contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  // Update contact information for a specific platform
  app.put("/api/contacts/:platform", async (req, res) => {
    try {
      const { platform } = req.params;
      const validatedData = insertContactInfoSchema.partial().parse(req.body);
      console.log(`Updating contact for platform ${platform} with data:`, validatedData);
      const contactInfo = await storage.updateContactInfo(platform, validatedData);
      console.log(`Updated contact info:`, contactInfo);
      res.json(contactInfo);
    } catch (error) {
      console.error('Error updating contact info:', error);
      res.status(400).json({ error: "Invalid contact data" });
    }
  });
}
