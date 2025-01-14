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

        const csid = 'TUlJRDNqQ0NBNFNnQXdJQkFnSVRFUUFBT0FQRjkwQWpzL3hjWHdBQkFBQTRBekFLQmdncWhrak9QUVFEQWpCaU1SVXdFd1lLQ1pJbWlaUHlMR1FCR1JZRmJHOWpZV3d4RXpBUkJnb0praWFKay9Jc1pBRVpGZ05uYjNZeEZ6QVZCZ29Ka2lhSmsvSXNaQUVaRmdkbGVIUm5ZWHAwTVJzd0dRWURWUVFERXhKUVVscEZTVTVXVDBsRFJWTkRRVFF0UTBFd0hoY05NalF3TVRFeE1Ea3hPVE13V2hjTk1qa3dNVEE1TURreE9UTXdXakIxTVFzd0NRWURWUVFHRXdKVFFURW1NQ1FHQTFVRUNoTWRUV0Y0YVcxMWJTQlRjR1ZsWkNCVVpXTm9JRk4xY0hCc2VTQk1WRVF4RmpBVUJnTlZCQXNURFZKcGVXRmthQ0JDY21GdVkyZ3hKakFrQmdOVkJBTVRIVlJUVkMwNE9EWTBNekV4TkRVdE16azVPVGs1T1RrNU9UQXdNREF6TUZZd0VBWUhLb1pJemowQ0FRWUZLNEVFQUFvRFFnQUVvV0NLYTBTYTlGSUVyVE92MHVBa0MxVklLWHhVOW5QcHgydmxmNHloTWVqeThjMDJYSmJsRHE3dFB5ZG84bXEwYWhPTW1Obzhnd25pN1h0MUtUOVVlS09DQWdjd2dnSURNSUd0QmdOVkhSRUVnYVV3Z2FLa2daOHdnWnd4T3pBNUJnTlZCQVFNTWpFdFZGTlVmREl0VkZOVWZETXRaV1F5TW1ZeFpEZ3RaVFpoTWkweE1URTRMVGxpTlRndFpEbGhPR1l4TVdVME5EVm1NUjh3SFFZS0NaSW1pWlB5TEdRQkFRd1BNems1T1RrNU9UazVPVEF3TURBek1RMHdDd1lEVlFRTURBUXhNVEF3TVJFd0R3WURWUVFhREFoU1VsSkVNamt5T1RFYU1CZ0dBMVVFRHd3UlUzVndjR3g1SUdGamRHbDJhWFJwWlhNd0hRWURWUjBPQkJZRUZFWCtZdm1tdG5Zb0RmOUJHYktvN29jVEtZSzFNQjhHQTFVZEl3UVlNQmFBRkp2S3FxTHRtcXdza0lGelZ2cFAyUHhUKzlObk1Ic0dDQ3NHQVFVRkJ3RUJCRzh3YlRCckJnZ3JCZ0VGQlFjd0FvWmZhSFIwY0RvdkwyRnBZVFF1ZW1GMFkyRXVaMjkyTG5OaEwwTmxjblJGYm5KdmJHd3ZVRkphUlVsdWRtOXBZMlZUUTBFMExtVjRkR2RoZW5RdVoyOTJMbXh2WTJGc1gxQlNXa1ZKVGxaUFNVTkZVME5CTkMxRFFTZ3hLUzVqY25Rd0RnWURWUjBQQVFIL0JBUURBZ2VBTUR3R0NTc0dBUVFCZ2pjVkJ3UXZNQzBHSlNzR0FRUUJnamNWQ0lHR3FCMkUwUHNTaHUyZEpJZk8reG5Ud0ZWbWgvcWxaWVhaaEQ0Q0FXUUNBUkl3SFFZRFZSMGxCQll3RkFZSUt3WUJCUVVIQXdNR0NDc0dBUVVGQndNQ01DY0dDU3NHQVFRQmdqY1ZDZ1FhTUJnd0NnWUlLd1lCQlFVSEF3TXdDZ1lJS3dZQkJRVUhBd0l3Q2dZSUtvWkl6ajBFQXdJRFNBQXdSUUloQUxFL2ljaG1uV1hDVUtVYmNhM3ljaThvcXdhTHZGZEhWalFydmVJOXVxQWJBaUE5aEM0TThqZ01CQURQU3ptZDJ1aVBKQTZnS1IzTEUwM1U3NWVxYkMvclhBPT0='

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