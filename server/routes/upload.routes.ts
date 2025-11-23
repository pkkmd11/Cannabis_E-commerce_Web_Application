import type { Express } from "express";
import multer from "multer";
import { uploadFileToR2 } from "../r2-client";

/**
 * Upload Routes
 * Handles file upload to Cloudflare R2 storage
 */

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },
});

export function registerUploadRoutes(app: Express) {
  // File upload endpoint - supports multiple files (images and videos)
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Upload error:', errorMessage, error);
      res.status(500).json({ error: `Failed to upload files: ${errorMessage}` });
    }
  });
}
