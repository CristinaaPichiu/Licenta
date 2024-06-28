import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface MyDB extends DBSchema {
  jobs: {
    key: string;
    value: any;
  };
}

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private dbPromise: Promise<IDBPDatabase<MyDB>>;

  constructor() {
    this.dbPromise = openDB<MyDB>('jobDatabase', 1, {
      upgrade(db) {
        db.createObjectStore('jobs');
      }
    });
  }

  async set(key: string, value: any): Promise<void> {
    const db = await this.dbPromise;
    await db.put('jobs', value, key);
  }

  async get(key: string): Promise<any> {
    const db = await this.dbPromise;
    return db.get('jobs', key);
  }

  async delete(key: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('jobs', key);
  }
}
