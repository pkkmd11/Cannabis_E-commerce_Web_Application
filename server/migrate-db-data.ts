/**
 * Database Data Migration Script
 * Migrates data from Old Replit PostgreSQL to New Supabase PostgreSQL
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';
import { env } from './config';

// Old Database (Replit PostgreSQL)
const oldDbUrl = process.env.DATABASE_URL;
if (!oldDbUrl) {
  throw new Error('DATABASE_URL is required for old database connection');
}
const oldSql = postgres(oldDbUrl, { prepare: false });
const oldDb = drizzle(oldSql, { schema });

// New Database (Supabase PostgreSQL)
const newDbUrl = env.NEW_PG_DATABASE_URL;
if (!newDbUrl) {
  throw new Error('NEW_PG_DATABASE_URL is required for new database connection');
}
const newSql = postgres(newDbUrl, { prepare: false });
const newDb = drizzle(newSql, { schema });

console.log('🚀 Starting Database Data Migration');
console.log('📤 Source: Replit PostgreSQL');
console.log('📥 Destination: New Supabase PostgreSQL');
console.log('============================================================\n');

async function migrateData() {
  try {
    // 1. Migrate Users
    console.log('👥 Migrating users...');
    const users = await oldDb.select().from(schema.users);
    console.log(`   Found ${users.length} users`);
    
    if (users.length > 0) {
      for (const user of users) {
        await newDb.insert(schema.users).values(user).onConflictDoNothing();
      }
      console.log(`   ✅ Migrated ${users.length} users\n`);
    }

    // 2. Migrate Products
    console.log('📦 Migrating products...');
    const products = await oldDb.select().from(schema.products);
    console.log(`   Found ${products.length} products`);
    
    if (products.length > 0) {
      for (const product of products) {
        await newDb.insert(schema.products).values(product).onConflictDoNothing();
      }
      console.log(`   ✅ Migrated ${products.length} products\n`);
    }

    // 3. Migrate Contact Info
    console.log('📞 Migrating contact info...');
    const contacts = await oldDb.select().from(schema.contactInfo);
    console.log(`   Found ${contacts.length} contact entries`);
    
    if (contacts.length > 0) {
      for (const contact of contacts) {
        await newDb.insert(schema.contactInfo).values(contact).onConflictDoNothing();
      }
      console.log(`   ✅ Migrated ${contacts.length} contact entries\n`);
    }

    // 4. Migrate FAQ Items
    console.log('❓ Migrating FAQ items...');
    const faqItems = await oldDb.select().from(schema.faqItems);
    console.log(`   Found ${faqItems.length} FAQ items`);
    
    if (faqItems.length > 0) {
      for (const faq of faqItems) {
        await newDb.insert(schema.faqItems).values(faq).onConflictDoNothing();
      }
      console.log(`   ✅ Migrated ${faqItems.length} FAQ items\n`);
    }

    // 5. Migrate Site Settings
    console.log('⚙️  Migrating site settings...');
    const settings = await oldDb.select().from(schema.siteSettings);
    console.log(`   Found ${settings.length} site settings`);
    
    if (settings.length > 0) {
      for (const setting of settings) {
        await newDb.insert(schema.siteSettings).values(setting).onConflictDoNothing();
      }
      console.log(`   ✅ Migrated ${settings.length} site settings\n`);
    }

    console.log('============================================================');
    console.log('✅ DATABASE MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('============================================================');
    console.log('📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Contacts: ${contacts.length}`);
    console.log(`   - FAQ Items: ${faqItems.length}`);
    console.log(`   - Settings: ${settings.length}`);
    console.log('============================================================\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    // Close connections
    await oldSql.end();
    await newSql.end();
    console.log('👋 Database connections closed');
  }
}

// Run migration
migrateData()
  .then(() => {
    console.log('✅ Migration script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  });
