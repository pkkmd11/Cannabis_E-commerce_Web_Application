/**
 * ⚠️ MIGRATION COMPLETED - DO NOT RUN AGAIN ⚠️
 * 
 * This file contains the data migration script that was used to transfer
 * 218 product images from Old Supabase Storage to Cloudflare R2.
 * 
 * Migration completed on: November 10, 2025
 * Status: Successfully transferred 218/219 files
 * 
 * This file is kept for reference only. Running it again may cause:
 * - Duplicate files in R2 storage
 * - Incorrect database URL references
 * - Unnecessary API calls and costs
 * 
 * If you need to migrate new data, create a new migration script based on this template.
 */

import { createClient } from '@supabase/supabase-js';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { uploadFileToR2 } from './r2-client';
import * as schema from '@shared/schema';
import { env } from './config';

// Initialize Old Supabase Client (for storage only)
const oldSupabaseUrl = env.OLD_SUPABASE_URL || process.env.OLD_SUPABASE_URL;
const oldSupabaseKey = process.env.OLD_SUPABASE_SERVICE_ROLE_KEY || process.env.OLD_SUPABASE_URL_SERVICE_ROLE_KEY;

if (!oldSupabaseUrl || !oldSupabaseKey) {
  throw new Error('OLD_SUPABASE_URL and OLD_SUPABASE_SERVICE_ROLE_KEY (or OLD_SUPABASE_URL_SERVICE_ROLE_KEY) are required');
}

console.log('✓ Old Supabase client initialized for file migration');
const oldSupabase = createClient(oldSupabaseUrl, oldSupabaseKey);

// Initialize New Supabase Client (for database)
const newSupabaseUrl = env.NEW_SUPABASE_URL;
const newSupabaseKey = env.NEW_SUPABASE_SERVICE_ROLE_KEY;

if (!newSupabaseUrl || !newSupabaseKey) {
  throw new Error('NEW_SUPABASE_URL and NEW_SUPABASE_SERVICE_ROLE_KEY are required');
}

const newSupabase = createClient(newSupabaseUrl, newSupabaseKey);

// Initialize New Database Connection
const newDbUrl = env.NEW_PG_DATABASE_URL;
if (!newDbUrl) {
  throw new Error('NEW_PG_DATABASE_URL is required');
}
const sql = postgres(newDbUrl, { prepare: false });
const db = drizzle(sql, { schema });

interface FileTransferResult {
  oldUrl: string;
  newUrl: string;
  fileName: string;
  folder: string;
}

async function transferFilesFromBucket(
  bucketName: 'product-images' | 'product-videos',
  r2Folder: 'products-images' | 'products-video'
): Promise<FileTransferResult[]> {
  console.log(`\n📦 Transferring files from bucket: ${bucketName} to R2 folder: ${r2Folder}`);
  
  const results: FileTransferResult[] = [];

  // List all files from old Supabase bucket (including nested folders)
  const { data: files, error: listError } = await oldSupabase.storage
    .from(bucketName)
    .list('products', {
      limit: 1000,
      sortBy: { column: 'name', order: 'asc' }
    });

  if (listError) {
    console.error(`❌ Error listing files from ${bucketName}:`, listError);
    return results;
  }

  if (!files || files.length === 0) {
    console.log(`ℹ️  No files found in ${bucketName}`);
    return results;
  }

  console.log(`📋 Found ${files.length} files in ${bucketName}`);

  for (const file of files) {
    if (file.name === '.emptyFolderPlaceholder') {
      continue;
    }

    try {
      console.log(`  ⬇️  Downloading: ${file.name}`);
      
      // Download file from old Supabase storage (including folder path)
      const filePath = `products/${file.name}`;
      const { data: fileData, error: downloadError } = await oldSupabase.storage
        .from(bucketName)
        .download(filePath);

      if (downloadError || !fileData) {
        console.error(`    ❌ Error downloading ${file.name}:`, downloadError);
        continue;
      }

      // Convert Blob to Buffer
      const arrayBuffer = await fileData.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Get content type from file metadata or infer from extension
      const contentType = fileData.type || 'application/octet-stream';

      console.log(`  ⬆️  Uploading to R2: ${file.name}`);
      
      // Upload to R2
      const newUrl = await uploadFileToR2({
        file: buffer,
        fileName: file.name,
        contentType: contentType,
        folder: r2Folder,
      });

      // Build old URL (with folder path)
      const { data: oldUrlData } = oldSupabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      const oldUrl = oldUrlData.publicUrl;

      results.push({
        oldUrl,
        newUrl,
        fileName: file.name,
        folder: r2Folder,
      });

      console.log(`    ✅ Transferred: ${file.name}`);
    } catch (error) {
      console.error(`    ❌ Error transferring ${file.name}:`, error);
    }
  }

  console.log(`✅ Transferred ${results.length}/${files.length} files from ${bucketName}`);
  return results;
}

