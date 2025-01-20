import { Invoice } from "../../models/InvoiceXML";
import { create } from 'xmlbuilder2';

export default function generateInvoiceXML(invoiceData: Invoice) {
    const sumOfCharges = invoiceData.allowanceCharges
        .filter(ac => ac.chargeIndicator)
        .reduce((sum, ac) => sum + ac.amount.value, 0);

    const sumOfAllowances = invoiceData.allowanceCharges
        .filter(ac => !ac.chargeIndicator)
        .reduce((sum, ac) => sum + ac.amount.value, 0);

    const validateVatCategory = (taxAmount: number, taxableAmount: number, percent: number) => {
        const expected = +(taxableAmount * (percent / 100)).toFixed(2);
        if (taxAmount !== expected) {
            throw new Error(`VAT amount (${taxAmount}) does not match expected (${expected}).`);
        }
    };

    const calculatedLineExtintion = invoiceData.invoiceLines.reduce((sum, line) => sum + line.lineExtensionAmount.value, 0);
    const calculatedTaxExclusiveAmount = calculatedLineExtintion - sumOfAllowances + sumOfCharges;

    const xmlDoc = create({ version: '1.0', encoding: 'UTF-8' })
        .ele('Invoice', {
            xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
            'xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
            'xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
            'xmlns:ext': 'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2'
        });

        xmlDoc.ele('ext:UBLExtensions').txt(`\nUBL_EXTENSION_CONTENT\n`).up();
        xmlDoc.txt(`\n`).up();

    invoiceData.taxTotals.forEach(tt => {
        if (tt.taxSubtotals) {
            tt.taxSubtotals.forEach(ts => {
                validateVatCategory(ts.taxAmount.value, ts.taxableAmount.value, ts.taxCategory.percent);
            });
        }
    });

    // Basic Invoice Details
    xmlDoc.ele('cbc:ProfileID').txt('reporting:1.0').up()
        .ele('cbc:ID').txt(`${invoiceData.id}`).up()
        .ele('cbc:UUID').txt(`${invoiceData.uuid}`).up()
        .ele('cbc:IssueDate').txt(`${invoiceData.issueDate.split('T')[0]}`).up()
        .ele('cbc:IssueTime').txt(`${invoiceData.issueTime}`).up()
        .ele('cbc:InvoiceTypeCode', { name: invoiceData.invoiceTypeCode.name }).txt(`${invoiceData.invoiceTypeCode.value}`).up()
        .ele('cbc:DocumentCurrencyCode').txt(`${invoiceData.documentCurrencyCode}`).up()
        .ele('cbc:TaxCurrencyCode').txt(`${invoiceData.taxCurrencyCode}`).up().up();

    // AdditionalDocumentReferences
    invoiceData.additionalDocumentReferences.forEach(ref => {
        const additionalDocRef = xmlDoc.ele('cac:AdditionalDocumentReference');
        additionalDocRef.ele('cbc:ID').txt(`${ref.id}`).up();

        if (ref.uuid) {
            additionalDocRef.ele('cbc:UUID').txt(`${ref.uuid}`).up();
        }

        if (ref.attachment) {
            additionalDocRef.ele('cac:Attachment')
                .ele('cbc:EmbeddedDocumentBinaryObject', { mimeCode: ref.attachment.mimeCode }).txt(`${ref.attachment.embeddedDocumentBinaryObject}`).up()
                .up();
        }
    });

    const signature = xmlDoc.ele('cac:Signature');
        signature.ele('cbc:ID').txt(`urn:oasis:names:specification:ubl:signature:Invoice`).up();
        signature.ele('cbc:SignatureMethod').txt(`urn:oasis:names:specification:ubl:dsig:enveloped:xades`).up()
        .up();

    // Parties
    const addParty = (partyData: any, partyType: any) => {
        const partyElement = xmlDoc.ele(`cac:${partyType}`);
        const party = partyElement.ele('cac:Party');
        party.ele('cac:PartyIdentification')
            .ele('cbc:ID', { schemeID: partyData.partyIdentification.schemeId }).txt(`${partyData.partyIdentification.id}`).up()
            .up()
            .ele('cac:PostalAddress')
            .ele('cbc:StreetName').txt(`${partyData.postalAddress.streetName}`).up()
            .ele('cbc:BuildingNumber').txt(`${partyData.postalAddress.buildingNumber}`).up()
            .ele('cbc:CitySubdivisionName').txt(`${partyData.postalAddress.citySubdivisionName}`).up()
            .ele('cbc:CityName').txt(`${partyData.postalAddress.cityName}`).up()
            .ele('cbc:PostalZone').txt(`${partyData.postalAddress.postalZone}`).up()
            .ele('cac:Country')
            .ele('cbc:IdentificationCode').txt(`${partyData.postalAddress.country.identificationCode}`).up()
            .up()
            .up();

        party.ele('cac:PartyTaxScheme')
            .ele('cbc:CompanyID').txt(`${partyData.partyTaxScheme.companyId}`).up()
            .ele('cac:TaxScheme')
            .ele('cbc:ID', { schemeID: 'UN/ECE 5153', schemeAgencyID: '6' }).txt(`${partyData.partyTaxScheme.taxScheme.id}`).up()
            .up()
            .up();

        party.ele('cac:PartyLegalEntity')
            .ele('cbc:RegistrationName').txt(`${partyData.partyLegalEntity.registrationName}`).up()
            .up();
    };

    addParty(invoiceData.accountingSupplierParty, 'AccountingSupplierParty');
    addParty(invoiceData.accountingCustomerParty, 'AccountingCustomerParty');

    // PaymentMeans
    xmlDoc.ele('cac:PaymentMeans')
        .ele('cbc:PaymentMeansCode').txt(invoiceData.paymentMeans.code).up()
        .up();

    // AllowanceCharges
    invoiceData.allowanceCharges.forEach(charge => {
        const allowanceChargeElement = xmlDoc.ele('cac:AllowanceCharge');
        allowanceChargeElement.ele('cbc:ChargeIndicator').txt(`${charge.chargeIndicator}`).up()
            .ele('cbc:AllowanceChargeReason').txt(`${charge.allowanceChargeReason}`).up()
            .ele('cbc:Amount', { currencyID: charge.amount.currencyId }).txt(`${charge.amount.value}`).up()
            .ele('cac:TaxCategory')
            .ele('cbc:ID', { schemeID: 'UN/ECE 5305', schemeAgencyID: '6' }).txt(`${charge.taxCategory.id}`).up()
            .ele('cbc:Percent').txt(`${charge.taxCategory.percent}`).up()
            .ele('cac:TaxScheme')
            .ele('cbc:ID', { schemeID: 'UN/ECE 5153', schemeAgencyID: '6' }).txt(`${charge.taxCategory.taxScheme.id}`).up()
            .up()
            .up();
    });

    // TaxTotal
    const taxTotal = xmlDoc.ele('cac:TaxTotal');
    taxTotal.ele('cbc:TaxAmount', { currencyID: invoiceData.taxTotals[0].taxAmount.currencyId }).txt(`${invoiceData.taxTotals[0].taxAmount.value}`).up();

    // TaxTotal and TaxSubtotals
    invoiceData.taxTotals.forEach(taxTotal => {
        const taxTotalElement = xmlDoc.ele('cac:TaxTotal');
        taxTotalElement.ele('cbc:TaxAmount', { currencyID: taxTotal.taxAmount.currencyId }).txt(`${taxTotal.taxAmount.value}`).up();

        if (taxTotal.taxSubtotals) {
            taxTotal.taxSubtotals.forEach(subtotal => {
                const taxSubtotalElement = taxTotalElement.ele('cac:TaxSubtotal');
                taxSubtotalElement.ele('cbc:TaxableAmount', { currencyID: subtotal.taxableAmount.currencyId }).txt(`${subtotal.taxableAmount.value}`).up()
                    .ele('cbc:TaxAmount', { currencyID: subtotal.taxAmount.currencyId }).txt(`${subtotal.taxAmount.value}`).up()
                    .ele('cac:TaxCategory')
                    .ele('cbc:ID', { schemeID: 'UN/ECE 5305', schemeAgencyID: '6' }).txt(`${subtotal.taxCategory.id}`).up()
                    .ele('cbc:Percent').txt(`${subtotal.taxCategory.percent}`).up()
                    .ele('cac:TaxScheme')
                    .ele('cbc:ID', { schemeID: 'UN/ECE 5153', schemeAgencyID: '6' }).txt(`${subtotal.taxCategory.taxScheme.id}`).up()
                    .up()
                    .up();
            });
        }
    });

    // LegalMonetaryTotal
    const legalMonetaryTotal = invoiceData.legalMonetaryTotal;
    const legalMonetaryTotalElement = xmlDoc.ele('cac:LegalMonetaryTotal');
    legalMonetaryTotalElement.ele('cbc:LineExtensionAmount', { currencyID: legalMonetaryTotal.lineExtensionAmount.currencyId }).txt(`${calculatedLineExtintion}`).up()
        .ele('cbc:TaxExclusiveAmount', { currencyID: legalMonetaryTotal.taxExclusiveAmount.currencyId }).txt(`${calculatedTaxExclusiveAmount}`).up()
        .ele('cbc:TaxInclusiveAmount', { currencyID: legalMonetaryTotal.taxInclusiveAmount.currencyId }).txt(`${calculatedTaxExclusiveAmount + invoiceData.taxTotals[0].taxAmount.value}`).up()
        .ele('cbc:AllowanceTotalAmount', { currencyID: legalMonetaryTotal.allowanceTotalAmount.currencyId }).txt(`${sumOfAllowances}`).up()
        .ele('cbc:ChargeTotalAmount', { currencyID: legalMonetaryTotal.chargeTotalAmount.currencyId }).txt(`${sumOfCharges}`).up()
        .ele('cbc:PrepaidAmount', { currencyID: legalMonetaryTotal.prepaidAmount.currencyId }).txt(`${legalMonetaryTotal.prepaidAmount.value}`).up()
        .ele('cbc:PayableRoundingAmount', { currencyID: legalMonetaryTotal.PayableRoundingAmount.currencyId }).txt(`${legalMonetaryTotal.PayableRoundingAmount.value}`).up()
        .ele('cbc:PayableAmount', { currencyID: legalMonetaryTotal.payableAmount.currencyId }).txt(`${(calculatedTaxExclusiveAmount + invoiceData.taxTotals[0].taxAmount.value) - legalMonetaryTotal.prepaidAmount.value + legalMonetaryTotal.PayableRoundingAmount.value}`).up();

    // Invoice Lines
    invoiceData.invoiceLines.forEach(line => {
        const invoiceLine = xmlDoc.ele('cac:InvoiceLine');
        const lineExtensionAmount = line.invoicedQuantity.value * line.price.priceAmount.value;
        invoiceLine.ele('cbc:ID').txt(`${line.id}`).up()
            .ele('cbc:InvoicedQuantity', { unitCode: line.invoicedQuantity.unitCode }).txt(`${(line.invoicedQuantity.value).toFixed(6)}`).up()
            .ele('cbc:LineExtensionAmount', { currencyID: line.lineExtensionAmount.currencyId }).txt(`${lineExtensionAmount}`).up();

        const taxTotal = invoiceLine.ele('cac:TaxTotal');
        taxTotal.ele('cbc:TaxAmount', { currencyID: line.taxTotal.taxAmount.currencyId }).txt(`${line.taxTotal.taxAmount.value}`).up()
            .ele('cbc:RoundingAmount', { currencyID: line.taxTotal.taxAmount.currencyId }).txt(`${lineExtensionAmount + line.taxTotal.taxAmount.value}`).up();

        const item = invoiceLine.ele('cac:Item');
        item.ele('cbc:Name').txt(`${line.item.name}`).up();
        item.ele('cac:ClassifiedTaxCategory')
            .ele('cbc:ID').txt(`${line.item.classifiedTaxCategory.id}`).up()
            .ele('cbc:Percent').txt(`${line.item.classifiedTaxCategory.percent}`).up()
            .ele('cac:TaxScheme')
            .ele('cbc:ID').txt(`${line.item.classifiedTaxCategory.taxScheme.id}`).up()
            .up()
            .up();

        const price = invoiceLine.ele('cac:Price');
        price.ele('cbc:PriceAmount', { currencyID: line.price.priceAmount.currencyId }).txt(`${line.price.priceAmount.value}`).up();

        if (line.price.allowanceCharge) {
            price.ele('cac:AllowanceCharge')
                .ele('cbc:ChargeIndicator').txt(`${line.price.allowanceCharge.chargeIndicator}`).up()
                .ele('cbc:AllowanceChargeReason').txt(`${line.price.allowanceCharge.allowanceChargeReason}`).up()
                .ele('cbc:Amount', { currencyID: line.price.allowanceCharge.amount.currencyId }).txt(`${line.price.allowanceCharge.amount.value}`).up()
                .up();
        }
    });

    return xmlDoc.end({ prettyPrint: true });
}
