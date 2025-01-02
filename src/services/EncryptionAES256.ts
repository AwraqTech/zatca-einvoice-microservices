import crypto from "crypto";
import dotenv from 'dotenv';

dotenv.config();

const ENCRYPTION_KEY: string = process.env.ENCRYPTION_KEY as string;
const IV_LENGTH = 16; // AES block size

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
  throw new Error("Encryption key is not set or invalid. It must be 32 characters long.");
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH); // Generate a random IV
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}
