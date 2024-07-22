import { getRedisClient } from '../config/redisClient';
import { AccessForbiddenError, InternalServerError } from '../utils/errors';
import RateLimitOption from '../utils/interface/ratelimitOption.interface';
import { Request, Response, NextFunction } from 'express';

export default function rateLimiter(rateLimits: RateLimitOption) {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            // Get the IP address from the request
            const userIp = req.ip;
            const route = req.originalUrl.split('?')[0]; // Get the API endpoint
            const rateLimitConfig = rateLimits[route];

            // If no rate limit is set for the route, skip the rate limiter
            if (!rateLimitConfig) {
                return next();
            }

            const { limit, windowTime } = rateLimitConfig;
            const client = getRedisClient();

            const currentTime = Math.floor(Date.now() / 1000);
            const currentWindowStart = Math.floor(currentTime / windowTime) * windowTime;
            const previousWindowStart = currentWindowStart - windowTime;

            const keys = [
                `rateLimiterCurrent:${userIp}:${route}:${currentWindowStart}`,
                `rateLimiterPrevious:${userIp}:${route}:${previousWindowStart}`,
            ];

            // Use a MULTI transaction
            const multi = client.multi();

            multi.incr(keys[0]);
            multi.expire(keys[0], 2 * windowTime);
            multi.get(keys[0]);
            multi.get(keys[1]);

            const rateLimitData = await multi.exec();
            if (!rateLimitData) {
                throw new InternalServerError('(RATELIMITER)::Some Error Occurs In RateLimiter!!');
            }

            const currentWindowCount = parseInt(String(rateLimitData[2]));
            const prevWindowCount = parseInt(String(rateLimitData[3])) || 0;

            if (currentWindowCount > limit) {
                await client.set(keys[0], limit);
                await client.expire(keys[0], 2 * windowTime);
            }

            const timeElapsedInCurrentWindow = currentTime - currentWindowStart;
            const weightedCount =
                ((windowTime - timeElapsedInCurrentWindow) / windowTime) * prevWindowCount + currentWindowCount;

            if (weightedCount > limit) {
                throw new AccessForbiddenError('(RATELIMITER)::Rate limit exceeded. Please try again later');
            } else {
                next();
            }
        } catch (error) {
            next(error);
        }
    };
}
