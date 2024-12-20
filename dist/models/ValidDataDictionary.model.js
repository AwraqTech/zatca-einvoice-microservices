"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDataDictionaryMandatory = exports.dataDictionaryMandatorySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.dataDictionaryMandatorySchema = joi_1.default.object({
    orgLogo: joi_1.default.string().required(),
    branch: joi_1.default.string().required(),
    crNum: joi_1.default.string().required(),
    cashierName: joi_1.default.string().required(),
    orderNum: joi_1.default.string().required(),
    businessProccessType: joi_1.default.string().required(),
    invoiceNumber: joi_1.default.string().required(),
    uuid: joi_1.default.string()
        .pattern(/^[a-zA-Z0-9-]+$/)
        .required(),
    invoiceIssueDate: joi_1.default.date().iso().required(),
    invoiceIssueTime: joi_1.default.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/) // HH:mm:ss format
        .required(),
    invoiceTypeCode: joi_1.default.string()
        .valid("380", "381", "383", "386", "389", "390", "393", "394")
        .required(),
    invoiceTypeTransaction: joi_1.default.string()
        .pattern(/^0[12][01][01][01][01][01]$/) // Matches the specific structure NNPNESB
        .required(),
    invoiceCurrencyCode: joi_1.default.string().required(),
    taxCurrencyCode: joi_1.default.string()
        .pattern(/^[A-Z]{3}$/) // ISO 4217 Currency codes (3 uppercase letters)
        .required(),
    billingId: joi_1.default.string().required(),
    invoiceCounterValue: joi_1.default.string()
        .pattern(/^\d+$/) // Numeric values only
        .required(),
    prevInvoiceHash: joi_1.default.string().required(),
    invoiceQrCode: joi_1.default.string().required(),
    cryptographicStamp: joi_1.default.string().required(),
    addressStreet: joi_1.default.string().required(),
    addressBuildingNum: joi_1.default.string().required(),
    addressCity: joi_1.default.string().required(),
    addressPostalCode: joi_1.default.string()
        .pattern(/^\d{5}$/) // 5 digits
        .required(),
    addressDistrict: joi_1.default.string().required(),
    addressCountryCode: joi_1.default.string().required(),
    vatRegisterationNum: joi_1.default.string()
        .pattern(/^\d{15}$/) // 15 digits only
        .required(),
    sellerName: joi_1.default.string().required(),
    reasonForDebitOrCredit: joi_1.default.string().required(),
    sumOILNA: joi_1.default.number()
        .precision(0) // No decimal places
        .required(), // SOILNA short form of (Sum Of Invoice Line Net Amount)
    currencySOILNA: joi_1.default.string().required(), // SOILNA short form of (Sum Of Invoice Line Net Amount)
    invoiceTANoVat: joi_1.default.number()
        .precision(0) // No decimal places
        .required(), // TANoVat short form of (Total Amount Without VAT)
    currencyTANoVat: joi_1.default.string().required(), // TANoVat short form of (Total Amount Without VAT)
    invoiceTVATA: joi_1.default.number().required(), // TVATA short form of (Total VAT Amount)
    currencyTVATA: joi_1.default.string().required(), // TVATA short form of (Total VAT Amount)
    invoiceTVatAIAC: joi_1.default.number().required(), // TVatAIAC short form of (Total VAT Amount In Accounting Currency)
    currencyTVatAIAC: joi_1.default.string().required(), // TVatAIAC short form of (Total VAT Amount In Accounting Currency)
    invoiceTAWithVat: joi_1.default.number().required(), // TAWithVat short form of (Total Amount With VAT)
    currencyTAWithVat: joi_1.default.string().required(), // TAWithVat short form of (Total Amount With VAT)
    ammountDueForPay: joi_1.default.number().required(),
    vatCTA: joi_1.default.number().required(), // CTA short form of (Category Taxable Amount)
    currencyVatCTA: joi_1.default.string().required(), // CTA short form of (Category Taxable Amount)
    vatCatTaxAmount: joi_1.default.number().required(), // This for (Category Tax Amount)
    currencyCatTaxAmount: joi_1.default.string().required(), // This for (Category Tax Amount)
    vatCatCode: joi_1.default.string()
        .valid("S", "Z", "E", "O") // UNCL5305
        .required(),
    vatCatRate: joi_1.default.number()
        .precision(2) // Up to 2 decimal places
        .min(0.0)
        .max(100.0) // Range: 0.00 to 100.00
        .required(),
    taxSchemeId: joi_1.default.string().required(),
    invoiceLine: joi_1.default.array().items(joi_1.default.object({
        invoiceLineId: joi_1.default.string().required(),
        invoiceQty: joi_1.default.number().required(),
        invoiceLineNetAmount: joi_1.default.number()
            .precision(2) // Up to 2 decimal places
            .max(999999999999.99) // Maximum 14 characters
            .required(),
        currencyILNA: joi_1.default.string().required(), // ILNA short form of (Invoice Line Net Amount)
        itemName: joi_1.default.string().required(),
        itemNetPrice: joi_1.default.number().required(),
        currencyINP: joi_1.default.string().required(), // INP short form of (Item Net Price)
    })).required(),
    invoiceIVatCC: joi_1.default.string()
        .valid("S", "Z", "E", "O") // Example subset of UNCL5305
        .required(), // IVatCC short form of (Item VAT Category Code)
    invoiceIVatR: joi_1.default.number().required(), // IVatR short form of (Item VAT Rate)
    taxSchemeIdTow: joi_1.default.string().required(),
});
// Helper function for validation
const validateDataDictionaryMandatory = (data) => {
    const { error, value } = exports.dataDictionaryMandatorySchema.validate(data, {
        abortEarly: false,
        allowUnknown: false,
    });
    if (error) {
        throw new Error(`Validation error: ${error.details.map((x) => x.message).join(", ")}`);
    }
    return value;
};
exports.validateDataDictionaryMandatory = validateDataDictionaryMandatory;
