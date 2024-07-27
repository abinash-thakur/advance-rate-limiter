import { RateLimitConfig } from '../../middleware/slidingWindow/interface/ratelimit.interface';

export default interface RateLimitOption {
    [key: string]: RateLimitConfig;
}