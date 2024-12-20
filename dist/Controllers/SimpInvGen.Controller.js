"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoiceController = generateInvoiceController;
const ValidDataDictionary_model_1 = require("../models/ValidDataDictionary.model");
const InvoiceTax_1 = require("../services/pdf-generation/InvoiceTax");
const qrCodeGenEcode_1 = require("../helpers/qrCodeGenEcode");
function generateInvoiceController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = req.body;
            // Validate incoming data
            const validatedData = (0, ValidDataDictionary_model_1.validateDataDictionaryMandatory)(data);
            // Ensure invoiceIssueTime and invoiceIssueDate are strings
            const issueDate = typeof validatedData.invoiceIssueDate === "string"
                ? validatedData.invoiceIssueDate
                : validatedData.invoiceIssueDate.toISOString();
            const issueTime = typeof validatedData.invoiceIssueTime === "string"
                ? validatedData.invoiceIssueTime
                : new Date(validatedData.invoiceIssueTime).toISOString(); // Convert to Date if needed
            // Generate QR Code
            const qrCodeBase64 = yield (0, qrCodeGenEcode_1.generateQRCodeBase64)({
                sellerName: validatedData.sellerName,
                vatRegNum: validatedData.vatRegisterationNum,
                date: issueDate,
                time: issueTime,
                invTotalWithVat: validatedData.invoiceTAWithVat.toString(),
                vatTotal: validatedData.invoiceTVATA.toString(),
            });
            // Generate PDF document
            const doc = (0, InvoiceTax_1.invoiceTaxGenerationPdf)(validatedData, qrCodeBase64);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename="${data.invoiceNumber}.pdf"`);
            // Pipe the PDF document to the response
            (yield doc).pipe(res);
            (yield doc).end();
        }
        catch (error) {
            res.status(500).send({
                message: "Failed to generate PDF",
                error: error.message,
            });
        }
    });
}
