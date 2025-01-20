import { Request, Response } from "express";
import generateInvoiceXML from "../../services/xml-ubl-generation/simplefiedTax";
import { sampleInvoiceData } from "../../test/data/sampleInvoiceData";
import genInvoiceHash from "../../helpers/genInvoiceHash";
import genInvoiceDigitalSign from "../../helpers/genInvoiceDigitalSignature";
import genCertificateHash from "../../helpers/genCertificateHash";
import getInfoFromCertificate from "../../helpers/getInfoFromCertificate";
import signingTime from "../../helpers/signingTime";
import xadesSignedProperties from "../../services/xml-ubl-generation/xadesSignedProperties";
import InvoiceSigniture from "../../services/xml-ubl-generation/InvoiceSigniture";
import { generateQRCodeBase64 } from '../../helpers/qrCodeGenEcode';

export default async function generateValidXMLInvoice(req: Request, res: Response) {
    try {
        const privateKey = `MIGEAgEAMBAGByqGSM49AgEGBSuBBAAKBG0wawIBAQQg0kEmwnqMEgQFUJSObyUU\nCpP3RSzGkBOd/MQHvk5L7buhRANCAASKBP2HS0Sii2RckbeSFMsRLfxzmqqoZY+J\nrcLD0bQm4IiVLgvgseK6gw3gH2eENqjblhpX9XkmTjDuhDsn6bPE`;

        const csid = 'TUlJQ1BqQ0NBZU9nQXdJQkFnSUdBWlNFU1E4a01Bb0dDQ3FHU000OUJBTUNNQlV4RXpBUkJnTlZCQU1NQ21WSmJuWnZhV05wYm1jd0hoY05NalV3TVRJd01UVXhOakF6V2hjTk16QXdNVEU1TWpFd01EQXdXakIxTVNZd0pBWURWUVFEREIxVVUxUXRPRGcyTkRNeE1UUTFMVE01T1RrNU9UazVPVGt3TURBd016RW1NQ1FHQTFVRUNnd2RUV0Y0YVcxMWJTQlRjR1ZsWkNCVVpXTm9JRk4xY0hCc2VTQk1WRVF4RmpBVUJnTlZCQXNNRFZKcGVXRmthQ0JDY21GdVkyZ3hDekFKQmdOVkJBWVRBbE5CTUZZd0VBWUhLb1pJemowQ0FRWUZLNEVFQUFvRFFnQUVyV1pZeTdSd1c4U0NDeFNCdVFLTFJ5WS9UTU83M1RWdlBpdWN2bTQvSFh6V0ZOUTZmWllzYkFEdm9Ydm80UTBZcEpmaFN5V3BXVjhhejQ4YlQwcndDNk9Cd1RDQnZqQU1CZ05WSFJNQkFmOEVBakFBTUlHdEJnTlZIUkVFZ2FVd2dhS2tnWjh3Z1p3eE96QTVCZ05WQkFRTU1qRXRWRk5VZkRJdFZGTlVmRE10WldReU1tWXhaRGd0WlRaaE1pMHhNVEU0TFRsaU5UZ3RaRGxoT0dZeE1XVTBORFZtTVI4d0hRWUtDWkltaVpQeUxHUUJBUXdQTXprNU9UazVPVGs1T1RBd01EQXpNUTB3Q3dZRFZRUU1EQVF4TVRBd01SRXdEd1lEVlFRYURBaFNVbEpFTWpreU9URWFNQmdHQTFVRUR3d1JVM1Z3Y0d4NUlHRmpkR2wyYVhScFpYTXdDZ1lJS29aSXpqMEVBd0lEU1FBd1JnSWhBSmsvSWl6ZzlveElnT2tudmN3ZWFpQ2RTaVNrempjN1FjeXhpWGZ1MEp2M0FpRUFudWtMR1l0VzRmWHQ3b1dmVnFuM0pTTVRmeG1VUnBYNmZsdGExM2hkM1FBPQ=='

        const publicKey = `-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE2ZiSSiNp2crw0aV4AbGcxQQR7+qeZHyN
hjt5XvOGDmgiHCnE9qtzrDq/QmFnM0K+sHIkQB9hz5Bxj9QioW0tGQ==
-----END PUBLIC KEY-----`

        const generateXMLInvoice = generateInvoiceXML(sampleInvoiceData);
        const { base64Hash } = genInvoiceHash({ invoiceXML: generateXMLInvoice });
        const digitalSignature = genInvoiceDigitalSign({ invoiceHash: base64Hash, privateKey });
        const certificateHash = genCertificateHash({ certificateString: atob(csid.replace(/[\r\n]+/g, '')) });
        const cleanedCertificate = atob(csid.replace(/[\r\n]+/g, ''));
        const { certificateIssuer, certificateSerialNumber } = getInfoFromCertificate(csid);
        const formattedTimestamp = signingTime();
        const signedPropertiesHash = xadesSignedProperties({
            signTimestamp: formattedTimestamp,
            certificateHash: certificateHash,
            certificateIssuer: certificateIssuer,
            certificateSerialNumber: certificateSerialNumber
        });
        const signedInvoice = InvoiceSigniture({
            signTimestamp: formattedTimestamp,
            certificateHash: certificateHash,
            certificateIssuer: certificateIssuer,
            certificateSerialNumber: certificateSerialNumber,
            invoiceHash: base64Hash,
            digitalSignature: digitalSignature,
            cleanedCertificate: cleanedCertificate,
            signedPropertiesHash: signedPropertiesHash
        });
        const qr = await generateQRCodeBase64({
            digitalSignature: digitalSignature,
            certificatePublicKeyBuffer: publicKey,
            certificateSignature: digitalSignature,
            invoiceHash: base64Hash,
            supplierVatName: 'Maximum Speed Tech Supply LTD',
            supplierVatNumber: '399999999900003',
            totalVatAmount: '150',
            totalTaxInclusiveAmount: '1175',
            formattedDatetime: formattedTimestamp
        });

        const finalXMLInvoice = generateXMLInvoice.replace('HASHED_INVOICE', base64Hash)
        .replace('QR_CODE_HASHED', qr)
        .replace('UBL_EXTENSION_CONTENT', signedInvoice);

        res.set("Content-Type", "application/xml");
        res.send(finalXMLInvoice);

    } catch (error: any) {
        res.status(500).send({ message: `There was error occured, error message: ${error.message}` });
    }
}