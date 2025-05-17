// db.ts
import Dexie, { type EntityTable } from 'dexie';
import type { InvTypeShortDto, BlueprintDto} from '../api-client';
import apiService from './apiService';

const db = new Dexie('dexDb') as Dexie & {
  invTypeShorts: EntityTable<
    InvTypeShortDto
  >;
  blueprints: EntityTable<
    BlueprintDto
  >;
};

db.version(1).stores({
  invTypeShorts: 'typeId, typeName',
  blueprints: 'productId, blueprintId, activityId, categoryId, groupId',
},);

db.open().then(() => {
  console.log('Database opened.');
  seed();
  
}).catch((error) => {
    console.error('Failed to open database:', error);
});

async function seed() {
    let counter = 0;
    if (await db.invTypeShorts.count() === 0) {
        console.log("Seeding InvTypeShorts...");
        apiService.getInvTypes().then(async (invTypeShorts: InvTypeShortDto[]) => {
            db.invTypeShorts.bulkPut(invTypeShorts);
            const rowCount = await db.invTypeShorts.count();
            console.log('✓', rowCount, 'InvTypeShorts seeded.');
            counter += 1;
            if (counter === 2) {
              console.log("✓ DB setup complete");
            }
        }).catch((error) => {
            console.error("Error seeding database:", error);
        });
    } else {
        console.log("InvTypeShorts exists, skipping seed...");
    }
    if (await db.blueprints.count() === 0) {
        console.log("Seeding Blueprints...");
        apiService.getBlueprints().then(async (blueprints: BlueprintDto[]) => {
            db.blueprints.bulkPut(blueprints);
            const rowCount = await db.blueprints.count();
            console.log('✓', rowCount, 'Blueprints seeded.');
            counter += 1;
            if (counter === 2) {
              console.log("✓ IndexedDB setup complete.");
            }
        }).catch((error) => {
            console.error("Error seeding database:", error);
        });
    } else {
        console.log("Blueprints exists, skipping seed...");
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

// Keep the original functions for backward compatibility
function searchInvTypeShortsStartsWith(
  search: string,
  limit: number
): Promise<InvTypeShortDto[]> {
  return searchStartsWith(db.invTypeShorts, 'typeName', search, limit);
}

function searchInvTypeShortsContains(
  search: string,
  limit: number
): Promise<InvTypeShortDto[]> {
  return searchContains(db.invTypeShorts, 'typeName', search, limit);
}

export { 
  db, 
  searchInvTypeShortsStartsWith, 
  searchInvTypeShortsContains,
  searchStartsWith,
  searchContains
};