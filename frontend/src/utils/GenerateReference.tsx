const { v4: uuidv4 } = require("uuid");

function generatePaymentReference() {
  return uuidv4(); // Generates a unique reference
}

export default generatePaymentReference;
