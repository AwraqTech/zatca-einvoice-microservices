import { Request, Response } from "express";
import builder from 'xmlbuilder';
import { InvoiceDetails } from "../types/invoiceDetails";

export const createEInvoice = (req: Request, res: Response) => {
    const { buyerName, sellerName, vatNumber, totalAmount }: InvoiceDetails = req.body;

    if (!buyerName || !sellerName || !vatNumber || !totalAmount) {
        res.status(400).json({ message: "Invalid Data Provided" });
    };

    const vatRate = 0.15;
    const vatAmount = totalAmount * vatRate;
    const totalWithVat = totalAmount + vatAmount;

    const invoice = builder.create('Invoice')
        .ele('Seller')
        .ele('Name', sellerName).up()
        .ele('VATNumber', vatNumber).up()
        .up()
        .ele('Buyer')
        .ele('Name', (buyerName || '')).up()
        .up()
        .ele('InvoiceDetails')
        .ele('TotalAmount', totalAmount).up()
        .ele('VATAmount', vatAmount).up()
        .ele('TotalWithVat', totalWithVat).up()
        .ele('Currency', 'SAR').up()
        .end({ pretty: true });;

    res.status(200).json({invoiceXML: invoice});
}