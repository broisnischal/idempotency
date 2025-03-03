// import { Request, Response, NextFunction } from 'express';
// import { idempotent, } from '../core';
// import { IdempotencyStorage } from '../types';

// export function createIdempotencyMiddleware(storage: IdempotencyStorage) {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const result = await idempotent({
//         storage,
//         request: new Request(req.url, {
//           method: req.method,
//           headers: req.headers as HeadersInit,
//           body: req.body
//         }),
//         handler: async () => {
//           return new Promise((resolve) => {
//             const originalSend = res.send;
//             res.send = (body: any) => {
//               originalSend.call(res, body);
//               return resolve(body);
//             };
//             next();
//           });
//         }
//       });

//       if (res.headersSent) return;
//       res.send(result);
//     } catch (error) {
//       next(error);
//     }
//   };
// }