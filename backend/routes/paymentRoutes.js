const express = require("express");
const router = express.Router();
const axios = require("axios");
const Redis = require("ioredis");
const { generatePaymentReference } = require("../services/utils");
const Transaction = require("../models/transaction");

// Function to create Redis client
const createRedisClient = () => {
  const host = process.env.REDIS_HOST || "18.212.27.82";
  const port = Number(process.env.REDIS_PORT) || 6379;
  const password = process.env.REDIS_PASSWORD || "mjlsbkCh2z8Ft63";

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
    const reference = generatePaymentReference();

    // Prepare the data for the API request
    let data = {};

    if (!req.body.amount) {
      data = {
        currency: req.body.currency || "XAF",
        description: req.body.description || "Test",
        external_reference: reference,
        redirect_url: req.body.redirect_url || "https://example.com",
      };
    } else {
      data = {
        amount: req.body.amount,
        currency: req.body.currency || "XAF",
        description: req.body.description || "Test",
        external_reference: reference,
        redirect_url: req.body.redirect_url || "https://example.com",
      };
    }

    // Make the API request
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });

    const transaction = await Transaction.create({
      type: "deposit",
      amount: data.amount,
      currency: data.currency,
      fee: 0,
      reference: data.external_reference,
      description: data.description,
      userId: req.session.user.id,
    });

    console.log("Transaction created:", transaction);
    res.json({ link: response.data.link, transaction });
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

router.get("/:id", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const transaction = await Transaction.findOne({
      where: { id: req.params.id, userId: req.session.user.id },
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/status/:id", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = await redis.get("campay_token");
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const url = `${process.env.CAMPAY_BASE_URL}/api/get_payment_status/`;
    const reference = await Transaction.findOne({ id: req.params.id })
      .reference;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: {
        external_reference: reference,
      },
    });

    res.json(response.data);
    console.log("Payment status:", response.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(error.response ? error.response.status : 500).json({
      error: error.response ? error.response.data : "Internal Server Error",
    });
  }
});

module.exports = router;
