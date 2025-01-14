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
        const privateKey = `-----BEGIN PRIVATE KEY-----
MIGEAgEAMBAGByqGSM49AgEGBSuBBAAKBG0wawIBAQQg01F6RKWm5jejnEr3EhSL
AQLcm8xJhsqy3hiOmS+V17ShRANCAATbPZO0uplKDtuTffDLyE4/NZbP1nd+XVd6
3nle7+f2lUVwCWMaqmHqNoDVZRsLgY9GN9tafe8Lw6vIo5RxkngS
-----END PRIVATE KEY-----`;

        const csid = 'TUlJQ1BUQ0NBZU9nQXdJQkFnSUdBWlJscDlrSk1Bb0dDQ3FHU000OUJBTUNNQlV4RXpBUkJnTlZCQU1NQ21WSmJuWnZhV05wYm1jd0hoY05NalV3TVRFME1UWXpNVEl4V2hjTk16QXdNVEV6TWpFd01EQXdXakIxTVNZd0pBWURWUVFEREIxVVUxUXRPRGcyTkRNeE1UUTFMVE01T1RrNU9UazVPVGt3TURBd016RW1NQ1FHQTFVRUNnd2RUV0Y0YVcxMWJTQlRjR1ZsWkNCVVpXTm9JRk4xY0hCc2VTQk1WRVF4RmpBVUJnTlZCQXNNRFZKcGVXRmthQ0JDY21GdVkyZ3hDekFKQmdOVkJBWVRBbE5CTUZZd0VBWUhLb1pJemowQ0FRWUZLNEVFQUFvRFFnQUVlUlZuYnh2TUxxWkpCNExFU0FyZWRCc3MvYmJmVFgvV3YrRVFSbTc1MENXRXRkZ0tSV2c3V3FFNUZ5dTkxUFdMKzRaM0o2eTVhaER5UGZpVTE2M0x6YU9Cd1RDQnZqQU1CZ05WSFJNQkFmOEVBakFBTUlHdEJnTlZIUkVFZ2FVd2dhS2tnWjh3Z1p3eE96QTVCZ05WQkFRTU1qRXRWRk5VZkRJdFZGTlVmRE10WldReU1tWXhaRGd0WlRaaE1pMHhNVEU0TFRsaU5UZ3RaRGxoT0dZeE1XVTBORFZtTVI4d0hRWUtDWkltaVpQeUxHUUJBUXdQTXprNU9UazVPVGs1T1RBd01EQXpNUTB3Q3dZRFZRUU1EQVF4TVRBd01SRXdEd1lEVlFRYURBaFNVbEpFTWpreU9URWFNQmdHQTFVRUR3d1JVM1Z3Y0d4NUlHRmpkR2wyYVhScFpYTXdDZ1lJS29aSXpqMEVBd0lEU0FBd1JRSWdTZStKWnU5bGpCWkovb2JZaTFHRUtzNGtFSDBYUFlacEl3c3YyOC9KZUlVQ0lRQ3gwbWNHWDVHN1FtNTZjelFmS2JQTWx4anZkdUNXams1YmlDV3JtUFJ6WVE9PQ=='

        const publicKey = `-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE2ZiSSiNp2crw0aV4AbGcxQQR7+qeZHyN
hjt5XvOGDmgiHCnE9qtzrDq/QmFnM0K+sHIkQB9hz5Bxj9QioW0tGQ==
-----END PUBLIC KEY-----`

        const generateXMLInvoice = generateInvoiceXML(sampleInvoiceData);
        const invoiceHash = await genInvoiceHash({ invoiceXML: generateXMLInvoice });
        const digitalSignature = genInvoiceDigitalSign({ invoiceHash, privateKey });
        const certificateHash = genCertificateHash({ certificateString: csid });
        const cleanedCertificate = atob(csid.replace(/[\r\n]+/g, ''));
        const { certificateIssuer, certificateSerialNumber } = getInfoFromCertificate(csid);
        console.log(certificateIssuer);
        console.log(certificateSerialNumber);
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
            invoiceHash: invoiceHash,
            digitalSignature: digitalSignature,
            cleanedCertificate: cleanedCertificate,
            signedPropertiesHash: signedPropertiesHash
        });
        const qr = await generateQRCodeBase64({
            digitalSignature: digitalSignature,
            certificatePublicKeyBuffer: publicKey,
            certificateSignature: digitalSignature,
            invoiceXML: generateXMLInvoice,
            supplierVatName: 'Sample Corp',
            supplierVatNumber: '312345678901233',
            totalVatAmount: '150',
            totalTaxInclusiveAmount: '1175',
            formattedDatetime: formattedTimestamp
        });

        const finalXMLInvoice = generateXMLInvoice.replace('HASHED_INVOICE', invoiceHash).replace('QR_CODE_HASHED', qr).replace('UBL_EXTENSION_CONTENT', signedInvoice);

        res.set("Content-Type", "application/xml");
        res.send(finalXMLInvoice);

    } catch (error: any) {
        res.status(500).send({ message: `There was error occured, error message: ${error.message}` });
    }
}