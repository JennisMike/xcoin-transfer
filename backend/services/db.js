require("dotenv").config();
const { Sequelize } = require("sequelize");
const path = require("path");

// Define your environment variables
const dbDialect = process.env.DB_DIALECT || "sqlite";
const dbStorage = path.join(__dirname, "database.sqlite");
const dbHost = process.env.DB_HOST || "localhost"; // For MySQL/Postgres
const dbUsername = process.env.DB_USERNAME || "root"; // For MySQL/Postgres
const dbPassword = process.env.DB_PASSWORD || "password"; // For MySQL/Postgres
const dbName = process.env.DB_NAME || "mydatabase"; // For MySQL/Postgres
const dbPort = process.env.DB_PORT || 5432;
const useSSL = process.env.DB_SSL === "true";

let sequelize;

if (dbDialect === "sqlite") {
  // Use SQLite if specified or if no other config is provided
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: dbStorage,
    logging: false,
  });
} else {
  // Use other dialects like MySQL or PostgreSQL
  sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
    host: dbHost,
    dialect: dbDialect,
    logging: false,
    dialectOptions: useSSL
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  });
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
