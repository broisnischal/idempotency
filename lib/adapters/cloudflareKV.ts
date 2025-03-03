import { StorageAdapterOptions } from ".";
import { IdempotencyStorage } from "../types";
import { KVNamespace } from "@cloudflare/workers-types";

export class CloudflareKVStorage implements IdempotencyStorage {
  constructor(
    private kv: KVNamespace,
    private options: StorageAdapterOptions = {}
  ) { }

  async get<T>(key: string): Promise<T | null> {
    const prefixedKey = this.prefixKey(key);
    return this.kv.get<T>(prefixedKey, 'json');
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const prefixedKey = this.prefixKey(key);
    await this.kv.put(prefixedKey, JSON.stringify(value), {
      expirationTtl: ttl
    });
  }

  async delete(key: string): Promise<void> {
    await this.kv.delete(this.prefixKey(key));
  }

  private prefixKey(key: string): string {
    return `${this.options.prefix || 'idemp:'}${key}`;
  }
}