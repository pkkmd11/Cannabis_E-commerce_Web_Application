import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertFaqItemSchema, insertContactInfoSchema, insertSiteSettingsSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import { z } from "zod";
import multer from "multer";
import { uploadFileToR2 } from "./r2-client";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // File upload endpoint
  app.post("/api/upload", upload.array('files', 10), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files provided" });
      }

      const uploadedUrls: string[] = [];

      for (const file of files) {
        const isVideo = file.mimetype.startsWith('video/');
        const folder = isVideo ? 'products-video' : 'products-images';
        
        const fileName = `${Date.now()}-${file.originalname}`;
        
        const publicUrl = await uploadFileToR2({
          file: file.buffer,
          fileName,
          contentType: file.mimetype,
          folder,
        });

        uploadedUrls.push(publicUrl);
      }

      res.json({ urls: uploadedUrls });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: "Failed to upload files" });
    }
  });

  // Products endpoints
  app.get("/api/products", async (req, res) => {
    try {
      const { quality } = req.query;
      const products = await storage.getProducts(quality as string);
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Site content endpoints
  app.get("/api/content", async (req, res) => {
    try {
      const content = await storage.getSiteContent();
      res.json(content);
    } catch (error) {
      console.error('Error fetching content:', error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

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

  // Contact info endpoints
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContactInfo();
      res.json(contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

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

  // FAQ endpoints
  app.get("/api/faq", async (req, res) => {
    try {
      const faqItems = await storage.getFaqItems();
      res.json(faqItems);
    } catch (error) {
      console.error('Error fetching FAQ:', error);
      res.status(500).json({ error: "Failed to fetch FAQ" });
    }
  });

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

  // Site settings endpoints
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      console.error('Error fetching site settings:', error);
      res.status(500).json({ error: "Failed to fetch site settings" });
    }
  });

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

  // Admin user endpoints
  const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  });

  app.post("/api/admin/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      // Get admin user by username
      const admin = await storage.getUserByUsername(validatedData.username);
      
      if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(validatedData.password, admin.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      res.json({ 
        success: true, 
        message: "Login successful",
        username: admin.username
      });

    } catch (error) {
      console.error('Error during admin login:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  const updateCredentialsSchema = z.object({
    currentUsername: z.string().min(1, "Current username is required"),
    currentPassword: z.string().min(1, "Current password is required"),
    newUsername: z.string().min(3, "Username must be at least 3 characters").optional(),
    newPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
  });

  app.post("/api/admin/update-credentials", async (req, res) => {
    try {
      const validatedData = updateCredentialsSchema.parse(req.body);
      
      // Get current admin user by their current username
      const currentAdmin = await storage.getUserByUsername(validatedData.currentUsername);
      
      if (!currentAdmin) {
        return res.status(404).json({ error: "Admin user not found" });
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(validatedData.currentPassword, currentAdmin.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      // Prepare update data
      const updateData: any = {};
      
      if (validatedData.newUsername) {
        // Check if new username is already taken (excluding current user)
        const existingUser = await storage.getUserByUsername(validatedData.newUsername);
        if (existingUser && existingUser.id !== currentAdmin.id) {
          return res.status(400).json({ error: "Username already taken" });
        }
        updateData.username = validatedData.newUsername;
      }

      if (validatedData.newPassword) {
        const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10);
        updateData.password = hashedPassword;
      }

      // Update the admin user
      const updatedUser = await storage.updateUser(currentAdmin.id, updateData);

      if (!updatedUser) {
        return res.status(500).json({ error: "Failed to update credentials" });
      }

      res.json({ 
        success: true, 
        message: "Credentials updated successfully",
        username: updatedUser.username
      });

    } catch (error) {
      console.error('Error updating admin credentials:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Failed to update credentials" });
    }
  });

  // Supabase storage is handled client-side, no server routes needed

  const httpServer = createServer(app);
  return httpServer;
}
