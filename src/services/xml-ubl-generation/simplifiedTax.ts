import { create } from 'xmlbuilder2';
import { DataDictionaryMandatory } from '../../models/DataDictionaryMandatory';

export function generateUBLXml(data: DataDictionaryMandatory, qrCode: string): string {
    const doc = create({ version: "1.0", encoding: "UTF-8" })
        .ele("Invoice", {
            xmlns: "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
            "xmlns:cac": "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
            "xmlns:cbc": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
            "xmlns:ext": "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2",
            "xmlns:xsd": "http://www.w3.org/2001/XMLSchema"
        });

    // Invoice Information
    doc
        .ele("cbc:ProfileID").txt(data.businessProccessType).up()
        .ele("cbc:ID").txt(data.invoiceNumber).up()
        .ele("cbc:UUID").txt(data.uuid).up()
        .ele("cbc:IssueDate").txt(data.invoiceIssueDate.toISOString().split("T")[0]).up()
        .ele("cbc:IssueTime").txt(data.invoiceIssueTime).up()
        .ele("cbc:InvoiceTypeCode", { name: data.invoiceTypeTransaction }).txt(data.invoiceTypeCode).up()
        .ele("cbc:DocumentCurrencyCode").txt(data.invoiceCurrencyCode).up()
        .ele("cbc:TaxCurrencyCode").txt(data.taxCurrencyCode).up();

    // Additional Document Reference
    doc.ele("cac:AdditionalDocumentReference")
        .ele("cbc:ID").txt("ICV").up()
        .ele("cbc:UUID").txt(data.invoiceCounterValue).up()
        .up()
        .ele("cac:AdditionalDocumentReference")
        .ele("cbc:ID").txt("PIH").up()
        .ele("cac:Attachment")
        .ele("cbc:EmbeddedDocumentBinaryObject", { mimeCode: "text/plain" }).txt(data.prevInvoiceHash).up()
        .up()
        .up()
        .ele("cac:AdditionalDocumentReference")
        .ele("cbc:ID").txt("PIH").up()
        .ele("cac:Attachment")
        .ele("cbc:EmbeddedDocumentBinaryObject", { mimeCode: "text/plain" }).txt(qrCode).up()
        .up()
        .up();

    // Accounting Supplier Party
    const supplier = doc.ele("cac:AccountingSupplierParty").ele("cac:Party");
    supplier.ele("cac:PartyIdentification")
        .ele("cbc:ID", { schemeID: "CRN" }).txt(data.crNum).up()
        .up()
        .ele("cac:PostalAddress")
        .ele("cbc:StreetName").txt(data.addressStreet).up()
        .ele("cbc:BuildingNumber").txt(data.addressBuildingNum).up()
        .ele("cbc:CitySubdivisionName").txt(data.addressDistrict).up()
        .ele("cbc:CityName").txt(data.addressCity).up()
        .ele("cbc:PostalZone").txt(data.addressPostalCode).up()
        .ele("cac:Country")
        .ele("cbc:IdentificationCode").txt(data.addressCountryCode).up()
        .up()
        .up()
        .ele("cac:PartyTaxScheme")
        .ele("cbc:CompanyID").txt(data.vatRegisterationNum).up()
        .ele("cac:TaxScheme").ele("cbc:ID").txt("VAT").up()
        .up()
        .up()
        .ele("cac:PartyLegalEntity")
        .ele("cbc:RegistrationName").txt(data.sellerName).up()
        .up();

    // Accounting Customer Party (Modify dynamically later)
    const customer = doc.ele("cac:AccountingCustomerParty").ele("cac:Party");
    customer.ele("cac:PostalAddress")
        .ele("cbc:StreetName").txt(data.customerAddressStreet).up()
        .ele("cbc:BuildingNumber").txt(data.customerAddressBuildingNum).up()
        .ele("cbc:CitySubdivisionName").txt(data.customerAddressDistrict).up()
        .ele("cbc:CityName").txt(data.customerAddressCity).up()
        .ele("cbc:PostalZone").txt(data.customerAddressPostalCode).up()
        .ele("cac:Country")
        .ele("cbc:IdentificationCode").txt(data.customerAddressCountryCode).up()
        .up()
        .up()
        .ele("cac:PartyTaxScheme")
        .ele("cbc:CompanyID").txt(data.customerVatNumber).up()
        .ele("cac:TaxScheme")
        .ele("cbc:ID").txt("VAT").up()
        .up()
        .up()
        .ele("cac:PartyLegalEntity")
        .ele("cbc:RegistrationName").txt(data.customerName).up()
        .up();

    // Payment Means
    doc.ele("cac:PaymentMeans")
        .ele("cbc:PaymentMeansCode").txt(data.paymentMeansCode).up()
        .up();

    // Tax Total
    const taxTotal = doc.ele("cac:TaxTotal");
    taxTotal.ele("cbc:TaxAmount", { currencyID: data.currencyTVATA }).txt(`${data.invoiceTVATA}`).up();

    const taxSubtotal = taxTotal.ele("cac:TaxSubtotal");
    taxSubtotal
        .ele("cbc:TaxableAmount", { currencyID: data.currencyVatCTA }).txt(`${data.vatCTA}`).up()
        .ele("cbc:TaxAmount", { currencyID: data.currencyTVATA }).txt(`${data.invoiceTVATA}`).up()
        .ele("cac:TaxCategory")
        .ele("cbc:ID", { schemeID: "UN/ECE 5305", schemeAgencyID: "6" }).txt(data.vatCatCode).up()
        .ele("cbc:Percent").txt(`${data.vatCatRate.toFixed(2)}`).up()
        .ele("cac:TaxScheme")
        .ele("cbc:ID", { schemeID: "UN/ECE 5153", schemeAgencyID: "6" }).txt("VAT").up();

    const amountDueForPayment = data.invoiceTAWithVat - data.invoiceTANoVat + data.vatCTA;

    // Legal Monetary Total
    const legalTotal = doc.ele("cac:LegalMonetaryTotal");
    legalTotal
        .ele("cbc:LineExtensionAmount", { currencyID: data.currencySOILNA }).txt(`${data.sumOILNA}`).up()
        .ele("cbc:TaxExclusiveAmount", { currencyID: data.currencyTANoVat }).txt(`${data.invoiceTANoVat}`).up()
        .ele("cbc:TaxInclusiveAmount", { currencyID: data.currencyTAWithVat }).txt(`${data.invoiceTANoVat + data.invoiceTVATA}`).up()
        .ele("cbc:AllowanceTotalAmount", { currencyID: "SAR" }).txt("0.00").up() // Assuming no allowances
        .ele("cbc:PrepaidAmount", { currencyID: "SAR" }).txt("0.00").up() // Assuming no prepayment
        .ele("cbc:PayableAmount", { currencyID: "SAR" }).txt(amountDueForPayment.toFixed(2)).up(); // Amount due for payment

    // Invoice Lines
    // Iterate through each invoice line in the data
    for (const line of data.invoiceLine) {
        const invoiceLine = doc.ele("cac:InvoiceLine");

        // Invoice Line ID
        invoiceLine
            .ele("cbc:ID").txt(line.invoiceLineId).up()

            // Invoiced Quantity
            .ele("cbc:InvoicedQuantity", { unitCode: "PCE" }).txt(line.invoiceQty.toFixed(6)).up()

            // Line Extension Amount (Invoice Line Net Amount)
            .ele("cbc:LineExtensionAmount", { currencyID: line.currencyILNA })
            .txt(line.invoiceLineNetAmount.toFixed(2)) // Net amount for this line
            .up()

            // Tax Total
            .ele("cac:TaxTotal")
            .ele("cbc:TaxAmount", { currencyID: line.currencyILNA })
            .txt((line.invoiceLineNetAmount * line.invoiceIVatR / 100).toFixed(2))  // Tax Calculation
            .up()
            .ele("cbc:RoundingAmount", { currencyID: line.currencyILNA })
            .txt((line.invoiceLineNetAmount + line.invoiceIVatR).toFixed(2))  // Rounding Calculation
            .up()
            .up()

            // Item Information
            .ele("cac:Item")
            .ele("cbc:Name").txt(line.itemName).up()
            .ele("cac:ClassifiedTaxCategory")
            .ele("cbc:ID").txt(line.invoiceIVatCC).up() // VAT category (e.g., S, Z, E, O)
            .ele("cbc:Percent").txt(`${line.invoiceIVatR.toFixed(2)}`).up() // VAT rate percentage
            .ele("cac:TaxScheme")
            .ele("cbc:ID").txt(line.taxSchemeId).up() // Tax scheme ID
            .up()
            .up()
            .up()

            // Price Information (Item Net Price)
            .ele("cac:Price")
            .ele("cbc:PriceAmount", { currencyID: line.currencyINP })
            .txt(line.itemNetPrice.toFixed(2)) // Item net price for this line
            .up();
    }


    return doc.end({ prettyPrint: true });
}
