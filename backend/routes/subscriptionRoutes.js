const express = require("express");
const Subscription = require("../models/subscription"); // Adjust path as needed
const dayjs = require("dayjs");

const router = express.Router();

// Default rates by subscription type
const defaultRates = {
  standard: 10.5,
  premium: 9.0,
  business: 6.2,
};

/**
 * Create a new subscription for a user
 * @route POST /subscriptions
 */
router.post("/create", async (req, res) => {
  try {
    const { subscriptionType = "standard", trialDays = 14 } = req.body;
    const { id } = req.session.user;

    // Check if a subscription already exists for the user
    const existingSubscription = await Subscription.findOne({
      where: { userId: id },
    });
    if (existingSubscription) {
      return res.status(400).json({ error: "User already has a subscription" });
    }

    // Get the default rate for the subscription type
    const rate = defaultRates[subscriptionType] || 1.0;

    // For free standard subscriptions, no trial period is needed
    let trialStart = null;
    let trialEnd = null;
    if (subscriptionType !== "standard") {
      trialStart = new Date();
      trialEnd = new Date(trialStart);
      trialEnd.setDate(trialEnd.getDate() + trialDays);
    }

    const subscription = await Subscription.create({
      userId,
      subscriptionType,
      trialStart,
      trialEnd,
      rate,
      status: "active",
    });

    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get a user's subscription
 * @route GET /subscriptions/:userId
 */
router.get("/", async (req, res) => {
  try {
    const { id } = req.session.user;
    const subscription = await Subscription.findOne({ where: { userId: id } });
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update subscription status (mark as expired if trial period has ended)
 * @route PATCH /subscriptions/:userId/status
 */
router.patch("/status", async (req, res) => {
  try {
    const { id } = req.session.user;
    const subscription = await Subscription.findOne({ where: { userId } });
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    const now = new Date();
    // For non-standard subscriptions, check if the trial period has ended
    if (
      subscription.trialEnd &&
      now > subscription.trialEnd &&
      subscription.status === "active"
    ) {
      subscription.status = "expired";
      await subscription.save();
    }
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Renew subscription by extending the trialEnd date
 * @route PATCH /subscriptions/:userId/renew
 */
router.patch("/renew", async (req, res) => {
  try {
    const { id } = req.session.user;
    const { months = 1, paymentDetails } = req.body;
    const subscription = await Subscription.findOne({ where: { userId: id } });
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    // For renewal, only update if there is an existing trialEnd date
    const currentEnd = subscription.trialEnd
      ? new Date(subscription.trialEnd)
      : new Date();
    const newEnd = dayjs(currentEnd).add(months, "month").toDate();

    subscription.trialEnd = newEnd;
    subscription.status = "active";
    subscription.paymentDetails = paymentDetails;
    await subscription.save();

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Upgrade subscription type for a user
 * @route PATCH /subscriptions/:userId/upgrade
 */
router.patch("/upgrade", async (req, res) => {
  try {
    const { id } = req.session.user;
    const { newSubscriptionType } = req.body;
    if (!["standard", "premium", "business"].includes(newSubscriptionType)) {
      return res.status(400).json({ error: "Invalid subscription type" });
    }

    const subscription = await Subscription.findOne({ where: { userId: id } });
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    // Update the subscription type and corresponding rate
    subscription.subscriptionType = newSubscriptionType;
    subscription.rate = defaultRates[newSubscriptionType] || subscription.rate;
    subscription.status = "active";

    // For upgraded plans (non-standard), start a new trial period if needed.
    if (newSubscriptionType !== "standard") {
      const trialStart = new Date();
      const trialEnd = new Date(trialStart);
      trialEnd.setDate(trialEnd.getDate() + 14); // You can customize the trial period here
      subscription.trialStart = trialStart;
      subscription.trialEnd = trialEnd;
    } else {
      // For standard/free plan, clear any trial period.
      subscription.trialStart = null;
      subscription.trialEnd = null;
    }

    await subscription.save();
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Cancel subscription (mark as expired)
 * @route DELETE /subscriptions/:userId/cancel
 */
router.delete("/cancel", async (req, res) => {
  try {
    const { id } = req.session.user;
    const subscription = await Subscription.findOne({ where: { userId: id } });
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    subscription.status = "expired";
    await subscription.save();
    res.json({ message: "Subscription canceled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
