// db.ts
import Dexie, { type EntityTable } from 'dexie';
import type { BlueprintDto, InvCategoryDto, InvGroupDto, InvTypeDto, TypeNameDto} from '../api-client';
import apiService from '@/services/apiService';

const db = new Dexie('dexDb') as Dexie & {
  typeNames: EntityTable<TypeNameDto>;
  blueprints: EntityTable<BlueprintDto>;
  invCategories: EntityTable<InvCategoryDto>;
  invGroups: EntityTable<InvGroupDto>;
  invTypes: EntityTable<InvTypeDto>;
};

db.version(1).stores({
  typeNames: 'typeId, typeName',
  blueprints: 'productId, blueprintId, blueprintName, productName, activityId, categoryId, groupId',
  invCategories: 'categoryId, categoryName',
  invGroups: 'groupId, groupName',
  invTypes: 'typeId, marketGroupId',
},);

db.open().then(() => {
  console.log('Database opened.');
  seed();
}).catch((error) => {
    console.error('Failed to open database:', error);
});

/**
 * Configuration for database seeding
 */
interface SeedConfig {
  /** Name of the database table */
  tableName: string;
  /** API method to fetch data in apiService */
  apiMethod: keyof typeof apiService;
  /** Optional friendly display name (defaults to tableName) */
  displayName?: string;
}

/**
 * List of entities to be seeded in the database
 */
const seedConfigs: SeedConfig[] = [
  {
    tableName: 'typeNames',
    apiMethod: 'getTypeNames',
    displayName: 'TypeNames'
  },
  {
    tableName: 'blueprints',
    apiMethod: 'getBlueprints',
    displayName: 'Blueprints'
  },
  {
    tableName: 'invCategories',
    apiMethod: 'getInvCategories',
    displayName: 'InvCategories'
  },
  {
    tableName: 'invGroups',
    apiMethod: 'getInvGroups',
    displayName: 'InvGroups'
  },
  {
    tableName: 'invTypes',
    apiMethod: 'getInvTypes',
    displayName: 'InvTypes'
  },
];

/**
 * Seeds the database with initial data if tables are empty
 */
async function seed() {
  let pendingOperations = 0;
  let completedOperations = 0;
  
  // Count how many tables need seeding
  for (const config of seedConfigs) {
    const { tableName } = config;
    if (await (db as any)[tableName].count() === 0) {
      pendingOperations++;
    }
  }
  
  // If no tables need seeding, we're already done
  if (pendingOperations === 0) {
    console.log("✓ All tables already seeded, DB setup complete");
    return;
  }
  
  // Process each table
  for (const config of seedConfigs) {
    const { tableName, apiMethod, displayName = tableName } = config;
    
    // Check if table is empty and needs seeding
    if (await (db as any)[tableName].count() === 0) {
      console.log(`Seeding ${displayName}...`);
      
      // Fetch and insert data
      try {
        const data = await (apiService as any)[apiMethod]();
        await (db as any)[tableName].bulkPut(data);
        const rowCount = await (db as any)[tableName].count();
        console.log('✓', rowCount, `${displayName} seeded.`);
        
        // Track completion
        completedOperations++;
        if (completedOperations === pendingOperations) {
          console.log("✓ DB setup complete");
        }
      } catch (error) {
        console.error(`Error seeding ${displayName}:`, error);
      }
    } else {
      console.log(`${displayName} exists, skipping seed...`);
    }
  }
}

/**
 * Generic function to search an entity table for records where a field starts with a given string
 * @param table The entity table to search
 * @param field The field to search in
 * @param search The string to search for
 * @param limit Maximum number of results to return
 * @returns Promise with array of matching records
 */
function searchStartsWith<T>(
  table: EntityTable<T>,
  field: string,
  search: string,
  limit: number
): Promise<T[]> {
  return table
    .where(field)
    .startsWithIgnoreCase(search)
    .limit(limit)
    .toArray();
}

/**
 * Generic function to search an entity table for records where a field contains a given string
 * @param table The entity table to search
 * @param field The field to search in
 * @param search The string to search for
 * @param limit Maximum number of results to return
 * @returns Promise with array of matching records
 */
function searchContains<T>(
  table: EntityTable<T>,
  field: string,
  search: string,
  limit: number
): Promise<T[]> {
  const lowerSearch = search.toLowerCase();

  return table
    .toArray()
    .then((items) =>
      items
        .filter(item => {
          const fieldValue = (item as any)[field];
          return fieldValue?.toLowerCase().includes(lowerSearch);
        })
        .slice(0, limit)
    );
}

/**
 * A filter definition for database queries
 */
export interface Filter<T> {
  field: Extract<keyof T, string>;
  operator: 'equals' | 'startsWith' | 'contains' | 'greaterThan' | 'lessThan' | 'between';
  value: any;
}

/**
 * Creates a query for a Dexie table that applies multiple filters in sequence
 * @param table The entity table to query
 * @param filters Array of filters to apply
 * @param limit Maximum number of results to return
 * @returns Promise with array of matching records
 */
