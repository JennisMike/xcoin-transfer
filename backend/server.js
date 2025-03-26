const express = require("express");
const { connectDB, sequelize } = require("./services/db");
const userRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);

const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies.

// Connect to the database.
connectDB();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://18.212.27.82:3000",
  ], // Allowed domains
  methods: ["GET", "POST"], // Allowed methods (optional)
  credentials: true, // Allow credentials (optional)
  optionsSuccessStatus: 200, // For legacy browser support (optional)
};

// Sync models with the database.
sequelize.sync({ alter: false }).then(() => {
  console.log("Database synced successfully!");
});

app.use(cors(corsOptions));

// Set up session middleware
app.use(
  session({
    name: "xc_session",
    store: new SQLiteStore({ db: "services/database.sqlite", dir: "./" }),
    secret: process.env.SESSION_SECRET || "somesecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 4, // 4 hours
    },
  })
);

// Use  routes.
app.use("/api/auth", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api", (req, res) => {
  res.json({ message: "Url is working well" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
