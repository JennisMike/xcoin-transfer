const express = require("express");
const { v4: uuidv4 } = require("uuid");
const Transaction = require("../models/transaction");
const { Op } = require("sequelize");
const { encryptResponse } = require("../services/crypto");
const Subscription = require("../models/subscription");

const router = express.Router();

// Create a new transaction
router.post("/create", async (req, res) => {
  try {
    const {
      user_id,
      type,
      amount,
      currency,
      targetAmount,
      targetCurrency,
      fee,
      status,
      reference,
      description,
    } = req.body;

    if (
      !user_id ||
      !type ||
      !amount ||
      !currency ||
      !fee ||
      !status ||
      !reference
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const transaction = await Transaction.create({
      id: uuidv4(),
      user_id,
      type,
      amount,
      currency,
      targetAmount,
      targetCurrency,
      fee,
      status,
      reference,
      description,
    });

    return res.status(201).json(encryptResponse(transaction));
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating transaction", details: error.message });
  }
});

// Get all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res.json(transactions);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching transactions", details: error.message });
  }
});

// Get a transaction by ID
router.get("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    return res.status(200).json(encryptResponse(transaction));
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching transaction", details: error.message });
  }
});

// Update a transaction
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    await transaction.update({ status });

    return res.json(encryptResponse(transaction));
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating transaction", details: error.message });
  }
});

// Delete a transaction
router.delete("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    await transaction.destroy();
    return res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting transaction", details: error.message });
  }
});

router.post("/request", async (req, res) => {
  try {
    // Get the user from the session
    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Retrieve the user's subscription record
    const subscription = await Subscription.findOne({
      where: { userId: user.id },
    });
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    const {
      amount,
      fromCurrency,
      toCurrency,
      convertedAmount,
      username,
      phoneNum,
    } = req.body;

    // Validate the required fields
    if (
      amount === undefined ||
      !fromCurrency ||
      !toCurrency ||
      convertedAmount === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("Testing...");

    const conversionAmount = parseFloat(amount);
    console.log(conversionAmount);

    if (subscription.balance < conversionAmount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Deduct the conversion amount from the user's balance
    subscription.balance -= conversionAmount;
    await subscription.save();

    // Generate a unique external reference
    const externalReference = uuidv4();

    // Calculate fee if applicable. Adjust the fee logic as needed.
    const fee = subscription.fee || 0;

    // Create a new conversion transaction record
    const transaction = await Transaction.create({
      type: "request",
      amount: conversionAmount, // XCoin amount to be converted
      currency: fromCurrency,
      targetAmount: convertedAmount,
      targetCurrency: toCurrency,
      fee: fee,
      phone: phoneNum,
      status: "pending",
      external_reference: externalReference,
      description: "XCoin conversion",
      username: username,
      userId: user.id,
    });

    return res
      .status(200)
      .json({ transaction, newBalance: subscription.balance });
  } catch (error) {
    console.error("Error during conversion:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
