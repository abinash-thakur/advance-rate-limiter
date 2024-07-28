## advance-rate-limiter
- **sliding window counter algorithm is used**

![npm](https://img.shields.io/npm/v/advance-rate-limiter)
![license](https://img.shields.io/badge/license-MIT-green)
![npm](https://img.shields.io/npm/v/rate-limiter)
![npm](https://img.shields.io/npm/dw/rate-limiter)

**`advance-rate-limiter`** is a sophisticated middleware for Express.js applications that provides rate limiting using Redis and a sliding window counter algorithm. Configure rate limits dynamically through a JSON file and integrate seamlessly into your Express application.

## 🚀 Features

-   **Dynamic Rate Limiting:** Configure rate limits for different endpoints using a JSON configuration file.
-   **Sliding Window Algorithm:** Implement precise rate limiting with the sliding window approach.
-   **Redis Integration:** Utilize Redis for efficient request tracking and storage.
-   **Flexible Setup:** Easily configure Redis and apply rate limiting in your Express app.

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
    port: 'your-redis-port',
    password: 'your-redis-password', // Optional: Include if your Redis instance requires authentication
};

// Initialize Redis client with the configuration
setupRedisClient(redisConfig);
```

2. Configure Rate Limits
   Create a rateLimitConfig.json file in your project’s root directory. Define your rate limits for different endpoints as follows:
**for `rateLimiter` method**
```json
{
    "/api/endpoint1": { "limit": 2, "windowTime": 60 }, // 2 requests per minute
    "/api/endpoint2": { "limit": 5, "windowTime": 120 } // 5 requests per 2 minutes
}
```
**for `globalRateLimiter` method**
```json
{
    "limit": 10, // allow 10 request
    "windowTime" : 60 // time limit is 1 minutes
}
```

3. Apply Middleware for rateLimiter
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
    port: 'your-redis-port',
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
4. Apply middleware for globalRateLimiter

```typescript
import express from 'express';
import { setupRedisClient, globalRateLimiter } from 'advance-rate-limiter';
import globalRateLimitConfig from './globalRateLimitConfig.json' assert {type : 'json'};


const app = express();


console.log("this is rate-limit- config", globalRateLimitConfig);

// Initialize Redis client
const redisConfig = {
    host: 'your-redis-host',
    port: 'your-redis-port',
    password: 'your-redis-password',
};

setupRedisClient(redisConfig);

// Apply rate limiter middleware
app.use(globalRateLimiter(globalRateLimitConfig));

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


## functions

## Configuration Details

| Function         | Configuration                                                                                                                                                    | Remark                                                                                                                                                           |
|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `setupRedisClient`  | ```{ host: 'your-redis-host', port: 'your-redis-port', password: 'your-redis-password' }``` | Sets up the Redis connection. Include the `password` field if your Redis instance requires authentication.                                                      |
| `rateLimiter`       | ```{ "/api/endpoint1": { "limit": 2, "windowTime": 60 }, "/api/endpoint2": { "limit": 5, "windowTime": 120 } }```           | 1. **/api/endpoint1**: Allows a maximum of 2 requests per minute (60 seconds). <br> 2. **/api/endpoint2**: Allows a maximum of 5 requests per 2 minutes (120 seconds). <br><br> These rate limits help prevent abuse by limiting the number of requests that can be made to each endpoint within a specified time window. |
| `globalRateLimiter` | ```{ "limit": 10, "windowTime" : 60 }``` | 1. **limit**: The total number of requests allowed. <br> 2. **windowTime**: The time frame (in seconds) within which the specified number of requests is allowed. <br> This global rate limit applies across your entire project if implemented at the entry point of your application (e.g., in the `index.js` file). |