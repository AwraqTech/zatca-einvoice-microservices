// Function to convert a raw Base64 key to PEM format
function convertToPem(privateKey: string): string {
    if (privateKey.startsWith('-----BEGIN EC PRIVATE KEY-----')) {
        return privateKey;  // If it's already in PEM format, return as is
    }

    // If it's raw base64, wrap it with PEM headers
    const base64Key = privateKey.trim(); // Remove any unwanted characters like newlines
    return `-----BEGIN EC PRIVATE KEY-----\n${base64Key}\n-----END EC PRIVATE KEY-----`;
}

import { createSign } from "crypto";

interface DigitalSignProps {
    invoiceHash: string;
    privateKey: string;
}

export default function genInvoiceDigitalSign({ invoiceHash, privateKey }: DigitalSignProps) {
    // Convert invoice hash from base64 to bytes
    const invoiceHashBytes = Buffer.from(invoiceHash, "base64");

    // Create a sha256 signer
    const sign = createSign("sha256");

    // Update the signer with the invoice hash
    sign.update(invoiceHashBytes);
    sign.end();

    // Convert the private key to PEM format (if it's raw)
    const pemPrivateKey = convertToPem(privateKey);
    console.log('Converted PEM key:', pemPrivateKey);

    try {
        // Sign using the private key (PEM formatted)
        const signature = sign.sign(pemPrivateKey).toString("base64");
        return signature;
    } catch (error: any) {
        console.error("Error during signing: ", error);
        throw new Error(`Signing failed: ${error.message}`);
    }
}
