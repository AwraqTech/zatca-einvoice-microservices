import crypto, { BinaryLike, KeyLike } from 'crypto';

/**
 * Generate a digital signature and corresponding KeyInfo.
 * @param xmlData - The XML data to sign.
 * @param privateKey - The private key used to sign the data.
 * @param certificate - The public certificate to include in KeyInfo.
 * @returns An object containing the base64-encoded signature and key information.
 */
export default function generateDigitalSignature(xmlData: BinaryLike, privateKey: KeyLike, certificate: string) {
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(xmlData);
    sign.end();

    const signatureValue = sign.sign(privateKey, 'base64');
    const keyInfo = Buffer.from(certificate).toString('base64');

    return { signatureValue, keyInfo };
}
