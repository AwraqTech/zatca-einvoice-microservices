import QRCode from "qrcode";
import { TLVUtils } from "../services/tlvEncoder";

export async function generateQRCodeBase64({
    sellerName,
    vatRegNum,
    date,
    time,
    invTotalWithVat,
    vatTotal,
}: {
    sellerName: string;
    vatRegNum: string;
    date: string;
    time: string;
    invTotalWithVat: string;
    vatTotal: string;
}): Promise<string> {
    const qrCodeBufferArray: Buffer[] = [];
    qrCodeBufferArray.push(TLVUtils.encodeTLV(1, sellerName));
    qrCodeBufferArray.push(TLVUtils.encodeTLV(2, vatRegNum));
    qrCodeBufferArray.push(TLVUtils.encodeTLV(3, date));
    qrCodeBufferArray.push(TLVUtils.encodeTLV(4, time));
    qrCodeBufferArray.push(TLVUtils.encodeTLV(5, invTotalWithVat));
    qrCodeBufferArray.push(TLVUtils.encodeTLV(6, vatTotal));

    const encodedTLV = Buffer.concat(qrCodeBufferArray);
    const encodedTLVHex = encodedTLV.toString("hex");
    const encodedTLVBase64 = Buffer.from(encodedTLVHex, "hex").toString("base64");

    const qrCodeBase64 = await QRCode.toDataURL(encodedTLVBase64);
    return qrCodeBase64;
}
