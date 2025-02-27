const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const router = express.Router();

const { body, validationResult } = require("express-validator");
const Subscription = require("../models/subscription");
const LoginAttempt = require("../models/loginAttempts");

router.post(
  "/register",
  [
    // Validate fields with express-validator
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Email must be valid").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
    body("dob").notEmpty().withMessage("Date of birth is required"),
    body("gender").notEmpty().withMessage("Gender is required"),
    body("occupation").notEmpty().withMessage("Occupation is required"),
    body("country").notEmpty().withMessage("Country is required"),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Format errors as { field: "error message" }
      const formattedErrors = {};
      errors.array().forEach((err) => {
        formattedErrors[err.param] = err.msg;
      });
      return res.status(400).json({ errors: formattedErrors });
    }

    try {
      const {
        fullName,
        email,
        password,
        dob,
        gender,
        occupation,
        institution,
        country,
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res
          .status(400)
          .json({ errors: { email: "Email already in use" } });
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        dob,
        gender,
        occupation,
        institution,
        country,
      });

      await Subscription.create({ userId: user.id });

      // Set user info in session (excluding sensitive data)
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
  }
);

const getIpAddress = (req) =>
  req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = getIpAddress(req);
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    await LoginAttempt.create({ email, ipAddress, status: "success" });

    // Create a session (store minimal user info)
    req.session.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    };

    res.status(200).json({
      message: "Logged in successfully",
      user: req.session.user,
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
});

// A protected route to fetch user profile
router.get("/profile", async (req, res) => {
  try {
    const { email } = req.session.user;
    if (!email) {
      console.log("No email", req.body);
      return res.status(400).json({ error: "Email is required" });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    res.status(200).json({
      id: user.id,
      name: user.fullName,
      email: user.email,
      phone: user.phone,
      country: "China",
      joinedDate: "2023-07-15T08:30:00Z",
      verificationLevel: "basic",
      avatarUrl: "",
      twoFactorEnabled: false,
      lastLogin: "2025-02-18T16:42:31Z",
      preferredCurrency: "XCoin",
      language: "English",
      notifications: {
        email: true,
        sms: true,
        push: false,
        marketingEmails: false,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error", details: error.message });
  }
});

router.get("/verify", (req, res) => {
  if (req.session && req.session.user) {
    return res.status(200).json({ user: req.session.user });
  }
  res.status(401).json({ error: "Unauthorized" });
});

// Logout route to destroy session
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
});

module.exports = router;
