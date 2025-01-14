import { createSign } from "crypto";

interface DigitalSignProps {
    invoiceHash: string;
    privateKey: string;
}

export default function genInvoiceDigitalSign({ invoiceHash, privateKey }: DigitalSignProps) {
    const invoiceHashBytes = Buffer.from(invoiceHash, "base64");
    const sign = createSign("sha256");

    sign.update(invoiceHashBytes);
    const signature = Buffer.from(sign.sign(privateKey)).toString(
        "base64"
    );

    return signature;
};