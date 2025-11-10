/**
 * URL Migration Script
 * Updates product image/video URLs from Old Supabase Storage to Cloudflare R2
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import * as schema from '@shared/schema';
import { env } from './config';

const newDbUrl = env.NEW_PG_DATABASE_URL;
if (!newDbUrl) {
  throw new Error('NEW_PG_DATABASE_URL is required');
}

const r2PublicDomain = env.R2_PUBLIC_DOMAIN;
if (!r2PublicDomain) {
  throw new Error('R2_PUBLIC_DOMAIN is required');
}

const sql = postgres(newDbUrl, { prepare: false });
const db = drizzle(sql, { schema });

console.log('🔧 Starting URL Migration');
console.log('📦 Database: New Supabase PostgreSQL');
console.log(`🌐 New R2 Domain: ${r2PublicDomain}`);
console.log('============================================================\n');

function convertSupabaseUrlToR2(oldUrl: string, r2Domain: string): string {
  // Extract the file path from old Supabase URL
  // Example: https://xxx.supabase.co/storage/v1/object/public/cannabis-products/products-images/filename.jpg
  // Should become: https://pub-xxx.r2.dev/products-images/filename.jpg
  
  const match = oldUrl.match(/\/(?:products-images|products-video)\/.+$/);
  if (match) {
    const filePath = match[0].substring(1); // Remove leading slash
    return `${r2Domain}/${filePath}`;
  }
  
  // If URL doesn't match expected pattern, return as-is
  console.warn(`   ⚠️  Could not parse URL: ${oldUrl}`);
  return oldUrl;
}

async function updateProductUrls() {
  try {
    // Fetch all products
    console.log('📋 Fetching all products from database...');
    const products = await db.select().from(schema.products);
    console.log(`   Found ${products.length} products\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const product of products) {
      const productName = typeof product.name === 'object' ? (product.name as any).en : product.name;
      console.log(`📦 Processing: ${productName} (ID: ${product.id})`);
      
      let needsUpdate = false;
      const updatedImages: string[] = [];
      const updatedVideos: string[] = [];

      // Update image URLs
      if (product.images && Array.isArray(product.images)) {
        for (const imageUrl of product.images) {
          if (typeof imageUrl === 'string' && imageUrl.includes('supabase.co')) {
            const newUrl = convertSupabaseUrlToR2(imageUrl, r2PublicDomain!);
            updatedImages.push(newUrl);
            needsUpdate = true;
            console.log(`   🖼️  Image: ${imageUrl.substring(0, 60)}...`);
            console.log(`   ➡️  New:   ${newUrl}`);
          } else if (typeof imageUrl === 'string' && imageUrl.includes(r2PublicDomain || '')) {
            // Already an R2 URL
            updatedImages.push(imageUrl);
          } else if (typeof imageUrl === 'string') {
            // Unknown URL format, keep as-is
            updatedImages.push(imageUrl);
          }
        }
      }

      // Update video URLs
      if (product.videos && Array.isArray(product.videos)) {
        for (const videoUrl of product.videos) {
          if (typeof videoUrl === 'string' && videoUrl.includes('supabase.co')) {
            const newUrl = convertSupabaseUrlToR2(videoUrl, r2PublicDomain!);
            updatedVideos.push(newUrl);
            needsUpdate = true;
            console.log(`   🎥 Video: ${videoUrl.substring(0, 60)}...`);
            console.log(`   ➡️  New:   ${newUrl}`);
          } else if (typeof videoUrl === 'string' && videoUrl.includes(r2PublicDomain || '')) {
            // Already an R2 URL
            updatedVideos.push(videoUrl);
          } else if (typeof videoUrl === 'string') {
            // Unknown URL format, keep as-is
            updatedVideos.push(videoUrl);
          }
        }
      }

      // Update the product if needed
      if (needsUpdate) {
        await db
          .update(schema.products)
          .set({
            images: updatedImages.length > 0 ? updatedImages : product.images,
            videos: updatedVideos.length > 0 ? updatedVideos : product.videos,
          })
          .where(eq(schema.products.id, product.id));
        
        console.log(`   ✅ Updated product URLs\n`);
        updatedCount++;
      } else {
        console.log(`   ⏭️  No Supabase URLs found, skipped\n`);
        skippedCount++;
      }
    }

    console.log('============================================================');
    console.log('✅ URL MIGRATION COMPLETED!');
    console.log('============================================================');
    console.log(`📊 Summary:`);
    console.log(`   - Total products: ${products.length}`);
    console.log(`   - Updated: ${updatedCount}`);
    console.log(`   - Skipped: ${skippedCount}`);
    console.log('============================================================\n');

  } catch (error) {
    console.error('❌ URL migration failed:', error);
    throw error;
  } finally {
    await sql.end();
    console.log('👋 Database connection closed');
  }
}

// Run the migration
updateProductUrls()
  .then(() => {
    console.log('✅ URL migration script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ URL migration script failed:', error);
    process.exit(1);
  });
