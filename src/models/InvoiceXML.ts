export interface Invoice {
    profileId: string;
    id: string;
    uuid: string;
    issueDate: string;
    issueTime: string;
    invoiceTypeCode: { name: string; value: string };
    documentCurrencyCode: string;
    taxCurrencyCode: string;
    note: string;
    additionalDocumentReferences: AdditionalDocumentReference[];
    accountingSupplierParty: Party;
    accountingCustomerParty: Party;
    allowanceCharges: AllowanceCharge[];
    taxTotals: TaxTotal[];
    legalMonetaryTotal: LegalMonetaryTotal;
    invoiceLines: InvoiceLine[];
    paymentMeans: PaymentMeans;
}

interface AdditionalDocumentReference {
    id: string;
    uuid?: number;
    attachment?: {
        mimeCode: string;
        embeddedDocumentBinaryObject: string;
    };
}

interface Party {
    partyIdentification: { id: string; schemeId?: string };
    postalAddress: PostalAddress;
    partyTaxScheme: PartyTaxScheme;
    partyLegalEntity: { registrationName: string };
}

interface PostalAddress {
    streetName: string;
    buildingNumber: string;
    plotIdentification: string;
    citySubdivisionName: string;
    cityName: string;
    postalZone: string;
    country: { identificationCode: string };
}

interface PartyTaxScheme {
    companyId?: string;
    taxScheme: { id: string };
}

interface AllowanceCharge {
    chargeIndicator: boolean;
    allowanceChargeReason: string;
    amount: { currencyId: string; value: number };
    taxCategory: TaxCategory;
}

interface TaxCategory {
    id: string;
    percent: number;
    taxExemptionReasonCode?: string;
    taxExemptionReason?: string;
    taxScheme: { id: string };
}

interface TaxTotal {
    taxAmount: { currencyId: string; value: number };
    roundingAmount?: number;
    taxSubtotals?: TaxSubtotal[];
}

interface TaxSubtotal {
    taxableAmount: { currencyId: string; value: number };
    taxAmount: { currencyId: string; value: number };
    taxCategory: TaxCategory;
}

interface LegalMonetaryTotal {
    lineExtensionAmount: { currencyId: string; value: number };
    taxExclusiveAmount: { currencyId: string; value: number };
    taxInclusiveAmount: { currencyId: string; value: number };
    allowanceTotalAmount: { currencyId: string; value: number };
    prepaidAmount: { currencyId: string; value: number };
    payableAmount: { currencyId: string; value: number };
}

interface InvoiceLine {
    id: string;
    invoicedQuantity: { unitCode: string; value: number };
    lineExtensionAmount: { currencyId: string; value: number };
    taxTotal: TaxTotal;
    item: {
        name: string;
        classifiedTaxCategory: TaxCategory;
    };
    price: {
        priceAmount: { currencyId: string; value: number };
        allowanceCharge?: AllowanceCharge;
    };
}

interface PaymentMeans {
    code: string;
}
