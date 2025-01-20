interface QRProps {
    digitalSignature: string;
    certificatePublicKeyBuffer: string;
    certificateSignature: string;
    invoiceHash: string;
    supplierVatName: string;
    supplierVatNumber: string;
    totalVatAmount: string;
    totalTaxInclusiveAmount: string;
    formattedDatetime: string;
}

// TLV Encoding function (tag, value pairs)
const encodeTLV = (tag: number, value: string): Buffer => {
    const valueBuffer = Buffer.from(value, 'utf-8');
    const length = valueBuffer.length;
    const tagBuffer = Buffer.from([tag]);
    const lengthBuffer = Buffer.from([length]);
    return Buffer.concat([tagBuffer, lengthBuffer, valueBuffer]);
};

export async function generateQRCodeBase64({
    digitalSignature,
    certificatePublicKeyBuffer,
    certificateSignature,
    invoiceHash,
    supplierVatName,
    supplierVatNumber,
    totalVatAmount,
    totalTaxInclusiveAmount,
    formattedDatetime,
}: QRProps): Promise<string> {

    const qrCodeBufferArray: Buffer[] = [];
    qrCodeBufferArray.push(encodeTLV(1, supplierVatName));
    qrCodeBufferArray.push(encodeTLV(2, supplierVatNumber));
    qrCodeBufferArray.push(encodeTLV(3, formattedDatetime));
    qrCodeBufferArray.push(encodeTLV(4, totalTaxInclusiveAmount));
    qrCodeBufferArray.push(encodeTLV(5, totalVatAmount));
    qrCodeBufferArray.push(encodeTLV(6, invoiceHash));
    qrCodeBufferArray.push(encodeTLV(7, certificateSignature));
    qrCodeBufferArray.push(encodeTLV(8, certificatePublicKeyBuffer));
    qrCodeBufferArray.push(encodeTLV(9, digitalSignature));

    const encodedTLV = Buffer.concat(qrCodeBufferArray);

    const encodedTLVBase64 = encodedTLV.toString("base64");

    return encodedTLVBase64;
}
