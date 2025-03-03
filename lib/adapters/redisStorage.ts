import { StorageAdapterOptions } from ".";
import { IdempotencyStorage } from "../types";
import { Redis } from "ioredis";

export class RedisStorage implements IdempotencyStorage {
  constructor(
    private client: Redis,
    private options: StorageAdapterOptions = {}
  ) { }

  async get<T>(key: string): Promise<T | null> {
    const prefixedKey = this.prefixKey(key);
    const data = await this.client.get(prefixedKey);
    return data ? JSON.parse(data) : null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const prefixedKey = this.prefixKey(key);
    const serialized = JSON.stringify(value);

    if (ttl) {
      await this.client.setex(prefixedKey, ttl, serialized);
    } else {
      await this.client.set(prefixedKey, serialized);
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.del(this.prefixKey(key));
  }

  private prefixKey(key: string): string {
    return `${this.options.prefix || 'idemp:'}${key}`;
  }
}