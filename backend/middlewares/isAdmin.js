const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send("Authentication token required");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.admin.role === "admin") {
      req.user = decoded;
      return next();
    }
    return res.status(403).send("Access denied");
  } catch (error) {
    return res.status(401).send("Invalid token");
  }
};

module.exports = { isAdmin };
