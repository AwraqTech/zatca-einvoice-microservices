"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEInvoice = void 0;
const xmlbuilder_1 = __importDefault(require("xmlbuilder"));
const createEInvoice = (req, res) => {
    const { buyerName, sellerName, vatNumber, totalAmount } = req.body;
    if (!buyerName || !sellerName || !vatNumber || !totalAmount) {
        res.status(400).json({ message: "Invalid Data Provided" });
    }
    ;
    const vatRate = 0.15;
    const vatAmount = totalAmount * vatRate;
    const totalWithVat = totalAmount + vatAmount;
    const invoice = xmlbuilder_1.default.create('Invoice')
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
        .end({ pretty: true });
    ;
    res.status(200).json({ invoiceXML: invoice });
};
exports.createEInvoice = createEInvoice;
