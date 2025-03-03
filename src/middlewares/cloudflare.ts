import { ExecutionContext, ExportedHandlerFetchHandler } from '@cloudflare/workers-types';
import { idempotent, } from '../core';
import { IdempotencyStorage } from '../types';

export function withIdempotency(storage: IdempotencyStorage) {
  return (handler: ExportedHandlerFetchHandler) => {
    return async (request, env, ctx: ExecutionContext) => {
      return idempotent({
        storage,
        request,
        handler: async () => {
          return await handler(request, env, ctx);
        }
      });
    };
  };
}