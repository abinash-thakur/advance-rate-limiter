import slidingWindow from '../../../utils/helper/sliding-window';
import { Request, Response, NextFunction } from 'express';
import { RateLimitConfig } from '../interface/ratelimit.interface';
import rateLimitConfigSchema from '../validator/rate-limiter.validator';
import { NotAcceptableError } from '../../../utils/errors/api-errors/NotAcceptableError';
import { RATE_LIMIT_TYPE } from '../../../utils/enums/rate-limit-types.enum';

export default function globalRateLimiter(rateLimitConfigData: RateLimitConfig) {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            // Get the IP address from the request
            const userIp = req.ip!;
            const route = RATE_LIMIT_TYPE.GLOBAL_RATE_LIMIT;

            // If no rate limit is set for the route, skip the rate limiter
            if (!rateLimitConfigData) {
                return next();
            }

            //Joi Validation
            const { error } = rateLimitConfigSchema.validate(rateLimitConfigData);
            if (error) {
                throw new NotAcceptableError(`Invalid rate limit configuration for route: ${route} - ${error.message}`);
            }

            await slidingWindow(next, rateLimitConfigData, userIp, route);
        } catch (error) {
            next(error);
        }
    };
}
