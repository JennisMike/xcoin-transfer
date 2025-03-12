import { v4 as uuidv4 } from "uuid";

function generatePaymentReference() {
  return uuidv4(); // Generates a unique reference
}

export default generatePaymentReference;
