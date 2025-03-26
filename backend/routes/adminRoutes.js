const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Transaction = require("../models/transaction");
const { isAdmin } = require("../middlewares/isAdmin");
const { where } = require("sequelize");
require("dotenv").config();

const router = express.Router();

// Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await User.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { admin: { id: admin.id, role: admin.role } },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Verify admin token
router.get("/auth/verify", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await User.findOne({ where: { id: decoded.admin.id } });

    if (!admin || admin.role !== "admin") {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json({ isValid: true });
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
});

// Get all transactions
router.get("/transactions", isAdmin, async (_, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { type: "convert" },
      order: [["date", "DESC"]],
    });
    console.log("Transactions", transactions);
    return res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
