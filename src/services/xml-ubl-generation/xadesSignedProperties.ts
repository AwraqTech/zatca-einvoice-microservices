import { createHash } from 'crypto';
import { create } from 'xmlbuilder2';

interface XAdESSignedPropertiesProps {
    signTimestamp: string;
    certificateHash: string;
    certificateIssuer: string;
    certificateSerialNumber: string;
}

export default function xadesSignedProperties({
    signTimestamp,
    certificateHash,
    certificateIssuer,
    certificateSerialNumber
}: XAdESSignedPropertiesProps) {
    const xadessXml = `<xades:SignedProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" Id="xadesSignedProperties">
    <xades:SignedSignatureProperties>
        <xades:SigningTime>${signTimestamp}</xades:SigningTime>
        <xades:SigningCertificate>
            <xades:Cert>
                <xades:CertDigest>
                    <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
                    <ds:DigestValue xmlns:ds="http://www.w3.org/2009/xmldsig#">${certificateHash}</ds:DigestValue>
                </xades:CertDigest>
                <xades:IssuerSerial>
                    <ds:X509IssuerName xmlns:ds="http://www.w3.org/2009/xmldsig#">${certificateIssuer}</ds:X509IssuerName>
                    <ds:X509SerialNumber xmlns:ds="http://www.w3.org/2009/xmldsig#">${certificateSerialNumber}</ds:X509SerialNumber>
                </xades:IssuerSerial>
            </xades:Cert>
        </xades:SigningCertificate>
    </xades:SignedSignatureProperties>
</xades:SignedProperties>`
        
    const signedPropertiesBytes = Buffer.from(xadessXml);
    const signedPropertiesHash = Buffer.from(
        createHash("sha256").update(signedPropertiesBytes).digest("hex")
    ).toString("base64");

    return signedPropertiesHash;
}