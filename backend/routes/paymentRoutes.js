const express = require("express");
const router = express.Router();
const axios = require("axios");
const Redis = require("ioredis");

// Function to create Redis client
const createRedisClient = () => {
  const host =
    process.env.REDIS_HOST ||
    "https://xcoin-transfer-gwatqz.serverless.use1.cache.amazonaws.com";
  const port = Number(process.env.REDIS_PORT) || 6379;
  const password = process.env.REDIS_PASSWORD || null;

  return new Redis({
    host,
    port,
    password,
  });
};

let redis;

try {
  redis = createRedisClient();
  console.log("Connected to Redis successfully.");
} catch (error) {
  console.error("Failed to connect to Redis. Using fallback Redis server...");

  // Fallback connection
  redis = new Redis({
    host: "3.236.245.162", // Fallback Redis server
    port: 6379,
    password: "adminpass123",
  });
}

router.post("/token", async (req, res) => {
  const username = process.env.CAMPAY_APP_USERNAME;
  const password = process.env.CAMPAY_APP_PASSWORD;

  try {
    // Check if token is already cached
    const cachedToken = await redis.get("campay_token");
    if (cachedToken) {
      console.log("Returning cached token");
      return res.json({ token: cachedToken });
    }

    // If not cached, fetch a new token
    const response = await axios.post(
      `${process.env.CAMPAY_BASE_URL}/api/token`,
      {
        username,
        password,
      }
    );

    const token = response.data.token;

    // Store token in Redis with an expiration time (e.g., 3600 seconds = 1 hour)
    await redis.set("campay_token", token, "EX", 3600);

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching token:", error.message);
    res.status(500).json({ error: "Failed to fetch token" });
  }
});

module.exports = router;
