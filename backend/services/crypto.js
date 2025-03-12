const crypto = require("crypto");
require("dotenv").config();

// Get the encryption key from environment variables (should be 64 hex characters for 256 bits)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "";
const IV_LENGTH = 16; // AES-GCM requires a 16-byte IV

if (!ENCRYPTION_KEY) {
  throw new Error("Encryption key is missing in environment variables.");
}

// Convert the hex string to a Buffer and verify length is 32 bytes (256 bits)
const keyBuffer = Buffer.from(ENCRYPTION_KEY, "hex");
if (keyBuffer.length !== 32) {
  throw new Error(
    `Invalid encryption key length: ${
      keyBuffer.length * 8
    } bits. Expected: 256 bits.`
  );
}

/**
 * Encrypt data using AES-256-GCM
 * @param {Object} data - The object to encrypt.
 * @returns {Object} The encrypted data object.
 */
function encryptResponse(data) {
  // Generate a random IV
  const iv = crypto.randomBytes(IV_LENGTH);

  // Create the cipher instance
  const cipher = crypto.createCipheriv("aes-256-gcm", keyBuffer, iv);

  // Convert the data to JSON and encrypt
  const jsonData = JSON.stringify(data);
  let encryptedBuffer = cipher.update(jsonData, "utf8");
  encryptedBuffer = Buffer.concat([encryptedBuffer, cipher.final()]);

  // Get the authentication tag
  const authTag = cipher.getAuthTag();

  // Combine the encrypted data and the auth tag.
  // The browser’s Web Crypto API expects the tag to be appended to the ciphertext.
  const combinedBuffer = Buffer.concat([encryptedBuffer, authTag]);

  return {
    encrypted: true, // Maintain the flag
    iv: iv.toString("base64"),
    data: combinedBuffer.toString("base64"), // Contains ciphertext + auth tag
    tag: authTag.toString("base64"), // Also provided separately (optional)
    timestamp: Date.now(),
  };
}

/**
 * Decrypt data using AES-256-GCM
 * @param {Object} encryptedData - The encrypted data object.
 * @returns {Object} The decrypted object.
 */
function decryptData(encryptedData) {
  // Convert IV from base64 back to Buffer
  const iv = Buffer.from(encryptedData.iv, "base64");

  // Convert the combined ciphertext (ciphertext + tag) from base64 back to Buffer
  const combinedBuffer = Buffer.from(encryptedData.data, "base64");

  // The auth tag length is 16 bytes (128 bits)
  const tagLength = 16;
  const encryptedBuffer = combinedBuffer.slice(
    0,
    combinedBuffer.length - tagLength
  );
  const authTag = combinedBuffer.slice(combinedBuffer.length - tagLength);

  // Create the decipher instance
  const decipher = crypto.createDecipheriv("aes-256-gcm", keyBuffer, iv);
  decipher.setAuthTag(authTag);

  // Decrypt the data
  let decryptedBuffer = decipher.update(encryptedBuffer);
  decryptedBuffer = Buffer.concat([decryptedBuffer, decipher.final()]);

  return JSON.parse(decryptedBuffer.toString("utf8"));
}

// Export the functions so they can be used elsewhere in your backend
module.exports = {
  encryptResponse,
  decryptData,
};
