import QRCode from "qrcode";
import { createHash } from "crypto";
import { TLVUtils } from "../services/tlvEncoder";

interface QRProps {
    digitalSignature: string;
    certificatePublicKeyBuffer: string;
    certificateSignature: string;
    invoiceXML: string;
    supplierVatName: string;
    supplierVatNumber: string;
    totalVatAmount: string;
    totalTaxInclusiveAmount: string;
    formattedDatetime: string;
}

// Function to generate SHA256 hash of the invoice XML (32 bytes)
const generateInvoiceHash = (invoiceXML: string): string => {
    const hash = createHash("sha256");
    hash.update(invoiceXML);
    return hash.digest("base64"); // SHA256 hash in Base64 format
};

// TLV Encoding function (tag, value pairs)
const encodeTLV = (tag: number, value: string): Buffer => {
    const valueBuffer = Buffer.from(value, 'utf-8');
    const length = valueBuffer.length;
    const tagBuffer = Buffer.from([tag]);  // Tag (1 byte)
    const lengthBuffer = Buffer.from([length]);  // Length (1 byte)
    return Buffer.concat([tagBuffer, lengthBuffer, valueBuffer]); // Concatenate Tag, Length, and Value
};

export async function generateQRCodeBase64({
    digitalSignature,
    certificatePublicKeyBuffer,
    certificateSignature,
    invoiceXML,
    supplierVatName,
    supplierVatNumber,
    totalVatAmount,
    totalTaxInclusiveAmount,
    formattedDatetime,
}: QRProps): Promise<string> {

    // Step 1: Generate Invoice Hash (SHA256)
    const invoiceHash = generateInvoiceHash(invoiceXML);

    // Step 2: Create the TLV encoding for the QR Code fields
    const qrCodeBufferArray: Buffer[] = [];
    qrCodeBufferArray.push(encodeTLV(1, supplierVatName));  // Seller's Name
    qrCodeBufferArray.push(encodeTLV(2, supplierVatNumber));  // VAT Registration Number
    qrCodeBufferArray.push(encodeTLV(3, formattedDatetime));  // Timestamp (ISO 8601)
    qrCodeBufferArray.push(encodeTLV(4, totalTaxInclusiveAmount));  // Invoice Total (with VAT)
    qrCodeBufferArray.push(encodeTLV(5, totalVatAmount));  // VAT Total
    qrCodeBufferArray.push(encodeTLV(6, invoiceHash));  // Invoice Hash (SHA256, 32 bytes)
    qrCodeBufferArray.push(encodeTLV(7, certificateSignature));  // ECDSA Signature of the XML Hash
    qrCodeBufferArray.push(encodeTLV(8, certificatePublicKeyBuffer));  // ECDSA Public Key
    qrCodeBufferArray.push(encodeTLV(9, digitalSignature));  // ECDSA Signature of the Cryptographic Stamp

    // Step 3: Concatenate all TLV buffers to form the final TLV byte sequence
    const encodedTLV = Buffer.concat(qrCodeBufferArray);

    // Step 4: Encode the TLV byte sequence into Base64 format for QR code
    const encodedTLVBase64 = encodedTLV.toString("base64");

    // Step 5: Ensure the Base64 string fits the 700 character limit
    // if (encodedTLVBase64.length > 700) {
    //     throw new Error("QR code data exceeds the 700 character limit");
    // }

    // Step 6: Generate the QR code as a Base64 string
    const qrCodeBase64 = await QRCode.toDataURL(encodedTLVBase64);

    return encodedTLVBase64; // Return the Base64 string of the QR code content
}
