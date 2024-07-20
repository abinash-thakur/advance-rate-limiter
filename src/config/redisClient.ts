import { InternalServerError } from '../utils/errors';
import { RedisConfig } from '../utils/interface/redis.interface';
import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType;

function setupRedisClient(config: RedisConfig) {
    redisClient = createClient({
        url: `redis://${config.host}:${config.port}`,
        password: config.password,
        database: config.db,
    });

    redisClient.on('error', (_err) => {
        throw new InternalServerError('(RATELIMITER)::redis is not connected');
    });

    redisClient.connect();
}

function getRedisClient(): RedisClientType {
    if (!redisClient) {
        throw new Error('(RATELIMITER)::Redis client is not initialized. Call setupRedisClient() first.');
    }
    return redisClient;
}

export { setupRedisClient, getRedisClient };
