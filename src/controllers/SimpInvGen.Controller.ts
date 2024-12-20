import { Request, Response } from "express";
import { validateDataDictionaryMandatory } from "../models/ValidDataDictionary.model";
import { invoiceTaxGenerationPdf } from "../services/pdf-generation/InvoiceTax";
import { DataDictionaryMandatory } from "../models/DataDictionaryMandatory";
import { generateQRCodeBase64 } from "../helpers/qrCodeGenEcode";

export async function generateInvoiceController(req: Request, res: Response) {
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

        // Generate QR Code
        const qrCodeBase64 = await generateQRCodeBase64({
            sellerName: validatedData.sellerName,
            vatRegNum: validatedData.vatRegisterationNum,
            date: issueDate,
            time: issueTime,
            invTotalWithVat: validatedData.invoiceTAWithVat.toString(),
            vatTotal: validatedData.invoiceTVATA.toString(),
        });

        // Generate PDF document
        const doc = invoiceTaxGenerationPdf(validatedData, qrCodeBase64);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${data.invoiceNumber}.pdf"`);

        // Pipe the PDF document to the response
        (await doc).pipe(res);
        (await doc).end();

    } catch (error: any) {
        res.status(500).send({
            message: "Failed to generate PDF",
            error: error.message,
        });
    }
}
