import { TLVUtils } from "../services/tlvEncoder";

export async function generateQRCodeBase64XML({
    sellerName,
    vatRegNum,
    date,
    time,
    invTotalWithVat,
    vatTotal,
    invoiceHash,
    publicKey,
    certificateSignature,
    digitalSignature
}: {
    sellerName: string;
    vatRegNum: string;
    date: string;
    time: string;
    invTotalWithVat: string;
    vatTotal: string;
    invoiceHash: string;
    publicKey: string;
    certificateSignature: string;
    digitalSignature: string;
}): Promise<string> {
    try {
        // Validate required inputs
        if (!sellerName || !vatRegNum || !date || !time || !invTotalWithVat || !vatTotal || !invoiceHash || !publicKey || !certificateSignature || !digitalSignature) {
            throw new Error("Missing required parameters for QR code generation.");
        }

        // Create a buffer array for TLV-encoded data
        const qrCodeBufferArray: Buffer[] = [
            TLVUtils.encodeTLV(1, sellerName),
            TLVUtils.encodeTLV(2, vatRegNum),
            TLVUtils.encodeTLV(3, date),
            TLVUtils.encodeTLV(4, time),
            TLVUtils.encodeTLV(5, invTotalWithVat),
            TLVUtils.encodeTLV(6, vatTotal),
            TLVUtils.encodeTLV(7, invoiceHash),
            TLVUtils.encodeTLV(8, digitalSignature),
            TLVUtils.encodeTLV(9, publicKey),
            TLVUtils.encodeTLV(10, certificateSignature)
        ];

        // Concatenate buffers and encode to Base64
        const encodedTLV = Buffer.concat(qrCodeBufferArray);
        const encodedTLVBase64 = encodedTLV.toString("base64");

        return encodedTLVBase64;
    } catch (error) {
        console.error("Error generating QR code:", error);
        throw new Error("Failed to generate QR code.");
    }
}
