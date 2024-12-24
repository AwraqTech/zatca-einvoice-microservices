import { create } from "xmlbuilder2";

/**
 * Create a UBL XML structure with placeholders for digital signature values.
 * @returns The UBL XML string.
 */
export default function createUBLSignatureXML() {
    const xml = create({ version: '1.0', encoding: 'UTF-8' })
        .ele('ext:UBLExtensions', { xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2' })
        .ele('ext:UBLExtension')
        .ele('ext:ExtensionContent')
        .ele('sig:UBLDocumentSignatures', {
            'xmlns:sig': "urn:oasis:names:specification:ubl:schema:xsd:CommonSignatureComponents-2",
            'xmlns:sac': "urn:oasis:names:specification:ubl:schema:xsd:SignatureAggregateComponents-2",
            'xmlns:sbc': "urn:oasis:names:specification:ubl:schema:xsd:SignatureBasicComponents-2",
            'xmlns:xades': "urn:oasis:names:specification:ubl:schema:xsd:XAdESv141-2"
        })
        .ele('sac:SignatureInformation')
        .ele('cbc:ID').txt('urn:oasis:names:specification:ubl:signature:1').up()
        .ele('sbc:ReferencedSignatureID').txt('urn:oasis:names:specification:ubl:signature:Invoice').up()
        .ele('ds:Signature')
        .ele('ds:SignatureValue').txt('[Digital Signature]').up()
        .ele('ds:KeyInfo').txt('[Public Key or Certificate]').up()
        .up() // Close ds:Signature
        .up() // Close sac:SignatureInformation
        .up() // Close sig:UBLDocumentSignatures
        .up() // Close ext:ExtensionContent
        .up() // Close ext:UBLExtension
        .up() // Close ext:UBLExtensions
        .end({ prettyPrint: true });

    return xml;
}
