const Card = require("../models/card");

const seedCards = async () => {
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
};

seedCards();
