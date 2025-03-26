const { DataTypes } = require("sequelize");
const { sequelize } = require("../services/db");

const Card = sequelize.define(
  "card",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Name of the card (e.g., "Standard Card", "Premium Card", "Business Card")
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Card type: standard, premium, or business
    type: {
      type: DataTypes.ENUM("standard", "premium", "business"),
      allowNull: false,
      unique: true,
    },
    // The rate associated with this card (could represent interest, cashback, or exchange rate)
    rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
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
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

module.exports = Card;
