import { RateLimitConfig } from './ratelimit.interface';

export default interface RateLimitOption {
    [key: string]: RateLimitConfig;
}