import { createHash } from "crypto";
import { XmlCanonicalizer } from "xmldsigjs";
import { DOMParser } from "xmldom"; // Use xmldom for parsing strings into DOM nodes
import { XMLDocument } from "./xmlParser";

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
 * Removes (UBLExtensions (Signing), Signature Envelope, and QR data) Elements. Then canonicalizes the XML to c14n.
 * In Order to prep for hashing.
 * @param invoice_xml XMLDocument.
 * @returns purified Invoice XML string.
 */
const getPureInvoiceString = (invoice_xml: XMLDocument): string => {
    const invoicePurefied = new XMLDocument(removeXMLDeclaration(invoice_xml.toString({ no_header: false })));
    invoicePurefied.delete("Invoice/ext:UBLExtensions");
    invoicePurefied.delete("Invoice/cac:Signature");
    invoicePurefied.delete("Invoice/cac:AdditionalDocumentReference", { "cbc:ID": "QR" });

    const invoice_xml_dom = new DOMParser().parseFromString(
        invoicePurefied.toString({ no_header: false })
    );

    const canonicalizer = new XmlCanonicalizer(false, false);
    const canonicalized_xml_str: string = canonicalizer.Canonicalize(invoice_xml_dom);

    return canonicalized_xml_str;
};

/**
 * Hashes Invoice according to ZATCA.
 * https://zatca.gov.sa/ar/E-Invoicing/SystemsDevelopers/Documents/20220624_ZATCA_Electronic_Invoice_Security_Features_Implementation_Standards.pdf
 * 2.3.3: Follows same method as PIH (Previous invoice hash BS: KSA-13).
 * @param invoice_xml XMLDocument.
 * @returns String invoice hash encoded in base64.
 */
const getInvoiceHash = (invoice_xml: XMLDocument): string => {
    let pure_invoice_string: string = getPureInvoiceString(invoice_xml);
    // A workaround for ZATCA XML quirks
    pure_invoice_string = pure_invoice_string.replace("<cbc:ProfileID>", "\n    <cbc:ProfileID>");
    pure_invoice_string = pure_invoice_string.replace("<cac:AccountingSupplierParty>", "\n    \n    <cac:AccountingSupplierParty>");

    return createHash("sha256").update(pure_invoice_string).digest('base64');
};

/**
 * Generates a hash for the invoice.
 * @param invoiceXML Raw XML string.
 * @returns An object containing Base64-encoded and plain SHA-256 hashes.
 */
const genInvoiceHash = ({ invoiceXML }: InvoiceHashProps) => {
    try {
        // Parse the raw XML string into an XMLDocument
        const invoiceXMLDoc = new XMLDocument(invoiceXML);

        // Generate the invoice hash
        const base64Hash = getInvoiceHash(invoiceXMLDoc);

        // Generate SHA-256 hash in hex format
        const sha256Hash = createHash("sha256").update(base64Hash).digest("hex");

        // Return both hashes as an object
        return { sha256Hash, base64Hash };
    } catch (error: any) {
        throw new Error(`Failed to generate invoice hash: ${error.message}`);
    }
};

export default genInvoiceHash;
