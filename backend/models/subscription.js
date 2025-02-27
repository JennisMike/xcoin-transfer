const { DataTypes } = require("sequelize");
const { sequelize } = require("../services/db");
const User = require("./user");

const Subscription = sequelize.define("Subscription", {
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
  subscriptionType: {
    type: DataTypes.ENUM("standard", "premium", "business"),
    defaultValue: "standard",
  },
  balance: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  trialStart: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  trialEnd: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  rate: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 10.5,
  },
  // An optional fee that may apply to this card type
  fee: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  // Optional description for further details about the card
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("active", "expired", "pending"),
    defaultValue: "active",
  },
  paymentDetails: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
});

// Associations
Subscription.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasOne(Subscription, { foreignKey: "userId" });

module.exports = Subscription;
