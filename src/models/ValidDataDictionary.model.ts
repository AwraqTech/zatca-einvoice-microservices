import Joi from "joi";

export const dataDictionaryMandatorySchema = Joi.object({
    orgLogo: Joi.string().required(),
    branch: Joi.string().required(),
    crNum: Joi.string().required(),
    cashierName: Joi.string().required(),
    orderNum: Joi.string().required(),
    businessProccessType: Joi.string().required(),
    invoiceNumber: Joi.string().required(),
    uuid: Joi.string()
        .pattern(/^[a-zA-Z0-9-]+$/)
        .required(),
    invoiceIssueDate: Joi.date().iso().required(),
    invoiceIssueTime: Joi.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/) // HH:mm:ss format
        .required(),
    invoiceTypeCode: Joi.string()
        .valid("388", "381", "383")
        .required(),
    invoiceTypeTransaction: Joi.string()
        .pattern(/^0[12][01][01][01][01][01]$/) // Matches the specific structure NNPNESB
        .required(),
    invoiceCurrencyCode: Joi.string().required(),
    taxCurrencyCode: Joi.string()
        .pattern(/^[A-Z]{3}$/) // ISO 4217 Currency codes (3 uppercase letters)
        .required(),
    billingId: Joi.string().required(),
    invoiceCounterValue: Joi.string()
        .pattern(/^\d+$/) // Numeric values only
        .required(),
    prevInvoiceHash: Joi.string().required(),
    invoiceQrCode: Joi.string().required(),
    cryptographicStamp: Joi.string().required(),
    addressStreet: Joi.string().required(),
    addressBuildingNum: Joi.string().required(),
    addressCity: Joi.string().required(),
    addressPostalCode: Joi.string()
        .pattern(/^\d{5}$/) // 5 digits
        .required(),
    addressDistrict: Joi.string().required(),
    addressCountryCode: Joi.string().required(),
    vatRegisterationNum: Joi.string()
        .pattern(/^\d{15}$/) // 15 digits only
        .required(),
    sellerName: Joi.string().required(),
    reasonForDebitOrCredit: Joi.string().required(),
    sumOILNA: Joi.number()
        .precision(0) // No decimal places
        .required(), // SOILNA short form of (Sum Of Invoice Line Net Amount)
    currencySOILNA: Joi.string().required(), // SOILNA short form of (Sum Of Invoice Line Net Amount)
    invoiceTANoVat: Joi.number()
        .precision(0) // No decimal places
        .required(), // TANoVat short form of (Total Amount Without VAT)
    currencyTANoVat: Joi.string().required(), // TANoVat short form of (Total Amount Without VAT)
    invoiceTVATA: Joi.number().required(), // TVATA short form of (Total VAT Amount)
    currencyTVATA: Joi.string().required(), // TVATA short form of (Total VAT Amount)
    invoiceTVatAIAC: Joi.number().required(), // TVatAIAC short form of (Total VAT Amount In Accounting Currency)
    currencyTVatAIAC: Joi.string().required(), // TVatAIAC short form of (Total VAT Amount In Accounting Currency)
    invoiceTAWithVat: Joi.number().required(), // TAWithVat short form of (Total Amount With VAT)
    currencyTAWithVat: Joi.string().required(), // TAWithVat short form of (Total Amount With VAT)
    ammountDueForPay: Joi.number().required(),
    vatCTA: Joi.number().required(), // CTA short form of (Category Taxable Amount)
    currencyVatCTA: Joi.string().required(), // CTA short form of (Category Taxable Amount)
    vatCatTaxAmount: Joi.number().required(), // This for (Category Tax Amount)
    currencyCatTaxAmount: Joi.string().required(), // This for (Category Tax Amount)
    vatCatCode: Joi.string()
        .valid("S", "Z", "E", "O") // UNCL5305
        .required(),
    vatCatRate: Joi.number()
        .precision(2) // Up to 2 decimal places
        .min(0.0)
        .max(100.0) // Range: 0.00 to 100.00
        .required(),
    taxSchemeId: Joi.string().required(),
    customerAddressStreet: Joi.string().required(),
    customerAddressBuildingNum: Joi.string().required(),
    customerAddressDistrict: Joi.string().required(),
    customerAddressCity: Joi.string().required(),
    customerAddressCountryCode: Joi.string().required(),
    customerVatNumber: Joi.string().required().pattern(/^\d{15}$/),
    customerName: Joi.string().required(),
    customerAddressPostalCode: Joi.string().required(),
    paymentMeansCode: Joi.string().required(),
    invoiceLine: Joi.array().items(
        Joi.object({
            invoiceLineId: Joi.string().required(),
            invoiceQty: Joi.number().required(),
            invoiceLineNetAmount: Joi.number()
                .precision(2) // Up to 2 decimal places
                .max(999999999999.99) // Maximum 14 characters
                .required(),
            currencyILNA: Joi.string().required(), // ILNA short form of (Invoice Line Net Amount)
            itemName: Joi.string().required(),
            itemNetPrice: Joi.number().required(),
            currencyINP: Joi.string().required(), // INP short form of (Item Net Price)
            invoiceIVatCC: Joi.string()
                .valid("S", "Z", "E", "O") // Example subset of UNCL5305
                .required(), // IVatCC short form of (Item VAT Category Code)
            invoiceIVatR: Joi.number().required(), // IVatR short form of (Item VAT Rate)
            taxSchemeId: Joi.string().required()
        })
    ).required(),
});

// Helper function for validation
export const validateDataDictionaryMandatory = (data: unknown) => {
    const { error, value } = dataDictionaryMandatorySchema.validate(data, {
        abortEarly: false,
        allowUnknown: false,
    });
    if (error) {
        throw new Error(
            `Validation error: ${error.details.map((x) => x.message).join(", ")}`
        );
    }
    return value;
};
