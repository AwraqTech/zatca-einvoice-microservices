import { createHash } from "crypto";
import { XmlCanonicalizer } from "xmldsigjs";
import { DOMParser } from "xmldom"; // Use xmldom for parsing strings into DOM nodes
import XMLDocument from "./xmlParser";

interface InvoiceHashProps {
    invoiceXML: string;
}

/**
 * Removes the XML declaration (if any) from the invoice XML string.
 * @param xmlString Raw XML string.
 * @returns Cleaned XML string without the declaration.
 */
const removeXMLDeclaration = (xmlString: string): string => {
    return xmlString.replace(/<\?xml[^>]*\?>/, ''); // Regular expression to remove XML declaration
};

/**
 * Cleans and canonicalizes the invoice XML.
 * @param invoiceXML Raw XML string.
 * @returns Canonicalized XML string.
 */
const getPureInvoiceString = (invoiceXML: string): string => {
    const cleanedXML = removeXMLDeclaration(invoiceXML);

    const doc = new XMLDocument(cleanedXML);

    // Remove unnecessary nodes
    doc.delete("Invoice/ext:UBLExtensions");
    doc.delete("Invoice/cbc:UBLVersionID");
    doc.delete("Invoice/cac:Signature");
    doc.delete("Invoice/cac:AdditionalDocumentReference", { "cbc:ID": "QR" });

    // Convert cleaned XML back to a string
    const xmlString = doc.toString();

    // Parse the string into a DOM Document
    const dom = new DOMParser().parseFromString(xmlString, "application/xml");

    // Canonicalize the DOM Document
    const canonicalizer = new XmlCanonicalizer(false, false);
    return canonicalizer.Canonicalize(dom);
};

/**
 * Generates a hash for the invoice.
 * @param invoiceXML Raw XML string.
 * @returns An object containing Base64-encoded and plain SHA-256 hashes.
 */
const genInvoiceHash = ({ invoiceXML }: InvoiceHashProps) => {
    try {
        // Step 1: Get the pure (canonicalized) invoice string
        let pureInvoiceString = getPureInvoiceString(invoiceXML);

        // Adjustments for ZATCA quirks
        pureInvoiceString = pureInvoiceString.replace(
            "<cbc:ProfileID>",
            "\n    <cbc:ProfileID>"
        );
        pureInvoiceString = pureInvoiceString.replace(
            "<cac:AccountingSupplierParty>",
            "\n    \n    <cac:AccountingSupplierParty>"
        );

        // Step 2: Generate both Base64-encoded and SHA-256 hashes
        const hashedInvoiceBase64 = createHash("sha256").update(pureInvoiceString).digest("base64");
        const hashedInvoiceSha256 = createHash("sha256").update(pureInvoiceString).digest("hex"); // Hex format for SHA-256

        // Return both hashes as an object
        return { hashedInvoiceBase64, hashedInvoiceSha256 };
    } catch (error: any) {
        throw new Error(`Failed to generate invoice hash: ${error.message}`);
    }
};

export default genInvoiceHash;
