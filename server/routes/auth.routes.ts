import type { Express } from "express";
import { storage } from "../storage";
import bcrypt from "bcrypt";
import { z } from "zod";

/**
 * Authentication Routes
 * Handles admin login and credential management
 */

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const updateCredentialsSchema = z.object({
  currentUsername: z.string().min(1, "Current username is required"),
  currentPassword: z.string().min(1, "Current password is required"),
  newUsername: z.string().min(3, "Username must be at least 3 characters").optional(),
  newPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export function registerAuthRoutes(app: Express) {
  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const admin = await storage.getUserByUsername(validatedData.username);
      
      if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

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

  // Update admin credentials endpoint
  app.post("/api/admin/update-credentials", async (req, res) => {
    try {
      const validatedData = updateCredentialsSchema.parse(req.body);
      
      const currentAdmin = await storage.getUserByUsername(validatedData.currentUsername);
      
      if (!currentAdmin) {
        return res.status(404).json({ error: "Admin user not found" });
      }

      const isPasswordValid = await bcrypt.compare(validatedData.currentPassword, currentAdmin.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      const updateData: any = {};
      
      if (validatedData.newUsername) {
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
}
