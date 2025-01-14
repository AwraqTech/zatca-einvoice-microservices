import { X509Certificate } from "crypto";

export default function getInfoFromCertificate(certificate: string) {
    // Decode the Base64 string to get the certificate content
    const certificateBuffer = Buffer.from(certificate, 'base64');

    try {
        // Ensure the certificate has the PEM format by adding BEGIN/END markers if needed
        const pemCertificate = `-----BEGIN CERTIFICATE-----\n${certificateBuffer}\n-----END CERTIFICATE-----`;

        // Parse the certificate
        const certificateObj = new X509Certificate(pemCertificate);

        // Extract serial number and issuer
        const serialNumber = certificateObj.serialNumber; // Hexadecimal format
        const issuer = certificateObj.issuer; // Issuer information

        // Format issuer as comma-separated (reverse order to get the correct hierarchy)
        const certificateIssuer = issuer.split("\n").reverse().join(", ");

        // Convert the serial number to decimal
        const certificateSerialNumber = BigInt(`0x${serialNumber}`).toString(10);

        return { certificateIssuer, certificateSerialNumber };
    } catch (error: any) {
        throw new Error(`Failed to extract certificate info: ${error.message}`);
    }
}
