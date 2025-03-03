
import { NextFunction } from 'express';
import { idempotent, } from '../core';
import { IdempotencyStorage } from '../types';
import { Request, Response } from 'express';

export function createIdempotencyMiddleware(storage: IdempotencyStorage) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await idempotent({
        storage,
        request: new Request(req.url, {
          method: req.method,
          headers: req.headers as HeadersInit,
          body: req.body
        }),
        handler: async () => {
          return new Promise((resolve) => {
            const originalSend = res.send;
            res.send = function (body: any) {
              originalSend.call(res, body);
              return res;
            };
            next();
          });
        }
      });

      if (res.headersSent) return;
      res.send(result);
    } catch (error) {
      next(error);
    }
  };
}