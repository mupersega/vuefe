// Query Builder Example
import { db, createQuery, createOptimizedQuery } from '../services/db';
import type { InvTypeShortDto } from '../api-client';

// Example 1: Simple search with multiple filters using createQuery
async function searchItemsWithMultipleFilters(namePrefix: string, categoryId?: number): Promise<InvTypeShortDto[]> {
  const filters = [
    {
      field: 'typeName',
      operator: 'startsWith' as const,
      value: namePrefix,
      ignoreCase: true
    }
  ];
  
  // Add category filter if provided
  if (categoryId !== undefined) {
    filters.push({
      field: 'categoryId',
      operator: 'equals' as const,
      value: categoryId
    });
  }
  
  return createQuery(db.invTypeShorts, filters, 100);
}

// Example 2: Optimized query that tries to leverage indexes
async function searchItemsOptimized(namePrefix: string, minPrice?: number, maxPrice?: number): Promise<InvTypeShortDto[]> {
  const filters = [
    // Put the most restrictive filter first for optimization
    {
      field: 'typeName',
      operator: 'startsWith' as const,
      value: namePrefix,
      ignoreCase: true
    }
  ];
  
  // Add price range filter if provided
  if (minPrice !== undefined && maxPrice !== undefined) {
    filters.push({
      field: 'basePrice', // Assuming there's a basePrice field
      operator: 'between' as const,
      value: [minPrice, maxPrice]
    });
  } else if (minPrice !== undefined) {
    filters.push({
      field: 'basePrice',
      operator: 'greaterThan' as const,
      value: minPrice
    });
  } else if (maxPrice !== undefined) {
    filters.push({
      field: 'basePrice',
      operator: 'lessThan' as const,
      value: maxPrice
    });
  }
  
  return createOptimizedQuery(db.invTypeShorts, filters, 100);
}

// Example 3: Complex filtering example with multiple criteria
async function findManufacturableItems(
  nameContains: string,
  groupIds: number[],
  tech: number
): Promise<InvTypeShortDto[]> {
  // First, find items by name
  const nameFilter = {
    field: 'typeName',
    operator: 'contains' as const,
    value: nameContains
  };
  
  // Build filters array
  const filters = [nameFilter];
  
  // Add group filter if provided
  if (groupIds && groupIds.length > 0) {
    // For each item, we'll check if its groupId is in the provided array
    filters.push({
      field: 'groupId',
      operator: 'equals' as const,
      value: groupIds[0] // We'll handle multiple values in a custom way
    });
  }
  
  // Add tech level filter
  filters.push({
    field: 'techLevel', // Assuming there's a techLevel field
    operator: 'equals' as const,
    value: tech
  });
  
  let results = await createOptimizedQuery(db.invTypeShorts, filters, 1000);
  
  // If we have multiple group IDs, filter further in memory
  // (this is just an example of handling a complex case that our query builder doesn't directly support)
  if (groupIds && groupIds.length > 1) {
    results = results.filter(item => groupIds.includes((item as any).groupId));
  }
  
  return results;
}

// Usage examples:
export async function runQueryExamples() {
  console.log('Running query examples...');
  
  // Basic search
  const tritaniumItems = await searchItemsWithMultipleFilters('Tritanium');
  console.log(`Found ${tritaniumItems.length} items starting with 'Tritanium'`);
  
  // Search with category filter
  const minerals = await searchItemsWithMultipleFilters('', 4); // Category 4 might be minerals
  console.log(`Found ${minerals.length} items in category 4`);
  
  // Optimized search with price range
  const affordableItems = await searchItemsOptimized('', 1000, 5000);
  console.log(`Found ${affordableItems.length} items between 1,000 and 5,000 ISK`);
  
  // Complex search
  const manufacturableModules = await findManufacturableItems('Module', [7, 9], 2); // Groups 7 and 9, Tech 2
  console.log(`Found ${manufacturableModules.length} Tech 2 modules in groups 7 and 9`);
  
  return {
    tritaniumItems,
    minerals,
    affordableItems,
    manufacturableModules
  };
}
