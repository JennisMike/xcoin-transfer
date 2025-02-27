const dayjs = require("dayjs");

/**
 * Creates a new subscription for a user with a trial period.
 * @param {UUID} userId - The ID of the user.
 * @param {string} subscriptionType - "standard", "premium", or "business".
 * @param {number} trialDays - The length of the trial period in days.
 * @returns {Promise<Subscription>} - The created subscription.
 */
async function createSubscription(
  userId,
  subscriptionType = "standard",
  trialDays = 14
) {
  // Check if user already has a subscription
  const existingSubscription = await Subscription.findOne({
    where: { userId },
  });
  if (existingSubscription) {
    throw new Error("User already has a subscription.");
  }

  const trialStart = new Date();
  const trialEnd = new Date(trialStart);
  trialEnd.setDate(trialEnd.getDate() + trialDays); // Add trial days

  const subscription = await Subscription.create({
    userId,
    subscriptionType,
    trialStart,
    trialEnd,
    status: "active", // Active during the trial
  });

  return subscription;
}

/**
 * Checks and updates the subscription status.
 * Marks as expired if trial or subscription period has ended.
 * @param {UUID} userId - The ID of the user.
 * @returns {Promise<Subscription>} - The updated subscription.
 */
async function updateSubscriptionStatus(userId) {
  const subscription = await Subscription.findOne({ where: { userId } });
  if (!subscription) {
    throw new Error("Subscription not found.");
  }

  const now = new Date();
  if (subscription.trialEnd && now > subscription.trialEnd) {
    if (subscription.status === "active") {
      subscription.status = "expired";
      await subscription.save();
    }
  }

  return subscription;
}

/**
 * Renews an expired or expiring subscription by adding a specified number of months.
 * @param {UUID} userId - The ID of the user.
 * @param {number} months - Number of months to extend the subscription.
 * @param {object} paymentDetails - Payment details (can be stored for records).
 * @returns {Promise<Subscription>} - The renewed subscription.
 */
async function renewSubscription(userId, months = 1, paymentDetails) {
  const subscription = await Subscription.findOne({ where: { userId } });
  if (!subscription) {
    throw new Error("Subscription not found.");
  }

  // Mock payment processing logic
  const paymentSuccessful = true; // Assume payment went through

  if (paymentSuccessful) {
    const currentEnd = subscription.trialEnd
      ? new Date(subscription.trialEnd)
      : new Date();
    const newEnd = dayjs(currentEnd).add(months, "month").toDate(); // Add months using dayjs

    subscription.trialEnd = newEnd;
    subscription.status = "active";
    subscription.paymentDetails = paymentDetails;
    await subscription.save();
  } else {
    throw new Error("Payment failed. Subscription not renewed.");
  }

  return subscription;
}

/**
 * Upgrades the subscription type for a user.
 * @param {UUID} userId - The ID of the user.
 * @param {string} newSubscriptionType - The new subscription type ("standard", "premium", "business").
 * @returns {Promise<Subscription>} - The updated subscription.
 */
async function upgradeSubscription(userId, newSubscriptionType) {
  const subscription = await Subscription.findOne({ where: { userId } });
  if (!subscription) {
    throw new Error("Subscription not found.");
  }

  subscription.subscriptionType = newSubscriptionType;
  subscription.status = "active";
  await subscription.save();

  return subscription;
}

/**
 * Cancels a user's subscription.
 * @param {UUID} userId - The ID of the user.
 * @returns {Promise<Subscription>} - The canceled subscription.
 */
async function cancelSubscription(userId) {
  const subscription = await Subscription.findOne({ where: { userId } });
  if (!subscription) {
    throw new Error("Subscription not found.");
  }

  subscription.status = "expired";
  await subscription.save();

  return subscription;
}

module.exports = {
  createSubscription,
  updateSubscriptionStatus,
  upgradeSubscription,
  renewSubscription,
  cancelSubscription,
};
