import { IdempotencyStorage } from "../types";

export class InMemoryStorage implements IdempotencyStorage {

  private store = new Map<string, { value: any; expires?: number }>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (entry.expires && entry.expires < Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const expires = ttl ? Date.now() + ttl * 1000 : undefined;
    this.store.set(key, { value, expires });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }


}