function createQuery<T>(
  table: EntityTable<T>,
  filters: Filter<T>[],
  limit: number = 100
): Promise<T[]> {
  // Start with the table 
  let collection = table.toCollection();
  
  // Apply each filter in sequence
  for (const filter of filters) {
    const { field, operator, value} = filter;
    
    // Apply the appropriate filter based on the operator
    switch (operator) {
      case 'equals':
        collection = collection.filter(item => (item as any)[field]?.toLowerCase() === value?.toLowerCase());
        break;
      
      case 'startsWith':
        // Use built-in startsWith if we're filtering on an indexed field
        try {
          collection = collection.filter(item => (item as any)[field]?.toLowerCase().startsWith(value?.toLowerCase()));
        } catch (error) {
          // Fallback to JavaScript filtering if the field is not indexed
          collection = collection.filter(item => {
            const fieldValue = (item as any)[field];
            if (fieldValue == null) return false;
            
            return String(fieldValue).toLowerCase().startsWith(String(value).toLowerCase());
          });
        }
        break;
      
      case 'contains':
        // Contains always requires JavaScript filtering
        collection = collection.filter(item => {
          const fieldValue = (item as any)[field];
          if (fieldValue == null) return false;
          
          return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
        });
        break;
        
      case 'greaterThan':
        collection = collection.filter(item => (item as any)[field] > value);
        break;
        
      case 'lessThan':
        collection = collection.filter(item => (item as any)[field] < value);
        break;
        
      case 'between':
        if (Array.isArray(value) && value.length === 2) {
          collection = collection.filter(item => {
            const fieldValue = (item as any)[field];
            return fieldValue >= value[0] && fieldValue <= value[1];
          });
        }
        break;
    }
  }
  
  // Apply limit and convert to array
  return collection
    .limit(limit)
    .toArray();
}

/**
 * Creates a more optimized query when filtering on indexed fields
 * This version attempts to use Dexie's native where() method for better performance
 * 
 * @param table The entity table to query
 * @param filters Array of filters to apply
 * @param limit Maximum number of results to return
 * @returns Promise with array of matching records
 */
function createOptimizedQuery<T>(
  table: EntityTable<T>,
  filters: Filter<T>[], // Add the type parameter here
  limit: number = 500
): Promise<T[]> {
  // If no filters, just return all records up to the limit
  console.log(`Creating optimized query with ${filters.length} filters, limit: ${limit}, table: ${table.name}`);
  if (filters.length === 0) {
    console.log(`No filters applied, returning up to ${limit} records.`);
    return table.limit(limit).toArray();
  }
  
  // Try to find an indexed field to use with where() for the first filter
  const primaryFilter = filters[0];
  console.log(`Primary filter: ${primaryFilter.field} ${primaryFilter.operator} ${primaryFilter.value}`);
  let collection;
  
  // First filter uses where() if possible for performance
  try {
    console.log(`Applying primary filter: ${primaryFilter.field} ${primaryFilter.operator} ${primaryFilter.value}`);
    if (primaryFilter.operator === 'equals') {
      console.log(`Using where() for equals on ${primaryFilter.field}`);
      collection = table.where(primaryFilter.field as string).equals(primaryFilter.value);
    } else if (primaryFilter.operator === 'startsWith') {
      // note we always ignore case
      collection = table.where(primaryFilter.field as string).startsWithIgnoreCase(primaryFilter.value);
    } else if (primaryFilter.operator === 'greaterThan') {
      collection = table.where(primaryFilter.field as string).above(primaryFilter.value);
    } else if (primaryFilter.operator === 'lessThan') {
      collection = table.where(primaryFilter.field as string).below(primaryFilter.value);
    } else if (primaryFilter.operator === 'between' && Array.isArray(primaryFilter.value) && primaryFilter.value.length === 2) {
      collection = table.where(primaryFilter.field as string).between(primaryFilter.value[0], primaryFilter.value[1]);
    } else {
      // Default to collection if the operator doesn't match any where() methods
      collection = table.toCollection();
    }
  } catch (error) {
    // If where() fails (e.g., field is not indexed), fall back to toCollection
    console.warn(`Failed to apply where() for ${primaryFilter.field} with operator ${primaryFilter.operator}. Falling back to collection.`);
    collection = table.toCollection();
  }
  
  // Apply remaining filters using filter() method
  for (let i = collection ? 1 : 0; i < filters.length; i++) {
    const filter = filters[i];
    const { field, operator, value } = filter;
    
    // Apply the filter using the same logic as in createQuery
    switch (operator) {
      case 'equals':
        collection = collection.filter(item => (item as any)[field]?.toLowerCase() === value?.toLowerCase());
        break;
      
      case 'startsWith':
        collection = collection.filter(item => {
          const fieldValue = (item as any)[field];
          if (fieldValue == null) return false;
          
          return String(fieldValue).toLowerCase().startsWith(String(value).toLowerCase());
        });
        break;
      
      case 'contains':
        collection = collection.filter(item => {
          const fieldValue = (item as any)[field];
          if (fieldValue == null) return false;
          
          return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
        });
        break;
        
      case 'greaterThan':
        collection = collection.filter(item => (item as any)[field] > value);
        break;
        
      case 'lessThan':
        collection = collection.filter(item => (item as any)[field] < value);
        break;
        
      case 'between':
        if (Array.isArray(value) && value.length === 2) {
          collection = collection.filter(item => {
            const fieldValue = (item as any)[field];
            return fieldValue >= value[0] && fieldValue <= value[1];
          });
        }
        break;
    }
  }
  const result = collection
    .limit(limit)
    .toArray();

  console.log('result', result);
  console.log(`Optimized query complete. Returning up to ${limit} records.`);
  // Apply limit and convert to array
  return result;
}

export const debugQB = async (): Promise<void> => {
    try {
        const result = await createOptimizedQuery(db.blueprints,[
            {
                field: 'activityId',
                operator: 'equals',
                value: 1,
            },
            {
                field: 'productName',
                operator: 'equals',
                value: 'Rifter',
            },
        ], 100);
        console.log('Query Result:', result);
    } catch (error) {
        console.error('Error deleting Dexi DB:', error);
        return Promise.reject(error);
    }
};

export { 
  db,
  searchStartsWith,
  searchContains,
  createQuery,
  createOptimizedQuery,
};