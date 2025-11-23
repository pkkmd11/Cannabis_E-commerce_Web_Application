import type { Express } from "express";
import { createServer, type Server } from "http";
import { registerProductRoutes } from "./routes/product.routes";
import { registerAuthRoutes } from "./routes/auth.routes";
import { registerFaqRoutes } from "./routes/faq.routes";
import { registerContactRoutes } from "./routes/contact.routes";
import { registerContentRoutes } from "./routes/content.routes";
import { registerSettingsRoutes } from "./routes/settings.routes";
import { registerUploadRoutes } from "./routes/upload.routes";

/**
 * Main Route Registration
 * Registers all API routes by delegating to modular route handlers
 * 
 * Route organization:
 * - /api/products     - Product CRUD operations
 * - /api/admin        - Authentication and admin management
 * - /api/faq          - FAQ management
 * - /api/contacts     - Contact information
 * - /api/content      - Site content (About Us, How to Order)
 * - /api/settings     - Site settings (logo, name, tagline)
 * - /api/upload       - File upload to R2 storage
 */
export async function registerRoutes(app: Express): Promise<Server> {
  // Register all route modules
  registerProductRoutes(app);
  registerAuthRoutes(app);
  registerFaqRoutes(app);
  registerContactRoutes(app);
  registerContentRoutes(app);
  registerSettingsRoutes(app);
  registerUploadRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
