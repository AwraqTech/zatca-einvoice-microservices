import { createHash } from "crypto";
import { XmlCanonicalizer } from "xmldsigjs";
import xmldom from "xmldom";
import xmlParser from "./xmlParser";

interface InvoiceHashProps {
    invoiceXML: string;
}

// Function to canonicalize and clean the XML
const getPureInvoiceString = async (invoiceXML: string): Promise<string> => {
    const parsedXML = await xmlParser(invoiceXML);

    // Clone the parsed XML and remove unnecessary nodes
    const clonedXML = JSON.parse(JSON.stringify(parsedXML)); // Deep clone
    delete clonedXML["Invoice"]["ext:UBLExtensions"];
    delete clonedXML["Invoice"]["cbc:UBLVersionID"];
    delete clonedXML["Invoice"]["cac:Signature"];
    const additionalDocRefs = clonedXML["Invoice"]["cac:AdditionalDocumentReference"];
    if (Array.isArray(additionalDocRefs)) {
        clonedXML["Invoice"]["cac:AdditionalDocumentReference"] = additionalDocRefs.filter(
            (ref: any) => ref["cbc:ID"] !== "QR"
        );
    }

    // Rebuild the XML string
    const xmlString = new xmldom.DOMParser().parseFromString(JSON.stringify(clonedXML));
    const canonicalizer = new XmlCanonicalizer(false, false);
    const canonicalizedXmlStr = canonicalizer.Canonicalize(xmlString);

    return canonicalizedXmlStr;
};

// Main function to generate the invoice hash
export default async function genInvoiceHash({ invoiceXML }: InvoiceHashProps): Promise<string> {
    try {
        // Get the cleaned and canonicalized XML string
        let pureInvoiceString = await getPureInvoiceString(invoiceXML);

        // Adjust the XML structure for specific ZATCA requirements
        pureInvoiceString = pureInvoiceString.replace(
            "<cbc:ProfileID>",
            "\n    <cbc:ProfileID>"
        );
        pureInvoiceString = pureInvoiceString.replace(
            "<cac:AccountingSupplierParty>",
            "\n    \n    <cac:AccountingSupplierParty>"
        );

        // Generate the SHA256 hash in raw binary form (32 bytes)
        const hashBuffer = createHash("sha256").update(pureInvoiceString).digest();

        // Return the raw 32-byte hash (hex or base64 encoding for QR code)
        return hashBuffer.toString("base64");  // Return base64-encoded hash for the QR code
    } catch (error: any) {
        throw new Error(`Failed to generate invoice hash: ${error.message}`);
    }
}
