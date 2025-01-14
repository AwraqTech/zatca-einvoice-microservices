import { Request, Response } from "express";
import { validateDataDictionaryMandatory } from "../models/ValidDataDictionary.model";
import { DataDictionaryMandatory } from "../models/DataDictionaryMandatory";
import { generateQRCodeBase64 } from "../helpers/qrCodeGenEcode";
import { generateUBLXml } from "../services/xml-ubl-generation/simplifiedTax";
import { generateQRCodeBase64XML } from "../helpers/qrCodeXMLTLVBase64";

export async function generateInvoiceXMLController(req: Request, res: Response) {
    try {
        const data: DataDictionaryMandatory = req.body;

        // Validate incoming data
        const validatedData = validateDataDictionaryMandatory(data);

        // Ensure invoiceIssueTime and invoiceIssueDate are strings
        const issueDate = typeof validatedData.invoiceIssueDate === "string"
            ? validatedData.invoiceIssueDate
            : validatedData.invoiceIssueDate.toISOString();

        const issueTime = typeof validatedData.invoiceIssueTime === "string"
            ? validatedData.invoiceIssueTime
            : new Date(validatedData.invoiceIssueTime).toISOString(); // Convert to Date if needed

        // Generate XML document
        const xml = generateUBLXml(validatedData);

        res.set("Content-Type", "application/xml");
        res.send(xml);
    } catch (error: any) {
        res.status(500).send({
            message: "Failed to generate PDF",
            error: error.message,
        });
    }
}