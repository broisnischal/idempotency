export interface StorageAdapterOptions {
  prefix?: string;
}


/**
 * Generate a key from a request.
 *
 * This function returns a string that uniquely identifies the
 * request. This is done by concatenating the request method,
 * URL, and request body.
 *
 * @param request - The request to generate the key for.
 * @returns A string that uniquely identifies the request.
 */
async function createKeyFromRequest(request: Request) {
  const body = await request.text();
  return `${request.method}-${request.url}-${body}`;
}

export { InMemoryStorage } from './inMemoryStorage';
export { RedisStorage } from './redisStorage';
export { CloudflareKVStorage } from './cloudflareKV';
export { BrowserStorage } from './browser';
