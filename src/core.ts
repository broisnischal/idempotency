import { IdempotencyOptions } from "./types";

export async function idempotent<T>(options: IdempotencyOptions<T>): Promise<T> {
  const { storage, handler, request, ttl = 3600 } = options; // 3600 seconds = 1 hour
  const key = options.key ?? generateKey(request);

  const existing = await storage.get<T>(key);
  if (existing) return existing;

  const lockKey = `${key}:lock`;
  if (await storage.get(lockKey)) {
    throw new Error('Concurrent request detected');
  }

  try {
    await storage.set(lockKey, true, 60);

    const result = await handler();

    await storage.set(key, result, ttl);
    return result;
  } finally {
    await storage.delete(lockKey);
  }
}

function generateKey(request: Request): string {
  return request.headers.get('Idempotency-Key') || crypto.randomUUID();
}