// src/config/redis.config.ts
import Redis from 'ioredis';
import logger from './logger.js'; // Usa tu logger existente
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_DB } from './conf.js'

const redisClient = new Redis({
  host: REDIS_HOST || 'localhost',
  port: parseInt(REDIS_PORT || '6379', 10),
  db: parseInt(REDIS_DB || '0', 10),
  password: REDIS_PASSWORD || undefined,
  connectTimeout: 10000, // 10 segundos
  maxRetriesPerRequest: 5,
  retryStrategy: times => {
    const delay = Math.min(times * 50, 2000);
    logger.warn(`Redis: Retrying connection (${times} attempts). Delay: ${delay}ms`);
    return delay;
  },
});

redisClient.on('connect', () => logger.info('Redis client connected successfully.'));
redisClient.on('error', (err) => logger.error('Redis client error:', err));
redisClient.on('reconnecting', (delay: any) => logger.warn(`Redis client reconnecting... delay: ${delay}ms`));

export default redisClient;