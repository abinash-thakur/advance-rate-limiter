## advance-rate-limiter
- **sliding window counter algorithm is used**

![npm](https://img.shields.io/npm/v/advance-rate-limiter)
![license](https://img.shields.io/badge/license-MIT-green)
![npm](https://img.shields.io/npm/v/rate-limiter)
![npm](https://img.shields.io/npm/dw/rate-limiter)

**`advance-rate-limiter`** is a sophisticated middleware for Express.js applications that provides rate limiting using Redis and a sliding window counter algorithm. Configure rate limits dynamically through a JSON file and integrate seamlessly into your Express application.

## 🚀 Features

-   \*\*Dynamic Rate Limiting: Configure rate limits for different endpoints using a JSON configuration file.
-   \*\*Sliding Window Algorithm: Implement precise rate limiting with the sliding window approach.
-   \*\*Redis Integration: Utilize Redis for efficient request tracking and storage.
-   \*\*Flexible Setup: Easily configure Redis and apply rate limiting in your Express app.

## 📦 Installation

Install advance-rate-limiter via npm:

```bash
npm install advance-rate-limiter
```

## 🛠️ Setup and Configuration

1. Initialize Redis Client

## 📋 Redis Configuration

To set up the Redis client with the `advance-rate-limiter` package, use the following code:

```typescript
import { setupRedisClient } from 'advance-rate-limiter';

// Configuration object for Redis
const redisConfig = {
    host: 'your-redis-host',
    port: 6379, // Default Redis port
    password: 'your-redis-password', // Optional: Include if your Redis instance requires authentication
};

// Initialize Redis client with the configuration
setupRedisClient(redisConfig);
```

2. Configure Rate Limits
   Create a rateLimitConfig.json file in your project’s root directory. Define your rate limits for different endpoints as follows:

```json
{
    "/api/endpoint1": { "limit": 2, "windowTime": 60 }, // 2 requests per minute
    "/api/endpoint2": { "limit": 5, "windowTime": 120 } // 5 requests per 2 minutes
}
```

3. Apply Middleware
   Use the rateLimiter middleware in your Express application by passing the rate limit configuration loaded from the JSON file.

```typescript
import express from 'express';
import rateLimiter, { setupRedisClient } from 'advance-rate-limiter';
import * as fs from 'fs';
import * as path from 'path';

const app = express();

// Load rate limit configuration from JSON file
const rateLimitConfigPath = path.join(__dirname, 'rateLimitConfig.json');
const rateLimitConfig = JSON.parse(fs.readFileSync(rateLimitConfigPath, 'utf8'));

// Initialize Redis client
const redisConfig = {
    host: 'your-redis-host',
    port: 6379,
    password: 'your-redis-password',
};

setupRedisClient(redisConfig);

// Apply rate limiter middleware
app.use(rateLimiter(rateLimitConfig));

app.get('/api/endpoint1', (req, res) => {
    res.send('API endpoint 1 is working');
});

app.get('/api/endpoint2', (req, res) => {
    res.send('API endpoint 2 is working');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
```

## ⚙️ Options
- **rateLimits:** An object or JSON file defining rate limits for different routes.
    - **Key:** The API endpoint (e.g., /api/endpoint1).
    - **Value:** An object with limit (maximum number of requests) and windowTime (time window in seconds).

- **redisConfig:** Configuration object for Redis.
    - **host:** The Redis server hostname.
    - **port:** The Redis server port (default is 6379).
    - **password:** Optional Redis password.

## 🔍 Keywords

- Express Rate Limiter
- Redis Rate Limiting
- Sliding Window Algorithm
- API Rate Limiting Middleware
- Express Middleware

## 📈Metrics

- NPM Downloads:
- Version:
- License:

## 🧪 Testing

To run the tests for this package, ensure you have **`jest`** installed and run:
npm test

## 📜 License

This project is licensed under the MIT License.
