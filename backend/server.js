const express = require("express");
const { connectDB, sequelize } = require("./services/db");
const userRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);

const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies.

// Connect to the database.
connectDB();

// Sync models with the database.
sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced successfully!");
});

app.use(cors());

// Set up session middleware
app.use(
  session({
    store: new SQLiteStore({ db: "sessions.sqlite", dir: "./" }),
    secret: process.env.SESSION_SECRET || "somesecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 4, // 4 hours
    },
  })
);

// Use  routes.
app.use("/api/auth", userRoutes);
app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
