const { Sequelize } = require("sequelize");
const path = require("path");

// Define your environment variables
const dbDialect = process.env.DB_DIALECT || "sqlite";
const dbStorage =
  process.env.DB_STORAGE || path.join(__dirname, "database.sqlite");
const dbHost = process.env.DB_HOST || "localhost"; // For MySQL/Postgres
const dbUsername = process.env.DB_USERNAME || "root"; // For MySQL/Postgres
const dbPassword = process.env.DB_PASSWORD || "password"; // For MySQL/Postgres
const dbName = process.env.DB_NAME || "mydatabase"; // For MySQL/Postgres

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
  });
}

// Test the connection (optional)
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

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
