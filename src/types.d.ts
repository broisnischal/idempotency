

export interface IdempotencyOptions<T = unknown> {
  ttl?: number;
  key?: string;
  storage: IdempotencyStorage;
  request: Request;
  handler: () => Promise<T>;
  onCacheHit?: (data: T) => void;
  onCacheMiss?: (data: T) => void;
  onError?: (error: Error) => void;
  onSuccess?: (data: T) => void;
  onRequest?: (request: Request) => void;
  onResponse?: (response: Response) => void;
}

export interface IdempotencyStorage {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface IdempotencyResult<T> {
  type: 'cache-hit' | 'cache-miss';
  data: T;
}