const { DataTypes } = require("sequelize");
const { sequelize } = require("../services/db");
const User = require("./user");

const Transaction = sequelize.define(
  "transaction",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    type: {
      type: DataTypes.ENUM(
        "buy",
        "sell",
        "convert",
        "deposit",
        "withdraw",
        "request"
      ),
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    targetAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    targetCurrency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fee: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("completed", "pending", "failed", "processing"),
      defaultValue: "pending",
    },
    external_reference: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

Transaction.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(Transaction, { foreignKey: "userId" });

module.exports = Transaction;
