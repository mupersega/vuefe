// db.ts
import Dexie, { type EntityTable } from 'dexie';
import type { InvTypeShortDto } from '../api-client';
import apiService from './apiService';

const db = new Dexie('dexDb') as Dexie & {
  invTypeShorts: EntityTable<
    InvTypeShortDto
  >;
};


db.version(1).stores({
  invTypeShorts: 'typeId, typeName'
});

db.open().then(() => {
  console.log('Database opened successfully');
    seed();
}).catch((error) => {
    console.error('Failed to open database:', error);
});

async function seed() {
    if (await db.invTypeShorts.count() === 0) {
        console.log("Database already seeded");
        apiService.getInvTypes().then((invTypeShorts: InvTypeShortDto[]) => {
            db.invTypeShorts.bulkPut(invTypeShorts);
        }).catch((error) => {
            console.error("Error seeding database:", error);
        });
    }
}

function searchInvTypeShortsStartsWith(
  search: string,
  limit: number
): Promise<InvTypeShortDto[]> {
  return db.invTypeShorts
    .where('typeName')
    .startsWithIgnoreCase(search)
    .limit(limit)
    .toArray();
}

function searchInvTypeShortsContains(
  search: string,
  limit: number
): Promise<InvTypeShortDto[]> {
  const lowerSearch = search.toLowerCase();

  return db.invTypeShorts
    .toArray()
    .then((items) =>
      items
        .filter(item => item.typeName?.toLowerCase().includes(lowerSearch))
        .slice(0, limit)
    );
}

export { db, searchInvTypeShortsStartsWith, searchInvTypeShortsContains };