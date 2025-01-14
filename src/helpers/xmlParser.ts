import { parseStringPromise } from "xml2js";

/**
 * Parses an XML document and converts it to a JavaScript object.
 * @param xmlString - The XML document as a string.
 * @returns A promise that resolves to the parsed JavaScript object.
 * @throws An error if the parsing fails.
 */
export default async function xmlParser(xmlString: string): Promise<any> {
    try {
        const result = await parseStringPromise(xmlString);
        return result;
    } catch (error: any) {
        throw new Error(`Failed to parse XML document: ${error.message}`);
    }
};
