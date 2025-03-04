const express = require("express");
const router = express.Router();
const axios = require("axios");
const Redis = require("ioredis");

// Function to create Redis client
const createRedisClient = () => {
  const host = process.env.REDIS_HOST || "localhost";
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
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const url = `${process.env.CAMPAY_BASE_URL}/api/token/`;

  const data = {
    username: process.env.CAMPAY_APP_USERNAME,
    password: process.env.CAMPAY_APP_PASSWORD,
  };

  try {
    // Check if token is already cached
    const cachedToken = await redis.get("campay_token");
    if (cachedToken) {
      console.log("Returning cached token");
      return res.json({ token: cachedToken });
    }

    console.log("Fetching new token...");
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const token = response.data.token;

    // Store token in Redis with an expiration time (e.g., 3600 seconds = 1 hour)
    await redis.set("campay_token", token, "EX", 3600);

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching token:", error.message);
    res.status(500).json({ error: "Failed to fetch token" });
  }
});

router.post("/payment-link", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    // Retrieve the token from Redis
    const token = await redis.get("campay_token");
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const url = `${process.env.CAMPAY_BASE_URL}/api/get_payment_link/`;

    // Prepare the data for the API request
    const data = {
      amount: req.body.amount || "5",
      currency: req.body.currency || "XAF",
      description: req.body.description || "Test",
      external_reference: req.body.external_reference || "",
      redirect_url: req.body.redirect_url || "https://example.com",
    };

    // Make the API request
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Send the response from the external API back to the client
    res.json(response.data);
  } catch (error) {
    // Handle errors and send a response
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res.status(error.response ? error.response.status : 500).json({
      error: error.response ? error.response.data : "Internal Server Error",
    });
  }
});

module.exports = router;
