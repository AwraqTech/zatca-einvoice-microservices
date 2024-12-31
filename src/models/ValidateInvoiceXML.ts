import Joi from "joi";
import { Invoice } from "./InvoiceXML";

const validInvoiceXML = Joi.object({
    profileId: Joi.string().required(),
    id: Joi.string().required(),
    uuid: Joi.string()
        .pattern(/^[a-zA-Z0-9-]+$/)
        .required(),
    issueDate: Joi.date().iso().required(),
    issueTime: Joi.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
        .required(),
    invoiceTypeCode: Joi.object({
        name: Joi.string()
            .valid("0100000", "0200000")
            .required(),
        value: Joi.string()
            .valid("388", "381", "383")
            .required(),
    }).required(),
    documentCurrencyCode: Joi.string()
        .pattern(/^[A-Z]{3}$/)
        .required(),
    taxCurrencyCode: Joi.string()
        .pattern(/^[A-Z]{3}$/)
        .required(),
    note: Joi.string().required(),
    additionalDocumentReferences: Joi.array().items(
        Joi.object({
            id: Joi.string()
                .valid("ICV", "PIH", "QR")
                .required(),
            uuid: Joi.number(),
            attachment: Joi.object({
                mimeCode: Joi.string()
                    .valid("text/plain")
                    .required(),
                embeddedDocumentBinaryObject: Joi.string().required(),
            })
        })
    ).required(),
    accountingSupplierParty: Joi.object({
        partyIdentification: Joi.object({
            id: Joi.string()
                .pattern(/^\d{10}$/)
                .length(10)
                .required(),
            schemeId: Joi.string()
                .valid("CRN"),
        }).required(),
        postalAddress: Joi.object({
            streetName: Joi.string().required(),
            buildingNumber: Joi.string().required(),
            plotIdentification: Joi.string().required(),
            citySubdivisionName: Joi.string().required(),
            cityName: Joi.string().required(),
            postalZone: Joi.string().required(),
            country: Joi.object({
                identificationCode: Joi.string()
                    .pattern(/^[A-Z]{2}$/)
                    .required()
            })
        }).required(),
        partyTaxScheme: Joi.object({
            companyId: Joi.string()
                .pattern(/^3[0-9]{13}3$/)
                .length(15),
            taxScheme: Joi.object({ id: Joi.string().valid("VAT").required() })
        }).required(),
        partyLegalEntity: Joi.object({
            registrationName: Joi.string().required()
        }).required()
    }).required(),
    accountingCustomerParty: Joi.object({
        partyIdentification: Joi.object({
            id: Joi.string()
                .pattern(/^\d{10}$/)
                .length(10)
                .required(),
            schemeId: Joi.string()
                .valid("CRN"),
        }).required(),
        postalAddress: Joi.object({
            streetName: Joi.string().required(),
            buildingNumber: Joi.string().required(),
            plotIdentification: Joi.string().required(),
            citySubdivisionName: Joi.string().required(),
            cityName: Joi.string().required(),
            postalZone: Joi.string().required(),
            country: Joi.object({
                identificationCode: Joi.string()
                    .pattern(/^[A-Z]{2}$/)
                    .required()
            }).required()
        }).required(),
        partyTaxScheme: Joi.object({
            companyId: Joi.string()
                .pattern(/^3[0-9]{13}3$/)
                .length(15),
            taxScheme: Joi.object({ id: Joi.string().valid("VAT").required() }).required()
        }).required(),
        partyLegalEntity: Joi.object({
            registrationName: Joi.string().required()
        }).required()
    }).required(),
    allowanceCharges: Joi.array().items(
        Joi.object({
            chargeIndicator: Joi.boolean().required(),
            allowanceChargeReason: Joi.string().required(),
            amount: Joi.object({
                currencyId: Joi.string().pattern(/^[A-Z]{3}$/).required(),
                value: Joi.number().required()
            }).required(),
            taxCategory: Joi.object({
                id: Joi.string().required(),
                percent: Joi.number().min(0).max(100).required(),
                taxScheme: Joi.object({ id: Joi.string().valid("VAT").required() })
            }).required()
        })
    ).required(),
    taxTotals: Joi.array().items(
        Joi.object({
            taxAmount: Joi.object({
                currencyId: Joi.string()
                    .pattern(/^[A-Z]{3}$/)
                    .required(),
                value: Joi.number().required()
            }).required(),
            roundingAmount: Joi.number(), // Added field for rounding amount
            taxSubtotals: Joi.array().items(
                Joi.object({
                    taxableAmount: Joi.object({
                        currencyId: Joi.string()
                            .pattern(/^[A-Z]{3}$/)
                            .required(),
                        value: Joi.number().required()
                    }).required(),
                    taxAmount: Joi.object({
                        currencyId: Joi.string()
                            .pattern(/^[A-Z]{3}$/)
                            .required(),
                        value: Joi.number().required()
                    }).required(),
                    taxCategory: Joi.object({
                        id: Joi.string()
                            .valid("S", "Z", "E", "O")
                            .required(),
                        percent: Joi.number()
                            .precision(2)
                            .min(0.0)
                            .max(100.0)
                            .required(),
                        taxExemptionReasonCode: Joi.string(),
                        taxExemptionReason: Joi.string(),
                        taxScheme: Joi.object({ id: Joi.string().valid("VAT").required() })
                    }).required(),
                })
            )
        }).required()
    ).required(),
    legalMonetaryTotal: Joi.object({
        lineExtensionAmount: Joi.object({
            currencyId: Joi.string()
                .pattern(/^[A-Z]{3}$/)
                .required(),
            value: Joi.number().required()
        }).required(),
        taxExclusiveAmount: Joi.object({
            currencyId: Joi.string()
                .pattern(/^[A-Z]{3}$/)
                .required(),
            value: Joi.number().required()
        }).required(),
        taxInclusiveAmount: Joi.object({
            currencyId: Joi.string()
                .pattern(/^[A-Z]{3}$/)
                .required(),
            value: Joi.number().required()
        }).required(),
        allowanceTotalAmount: Joi.object({
            currencyId: Joi.string()
                .pattern(/^[A-Z]{3}$/)
                .required(),
            value: Joi.number().required()
        }).required(),
        prepaidAmount: Joi.object({
            currencyId: Joi.string()
                .pattern(/^[A-Z]{3}$/)
                .required(),
            value: Joi.number().required()
        }).required(),
        payableAmount: Joi.object({
            currencyId: Joi.string()
                .pattern(/^[A-Z]{3}$/)
                .required(),
            value: Joi.number().required()
        }).required()
    }).required(),
    invoiceLines: Joi.array().items(
        Joi.object({
            id: Joi.string().required(),
            invoicedQuantity: Joi.object({
                unitCode: Joi.string().required(),
                value: Joi.number().required()
            }).required(),
            lineExtensionAmount: Joi.object({
                currencyId: Joi.string()
                    .pattern(/^[A-Z]{3}$/)
                    .required(),
                value: Joi.number().required()
            }).required(),
            taxTotal: Joi.object({
                taxAmount: Joi.object({
                    currencyId: Joi.string()
                        .pattern(/^[A-Z]{3}$/)
                        .required(),
                    value: Joi.number().required()
                }).required(),
                roundingAmount: Joi.number(),
                taxSubtotals: Joi.array().items(
                    Joi.object({
                        taxableAmount: Joi.object({
                            currencyId: Joi.string()
                                .pattern(/^[A-Z]{3}$/)
                                .required(),
                            value: Joi.number().required()
                        }).required(),
                        taxAmount: Joi.object({
                            currencyId: Joi.string()
                                .pattern(/^[A-Z]{3}$/)
                                .required(),
                            value: Joi.number().required()
                        }).required(),
                        taxCategory: Joi.object({
                            id: Joi.string()
                                .valid("S", "Z", "E", "O")
                                .required(),
                            percent: Joi.number()
                                .precision(2)
                                .min(0.0)
                                .max(100.0)
                                .required(),
                            taxExemptionReasonCode: Joi.string(),
                            taxExemptionReason: Joi.string(),
                            taxScheme: Joi.object({ id: Joi.string().valid("VAT").required() })
                        }).required()
                    })
                )
            }).required(),
            item: Joi.object({
                name: Joi.string().required(),
                classifiedTaxCategory: Joi.object({
                    id: Joi.string()
                        .valid("S", "Z", "E", "O")
                        .required(),
                    percent: Joi.number()
                        .precision(2)
                        .min(0.0)
                        .max(100.0)
                        .required(),
                    taxExemptionReasonCode: Joi.string(),
                    taxExemptionReason: Joi.string(),
                    taxScheme: Joi.object({ id: Joi.string().valid("VAT").required() })
                }).required()
            }).required(),
            price: Joi.object({
                priceAmount: Joi.object({
                    currencyId: Joi.string()
                        .pattern(/^[A-Z]{3}$/)
                        .required(),
                    value: Joi.number().required()
                }).required(),
                allowanceCharge: Joi.object({
                    chargeIndicator: Joi.boolean().required(),
                    allowanceChargeReason: Joi.string().required(),
                    amount: Joi.object({
                        currencyId: Joi.string()
                            .pattern(/^[A-Z]{3}$/)
                            .required(),
                        value: Joi.number().required()
                    }).required(),
                    taxCategory: Joi.object({
                        id: Joi.string()
                            .valid("S", "Z", "E", "O")
                            .required(),
                        percent: Joi.number()
                            .precision(2)
                            .min(0.0)
                            .max(100.0)
                            .required(),
                        taxExemptionReasonCode: Joi.string(),
                        taxExemptionReason: Joi.string(),
                        taxScheme: Joi.object({ id: Joi.string().valid("VAT").required() })
                    }).required()
                })
            })
        })
    ).required()
});

export function validateInvoiceXML(data: Invoice) {
    const { error, value } = validInvoiceXML.validate(data, {
        abortEarly: false,
        allowUnknown: false,
    });
    if (error) {
        throw new Error(
            `Validation error: ${error.details.map((x) => x.message).join(", ")}`
        );
    }
    return value;
}