async function updateDatabaseUrls(urlMappings: FileTransferResult[]): Promise<void> {
  console.log(`\n🔄 Updating database URLs...`);

  if (urlMappings.length === 0) {
    console.log('ℹ️  No URL mappings to apply');
    return;
  }

  // Create a mapping of old URL to new URL
  const urlMap = new Map<string, string>();
  urlMappings.forEach(mapping => {
    urlMap.set(mapping.oldUrl, mapping.newUrl);
  });

  // Fetch all products
  const products = await db.select().from(schema.products);
  console.log(`📦 Found ${products.length} products to update`);

  let productsUpdated = 0;
  
  for (const product of products) {
    let updated = false;
    const updatedImages: string[] = [];
    const updatedVideos: string[] = [];

    // Update images
    if (product.images && Array.isArray(product.images)) {
      for (const imageUrl of product.images) {
        const newUrl = urlMap.get(imageUrl);
        updatedImages.push(newUrl || imageUrl);
        if (newUrl) updated = true;
      }
    }

    // Update videos
    if (product.videos && Array.isArray(product.videos)) {
      for (const videoUrl of product.videos) {
        const newUrl = urlMap.get(videoUrl);
        updatedVideos.push(newUrl || videoUrl);
        if (newUrl) updated = true;
      }
    }

    if (updated) {
      await db
        .update(schema.products)
        .set({
          images: updatedImages,
          videos: updatedVideos,
        })
        .where(eq(schema.products.id, product.id));
      
      productsUpdated++;
      const productName = (product.name as any)?.en || product.id;
      console.log(`  ✅ Updated product: ${productName}`);
    }
  }

  console.log(`✅ Updated ${productsUpdated} products`);

  // Fetch all contact info
  const contacts = await db.select().from(schema.contactInfo);
  console.log(`📞 Found ${contacts.length} contact entries to update`);

  let contactsUpdated = 0;

  for (const contact of contacts) {
    if (contact.qrCode) {
      const newUrl = urlMap.get(contact.qrCode);
      if (newUrl) {
        await db
          .update(schema.contactInfo)
          .set({ qrCode: newUrl })
          .where(eq(schema.contactInfo.id, contact.id));
        
        contactsUpdated++;
        console.log(`  ✅ Updated contact QR: ${contact.platform}`);
      }
    }
  }

  console.log(`✅ Updated ${contactsUpdated} contact entries`);

  // Fetch site settings
  const settings = await db.select().from(schema.siteSettings);
  console.log(`⚙️  Found ${settings.length} site settings to update`);

  let settingsUpdated = 0;

  for (const setting of settings) {
    if (setting.logoUrl) {
      const newUrl = urlMap.get(setting.logoUrl);
      if (newUrl) {
        await db
          .update(schema.siteSettings)
          .set({ logoUrl: newUrl })
          .where(eq(schema.siteSettings.id, setting.id));
        
        settingsUpdated++;
        console.log(`  ✅ Updated site logo URL`);
      }
    }
  }

  console.log(`✅ Updated ${settingsUpdated} site settings`);
}

async function runMigration(): Promise<void> {
  console.log('🚀 Starting data migration from Old Supabase to New Supabase + R2\n');
  console.log('=' .repeat(60));

  try {
    // Phase 1: Transfer files from old Supabase storage to R2
    console.log('\n📁 PHASE 1: File Transfer');
    console.log('-'.repeat(60));

    const imageResults = await transferFilesFromBucket('product-images', 'products-images');
    const videoResults = await transferFilesFromBucket('product-videos', 'products-video');

    const allResults = [...imageResults, ...videoResults];

    // Phase 2: Update database URLs
    console.log('\n🔄 PHASE 2: Database URL Updates');
    console.log('-'.repeat(60));

    await updateDatabaseUrls(allResults);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log(`📊 Summary:`);
    console.log(`   - Files transferred: ${allResults.length}`);
    console.log(`   - Images: ${imageResults.length}`);
    console.log(`   - Videos: ${videoResults.length}`);
    console.log(`   - Database records updated: Check logs above`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ MIGRATION FAILED:', error);
    throw error;
  } finally {
    // Close database connection
    await sql.end();
    console.log('\n👋 Database connection closed');
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration()
    .then(() => {
      console.log('\n✅ Migration script finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Migration script failed:', error);
      process.exit(1);
    });
}

export { runMigration };
