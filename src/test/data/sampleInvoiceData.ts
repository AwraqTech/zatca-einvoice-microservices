import { Invoice } from "../../models/InvoiceXML";

const sampleInvoiceData: Invoice = {
    profileId: "12345",
    id: "SME00010",
    uuid: "ed22f1d8-e6a2-1118-9b58-d9a8f11e445f",
    issueDate: "2024-01-01T00:00:00Z",
    issueTime: "12:30:45",
    invoiceCounterValue: 10,
    invoiceTypeCode: { name: "0200000", value: "388" },
    documentCurrencyCode: "SAR",
    taxCurrencyCode: "SAR",
    note: "Sample note for the invoice",
    additionalDocumentReferences: [
        {
            id: "ICV",
            uuid: 10
        },
        {
            id: "PIH",
            attachment: {
                mimeCode: "text/plain",
                embeddedDocumentBinaryObject: "HASHED_INVOICE"
            }
        },
        {
            id: "QR",
            attachment: {
                mimeCode: "text/plain",
                embeddedDocumentBinaryObject: "QR_CODE_HASHED"
            }
        }
    ],
    accountingSupplierParty: {
        partyIdentification: { id: "3999999999", schemeId: "CRN" },
        postalAddress: {
            streetName: "RRRD2929",
            buildingNumber: "1234",
            plotIdentification: "A1",
            citySubdivisionName: "Downtown",
            cityName: "Sample City",
            postalZone: "10001",
            country: { identificationCode: "SA" }
        },
        partyTaxScheme: { companyId: "399999999900003", taxScheme: { id: "VAT" } },
        partyLegalEntity: { registrationName: "Maximum Speed Tech Supply LTD" }
    },
    accountingCustomerParty: {
        partyIdentification: { id: "0987654321", schemeId: "CRN" },
        postalAddress: {
            streetName: "Second St",
            buildingNumber: "1234",
            plotIdentification: "B2",
            citySubdivisionName: "Uptown",
            cityName: "Test City",
            postalZone: "20002",
            country: { identificationCode: "SA" }
        },
        partyTaxScheme: { companyId: "312345678901343", taxScheme: { id: "VAT" } },
        partyLegalEntity: { registrationName: "Test Corp" }
    },
    allowanceCharges: [
        {
            chargeIndicator: true,
            allowanceChargeReason: "Late Fee",
            allowanceChargeReasonCode: 'AEB',
            amount: { currencyId: "SAR", value: 50 },
            taxCategory: { id: "S", percent: 15, taxScheme: { id: "VAT" } }
        },
        {
            chargeIndicator: false,
            allowanceChargeReason: "Promotional Discount",
            allowanceChargeReasonCode: 'AEB',
            amount: { currencyId: "SAR", value: 25 },
            taxCategory: { id: "S", percent: 15, taxScheme: { id: "VAT" } }
        }
    ],
    taxTotals: [
        {
            taxAmount: { currencyId: "SAR", value: 150 },
            roundingAmount: 0.00,
            taxSubtotals: [
                {
                    taxableAmount: { currencyId: "SAR", value: 1000 },
                    taxAmount: { currencyId: "SAR", value: 150 },
                    taxCategory: { id: "S", percent: 15, taxScheme: { id: "VAT" } }
                }
            ]
        }
    ],
    legalMonetaryTotal: {
        lineExtensionAmount: { currencyId: "SAR", value: 1000 },
        taxExclusiveAmount: { currencyId: "SAR", value: 1000 },
        chargeTotalAmount: { currencyId: "SAR", value: 1000 },
        taxInclusiveAmount: { currencyId: "SAR", value: 1150 },
        allowanceTotalAmount: { currencyId: "SAR", value: 100 },
        prepaidAmount: { currencyId: "SAR", value: 0 },
        PayableRoundingAmount: { currencyId: "SAR", value: 0 },
        payableAmount: { currencyId: "SAR", value: 1050 }
    },
    invoiceLines: [
        {
            id: "1",
            invoicedQuantity: { unitCode: "PCE", value: 10 },
            lineExtensionAmount: { currencyId: "SAR", value: 1000 },
            taxTotal: {
                taxAmount: { currencyId: "SAR", value: 150 },
                roundingAmount: 0.01,
                taxSubtotals: [
                    {
                        taxableAmount: { currencyId: "SAR", value: 1000 },
                        taxAmount: { currencyId: "SAR", value: 150 },
                        taxCategory: { id: "S", percent: 15, taxScheme: { id: "VAT" } }
                    }
                ]
            },
            item: {
                name: "Product A",
                classifiedTaxCategory: { id: "S", percent: 15, taxScheme: { id: "VAT" } }
            },
            price: {
                priceAmount: { currencyId: "SAR", value: 100 },
                allowanceCharge: {
                    chargeIndicator: true,
                    allowanceChargeReason: "Discount",
                    allowanceChargeReasonCode: 'AEB',
                    amount: { currencyId: "SAR", value: 10 },
                    taxCategory: { id: "S", percent: 15, taxScheme: { id: "VAT" } }
                }
            }
        }
    ],
    paymentMeans: { code: "10" }
};

export { sampleInvoiceData };