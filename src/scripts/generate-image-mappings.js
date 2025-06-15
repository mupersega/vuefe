/**
 * Script to generate image availability mappings for EVE types
 * 
 * This script:
 * 1. Fetches all unique product type IDs from industry activity products
 * 2. Tests each type ID against EVE image server for available image variations
 * 3. Generates a JSON mapping file with available image types
 * 
 * Usage: node src/scripts/generate-image-mappings.js
 */

import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const API_BASE_URL = 'http://localhost:5248/api';
const EVE_IMAGE_BASE_URL = 'https://images.evetech.net/types';
const OUTPUT_FILE = path.join(__dirname, '..', 'services', 'image-mappings.json');

// Rate limiting configuration (much faster now since we only make 1 request per type)
const REQUEST_DELAY = 50; // milliseconds between requests
const BATCH_SIZE = 100; // how many to process in parallel

/**
 * Sleep utility for rate limiting
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all available image variations for a given type ID using EVE server's built-in capability
 * The EVE image server returns a JSON array of available variations when no variation is specified
 */
async function getAvailableImages(typeId) {
  const url = `${EVE_IMAGE_BASE_URL}/${typeId}`;
  
  try {
    const response = await fetch(url);
    
    if (response.status === 200) {
      const variations = await response.json();
      // Server returns array like ["render", "icon"] or ["bp", "icon"]
      return Array.isArray(variations) ? variations : [];
    } else {
      // No variations available for this type
      return [];
    }
  } catch (error) {
    console.warn(`Error fetching variations for type ${typeId}:`, error.message);
    return [];
  }
}

/**
 * Fetch all unique product type IDs from industry activity products
 */
async function fetchProductTypeIds() {
  console.log('Fetching industry activity products...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/industry-activity-products`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const products = await response.json();
    console.log(`Fetched ${products.length} industry activity products`);
    
    // Extract unique product type IDs
    const uniqueTypeIds = [...new Set(products.map(p => p.productTypeId).filter(id => id !== null && id !== undefined))];
    console.log(`Found ${uniqueTypeIds.length} unique product type IDs`);
    
    return uniqueTypeIds;
  } catch (error) {
    console.error('Error fetching product type IDs:', error);
    throw error;
  }
}

/**
 * Process a batch of type IDs
 */
async function processBatch(typeIds, batchIndex, totalBatches) {
  console.log(`Processing batch ${batchIndex + 1}/${totalBatches} (${typeIds.length} items)`);
  
  const results = {};
    for (let i = 0; i < typeIds.length; i++) {
    const typeId = typeIds[i];
    console.log(`  Testing type ${typeId} (${i + 1}/${typeIds.length})`);
    
    const availableImages = await getAvailableImages(typeId);
    
    if (availableImages.length > 0) {
      results[typeId] = availableImages;
      console.log(`    Found: [${availableImages.join(', ')}]`);
    } else {
      console.log(`    No images found`);
    }
    
    // Rate limiting between requests
    if (i < typeIds.length - 1) {
      await sleep(REQUEST_DELAY);
    }
  }
  
  return results;
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting image mapping generation...');
  console.log(`Output will be saved to: ${OUTPUT_FILE}`);
  
  try {
    // Step 1: Fetch all product type IDs
    const typeIds = await fetchProductTypeIds();
    
    if (typeIds.length === 0) {
      console.log('No type IDs found. Exiting.');
      return;
    }
    
    // Step 2: Split into batches for processing
    const batches = [];
    for (let i = 0; i < typeIds.length; i += BATCH_SIZE) {
      batches.push(typeIds.slice(i, i + BATCH_SIZE));
    }
      console.log(`\n📊 Processing ${typeIds.length} type IDs in ${batches.length} batches`);
    console.log(`Rate limit: ${REQUEST_DELAY}ms between requests`);
    console.log(`Using EVE server's built-in variation discovery\n`);
    
    // Step 3: Process each batch
    const allResults = {};
    
    for (let i = 0; i < batches.length; i++) {
      const batchResults = await processBatch(batches[i], i, batches.length);
      Object.assign(allResults, batchResults);
      
      // Small delay between batches
      if (i < batches.length - 1) {
        console.log(`  Batch complete. Waiting before next batch...\n`);
        await sleep(REQUEST_DELAY * 2);
      }
    }
    
    // Step 4: Save results
    console.log(`\n💾 Saving results...`);
    
    const outputData = JSON.stringify(allResults, null, 2);
    await fs.writeFile(OUTPUT_FILE, outputData, 'utf8');
    
    const totalTypesWithImages = Object.keys(allResults).length;
    const totalVariationsFound = Object.values(allResults).reduce((sum, variations) => sum + variations.length, 0);
    
    console.log(`✅ Image mapping generation complete!`);
    console.log(`📈 Statistics:`);
    console.log(`   - Total types processed: ${typeIds.length}`);
    console.log(`   - Types with images: ${totalTypesWithImages}`);
    console.log(`   - Total image variations found: ${totalVariationsFound}`);
    console.log(`   - Output file: ${OUTPUT_FILE}`);
    
    // Show a sample of the results
    console.log(`\n📋 Sample results:`);
    const sampleEntries = Object.entries(allResults).slice(0, 5);
    sampleEntries.forEach(([typeId, variations]) => {
      console.log(`   ${typeId}: [${variations.join(', ')}]`);
    });
    
    if (totalTypesWithImages > 5) {
      console.log(`   ... and ${totalTypesWithImages - 5} more`);
    }
    
  } catch (error) {
    console.error('❌ Error during image mapping generation:', error);
    process.exit(1);
  }
}

// Run the script
main();
