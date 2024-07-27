import { NextFunction } from "express";
import { AccessForbiddenError, InternalServerError } from "../errors";
import { getRedisClient } from "../../config/redisClient";
import { RateLimitConfig } from "../interface/ratelimit.interface";
import { RATE_LIMIT_TYPE } from "../enums/rate-limit-types.enum";

export default async function slidingWindow(next : NextFunction, rateLimitConfig : RateLimitConfig, rateLimitKey : string, route : string){
    try{
        const { limit, windowTime } = rateLimitConfig;
        const client = getRedisClient();

        const currentTime = Math.floor(Date.now() / 1000);
        const currentWindowStart = Math.floor(currentTime / windowTime) * windowTime;
        const previousWindowStart = currentWindowStart - windowTime;

        const keys = [
            `${RATE_LIMIT_TYPE.RATE_LIMIT_CURRENT}:${rateLimitKey}:${route}:${currentWindowStart}`,
            `${RATE_LIMIT_TYPE.RATE_LIMIT_PREVIOUS}:${rateLimitKey}:${route}:${previousWindowStart}`,
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
    }
    catch(error){
        next(error);
    }
}