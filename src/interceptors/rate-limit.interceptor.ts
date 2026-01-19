import {
    globalInterceptor,
    Interceptor,
    InvocationContext,
    InvocationResult,
    Provider,
    ValueOrPromise,
} from '@loopback/core';
import { HttpErrors, RestBindings } from '@loopback/rest';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redisClient } from '../utils/redis';

const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rlflx',
    points: Number(process.env.RATE_LIMIT_POINTS) || 200,
    duration: Number(process.env.RATE_LIMIT_DURATION) || 60,
});

@globalInterceptor('', { tags: { name: 'rate-limit' } })
export class RateLimitInterceptor implements Provider<Interceptor> {
    value(): Interceptor {
        return this.intercept.bind(this);
    }

    async intercept(
        invocationCtx: InvocationContext,
        next: () => ValueOrPromise<InvocationResult>,
    ) {
        const request = await invocationCtx.get(RestBindings.Http.REQUEST);

        // ✅ Skip critical endpoints
        const skipPaths = ['/ping', '/health', '/webhook', '/sso/callback'];
        if (skipPaths.some(p => request.path.startsWith(p))) {
            return next();
        }

        const ip =
            request.headers['x-forwarded-for']?.toString().split(',')[0] ||
            request.socket.remoteAddress ||
            'unknown';

        try {
            await rateLimiter.consume(ip);
        } catch (err) {
            throw new HttpErrors.TooManyRequests(
                'Too many requests. Please try after some time.',
            );
        }

        return next();
    }
}
