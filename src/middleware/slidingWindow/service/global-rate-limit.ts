import slidingWindow from '../../../utils/helper/sliding-window';
import RateLimitOption from '../interface/ratelimitOption.interface';
import { Request, Response, NextFunction } from 'express';
import rateLimitConfigSchema from '../validator/rate-limiter.validator';
import { NotAcceptableError } from '../../../utils/errors/api-errors/NotAcceptableError';

export default function rateLimiter(rateLimits: RateLimitOption) {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            // Get the IP address from the request
            const userIp = req.ip!;
            const route = req.originalUrl.split('?')[0]; // Get the API endpoint
            const rateLimitConfig = rateLimits[route];

            //Joi Validation
            const { error } = rateLimitConfigSchema.validate(rateLimitConfig);
            if (error) {
                throw new NotAcceptableError(`Invalid rate limit configuration for route: ${route} - ${error.message}`);
            }

            // If no rate limit is set for the route, skip the rate limiter
            if (!rateLimitConfig) {
                return next();
            }

            await slidingWindow(next, rateLimitConfig, userIp, route);
        } catch (error) {
            next(error);
        }
    };
}
