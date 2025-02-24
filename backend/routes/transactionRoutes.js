const express = require("express");
const { v4: uuidv4 } = require("uuid");
const Transaction = require("../models/transaction");
const { Op } = require("sequelize");

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

    res.status(201).json(transaction);
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

    res.json(transaction);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching transaction", details: error.message });
  }
});

// Update a transaction
router.put("/:id", async (req, res) => {
  try {
    const { status, description } = req.body;

    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    await transaction.update({ status, description });

    res.json(transaction);
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
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting transaction", details: error.message });
  }
});

module.exports = router;
