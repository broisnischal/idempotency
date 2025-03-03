import Redis from 'ioredis';
import { RedisStorage, createIdempotencyMiddleware, } from '../../dist/index'

import express from 'express';

const redis = new Redis();

const storage = new RedisStorage(redis,);

const app = express();

app.use(createIdempotencyMiddleware(storage));

app.get('/payments', async (req, res) => {
  // Your business logic


  res.send('Hello World');

});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});