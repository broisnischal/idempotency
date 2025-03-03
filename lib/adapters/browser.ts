import { IdempotencyStorage } from "../types";

interface BrowserStorageOptions {
  dbName?: string;
  storeName?: string;
  ttl?: number;
}

export class BrowserStorage implements IdempotencyStorage {
  private dbPromise: Promise<IDBDatabase>;
  private storeName: string;
  private ttl: number;

  constructor(options: BrowserStorageOptions = {}) {
    this.storeName = options.storeName || 'idempotency';
    this.ttl = options.ttl || 3600;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(
        options.dbName || 'idempotencyDB',
        1
      );

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, {
            keyPath: 'key'
          });
          store.createIndex('expires', 'expires', { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async getStore(mode: IDBTransactionMode = 'readonly') {
    const db = await this.dbPromise;
    return db.transaction(this.storeName, mode).objectStore(this.storeName);
  }

  async get<T>(key: string): Promise<T | null> {
    const store = await this.getStore();
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => {
        const result = request.result;
        if (!result) return resolve(null);

        // Auto-clean expired entries
        if (result.expires && result.expires < Date.now()) {
          this.delete(key);
          return resolve(null);
        }

        resolve(result.value);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const store = await this.getStore('readwrite');
    const expires = Date.now() + (ttl || this.ttl) * 1000;

    return new Promise((resolve, reject) => {
      const request = store.put({
        key,
        value,
        expires
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async delete(key: string): Promise<void> {
    const store = await this.getStore('readwrite');
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // WebCrypto-based key generation
  static async generateKey(request: Request): Promise<string> {
    const headerKey = request.headers.get('Idempotency-Key');
    if (headerKey) return headerKey;

    // Generate cryptographically strong UUID v4
    return crypto.randomUUID();
  }
}