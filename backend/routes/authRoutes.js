const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const { verifyToken } = require("../services/authToken");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// User Registration
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // Set user info in session (without sensitive data)
    req.session.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    };

    res.status(201).json({
      message: "User registered and logged in successfully.",
      user: req.session.user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Registration failed", details: error.message });
  }
});

// Login route: verify credentials and create session
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Set user info in session
    req.session.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    };

    res.json({ message: "Login successful", user: req.session.user });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
});

// Logout route: destroy the session
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // clear the session cookie
    res.json({ message: "Logged out successfully" });
  });
});

// Example protected route
router.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "You have access to this protected route",
    user: req.session.user,
  });
});

module.exports = router;
