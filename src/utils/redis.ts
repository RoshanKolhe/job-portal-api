import Redis from 'ioredis';

export const redisClient = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
});

redisClient.on('connect', () => {
    console.log('✅ Redis connected for rate limiting');
});

redisClient.on('error', (err : any) => {
    console.error('❌ Redis error:', err);
});
