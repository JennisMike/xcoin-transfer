import { EncryptedData, EncryptedResponse } from "@/utils/types";

/**
 * Custom error class for crypto-related errors
 */
export class CryptoError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = "CryptoError";
  }
}

// Encryption key from environment
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "";

/**
 * Check if Web Crypto API is available
 */
function checkWebCryptoSupport(): void {
  if (!window.crypto || !window.crypto.subtle) {
    throw new CryptoError(
      "Web Crypto API is not supported. HTTPS is required."
    );
  }
}

/**
 * Convert hex string to Uint8Array
 */
function hexToBytes(hex: string): Uint8Array {
  if (!/^[0-9a-fA-F]+$/.test(hex) || hex.length % 2 !== 0) {
    throw new CryptoError("Invalid hex string format.");
  }
  return new Uint8Array(
    hex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
  );
}

/**
 * Convert ArrayBuffer to Base64
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return window.btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

/**
 * Convert Base64 to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  try {
    const binary = window.atob(base64);
    return new Uint8Array([...binary].map((char) => char.charCodeAt(0))).buffer;
  } catch (error) {
    throw new CryptoError("Invalid base64 string", error);
  }
}

/**
 * Get or create the encryption key
 */
let cryptoKeyPromise: Promise<CryptoKey> | null = null;

async function getKey(): Promise<CryptoKey> {
  checkWebCryptoSupport();

  if (!cryptoKeyPromise) {
    if (!ENCRYPTION_KEY) {
      throw new CryptoError("Encryption key is missing.");
    }

    const keyData = hexToBytes(ENCRYPTION_KEY);
    if (keyData.length !== 32) {
      throw new CryptoError(
        `Invalid key length: ${keyData.length * 8} bits. Expected 256 bits.`
      );
    }

    cryptoKeyPromise = window.crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    );
  }
  return cryptoKeyPromise;
}

/**
 * Reset the cached crypto key
 */
export function resetCryptoKey(): void {
  cryptoKeyPromise = null;
}

/**
 * Encrypt data
 */
export async function encryptData<T>(data: T): Promise<EncryptedData> {
  checkWebCryptoSupport();

  const key = await getKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(16));

  const jsonData = JSON.stringify(data, (_, value) =>
    value instanceof Date
      ? { __type: "Date", value: value.toISOString() }
      : value
  );

  const encodedData = new TextEncoder().encode(jsonData);
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encodedData
  );

  return {
    encrypted: true,
    iv: arrayBufferToBase64(iv.buffer),
    data: arrayBufferToBase64(encryptedBuffer),
    timestamp: Date.now(),
  };
}

/**
 * Decrypt data
 */
export async function decryptData<T = unknown>(
  encryptedData: EncryptedResponse
): Promise<T> {
  checkWebCryptoSupport();

  if (!isEncryptedResponse(encryptedData)) {
    throw new CryptoError("Invalid encrypted data format");
  }

  const key = await getKey();
  const iv = new Uint8Array(base64ToArrayBuffer(encryptedData?.iv));
  if (iv.length !== 16) {
    throw new CryptoError(
      `Invalid IV length: ${iv.length} bytes. Expected: 16 bytes.`
    );
  }

  const encryptedContent = base64ToArrayBuffer(encryptedData?.data);

  let decryptedBuffer: ArrayBuffer;
  try {
    decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encryptedContent
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "OperationError") {
        throw new CryptoError(
          "Decryption failed: Possible reasons - incorrect key, corrupt data, or IV mismatch.",
          error
        );
      }
    }
    throw new CryptoError("Unexpected decryption error", error);
  }

  let decryptedText: string;
  try {
    decryptedText = new TextDecoder().decode(decryptedBuffer);
  } catch (error) {
    throw new CryptoError("Failed to decode decrypted data.", error);
  }

  try {
    return JSON.parse(decryptedText, (_, value) =>
      value && typeof value === "object" && value.__type === "Date"
        ? new Date(value.value)
        : value
    ) as T;
  } catch (error) {
    throw new CryptoError("Failed to parse decrypted JSON.", error);
  }
}

/**
 * Check if a response is an encrypted response
 */
export function isEncryptedResponse(response: EncryptedResponse) {
  return (
    response !== null &&
    typeof response === "object" &&
    // Accept either a flag or the presence of the tag property
    (response.encrypted === true || typeof response.tag === "string") &&
    typeof response.iv === "string" &&
    typeof response.data === "string"
    // You can optionally check for a timestamp as well
  );
}
