import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed";
import { db } from "./database";
import { sql } from "drizzle-orm";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  console.log('Starting YeYint Cannabis E-commerce Application...');

  try {
    await db.execute(sql`CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      name JSON NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      class_name TEXT,
      "order" INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      updated_at TIMESTAMP DEFAULT NOW()
    )`);
    await db.execute(sql`INSERT INTO categories (name, slug, class_name, "order", is_active) VALUES
      ('{"en": "High Quality", "my": "အရည်အသွေးမြင့်"}', 'high', 'quality-high', 0, true),
      ('{"en": "Standard Quality", "my": "သာမာန်အရည်အသွေး"}', 'medium', 'quality-medium', 1, true),
      ('{"en": "Smoking Accessories", "my": "Smoking Accessories"}', 'smoking-accessories', 'quality-accessories', 2, true),
      ('{"en": "Glass Bong", "my": "Glass Bong"}', 'glass-bong', 'quality-glass-bong', 3, true)
    ON CONFLICT (slug) DO NOTHING`);
    console.log('✓ Categories table ready');
  } catch (error) {
    console.error('Categories table migration error:', error);
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
