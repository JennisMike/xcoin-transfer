const Card = require("../models/card");
const User = require("../models/user");
require("dotenv").config();
const bcrypt = require("bcryptjs");

const seedCards = async () => {
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 10);

  await Card.bulkCreate([
    {
      name: "Standard Card",
      type: "standard",
      rate: 8.5,
      fee: 2,
      description: "Basic card with standard features.",
    },
    {
      name: "Premium Card",
      type: "premium",
      rate: 7.5,
      fee: 2,
      description: "Premium card offering additional benefits.",
    },
    {
      name: "Business Card",
      type: "business",
      rate: 5.2,
      fee: 1.0,
      description: "Business card with higher limits and tailored benefits.",
    },
  ]);

  await User.create({
    fullName: "admin admin",
    role: "admin",
    email: process.env.ADMIN_EMAIL,
    gender: "male",
    occupation: "working",
    institution: "",
    password: hashedPassword,
    verification: "verified",
    dob: new Date("2006-02-28").toISOString(),
    country: "Cameroon",
  });
};

seedCards();
