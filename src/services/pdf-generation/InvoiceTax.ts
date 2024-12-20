import { DataDictionaryMandatory } from "../../models/DataDictionaryMandatory";
import PDFDocument from 'pdfkit';
import axios from 'axios';

export async function invoiceTaxGenerationPdf(data: DataDictionaryMandatory, qrcode: string) {

    const tempDoc = new PDFDocument({ margin: 10 });
    let totalHeight = 0;

    totalHeight += tempDoc.heightOfString('Simplified Tax Invoice', { align: 'center' });
    totalHeight += tempDoc.heightOfString(data.sellerName, { width: tempDoc.page.width * 0.6 });
    totalHeight += tempDoc.heightOfString(data.addressCity + ", " + data.addressStreet);

    if (data.invoiceLine) {
        data.invoiceLine.forEach(row => {
            totalHeight += tempDoc.heightOfString(row.itemName, { width: tempDoc.page.width * 0.33 });
        });
    }

    totalHeight += 800;

    tempDoc.end();

    totalHeight = Math.max(totalHeight, 700);

    const doc = new PDFDocument({ font: './src/assets/fonts/IBMPlexSansArabic-Medium.ttf', size: [219, totalHeight], margin: 10 });

    const middleX = doc.page.width / 2;
    const date = new Date().toISOString().split("T")[0];
    const time = new Date();

    const formattedTime = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;

    try {
        const response = await axios({
            url: data.orgLogo,
            responseType: 'arraybuffer'
        });

        doc.image(response.data, 79.5, 10, {
            fit: [60, 60],
            align: 'center'
        });
    } catch (error) {
        console.error('Error fetching image: ', error);
    }

    doc.fontSize(10)
        .text('فاتورة ضريبية مبسطة', 10, 45, { features: ['rtla'], align: 'center' })
        .text('Simplified Tax Invoice', 10, 60, { align: 'center' });

    doc.fontSize(7)
        .text('إسم التاجر:', 10, 85, { features: ['rtla'], align: 'right' })
        .text('Seller Name:', 10, 85, { align: 'left' })
        .text(`${data.sellerName}`, 50, 85, { features: ['rtla'], align: 'center', lineBreak: true, width: doc.page.width * 0.6 });

    doc.fontSize(7)
        .text('الفرع:', 10, 120, { features: ['rtla'], align: 'right' })
        .text('Branch:', 10, 120, { align: 'left' })
        .text(`${data.branch}`, 20, 120, { features: ['rtla'], align: 'center' });

    doc.fontSize(7)
        .text('العنوان:', 10, 135, { features: ['rtla'], align: 'right' })
        .text('Address:', 10, 135, { align: 'left' })
        .text(`${data.addressCity}, ${data.addressStreet}`, 20, 135, { features: ['rtla'], align: 'center' });

    doc.fontSize(7)
        .text('التاريخ و الوقت:', 10, 150, { features: ['rtla'], align: 'right' })
        .text('Date & Time:', 10, 150, { align: 'left' })
        .text(`${date} - ${formattedTime}`, 20, 150, { align: 'center' });

    doc.fontSize(7)
        .text('السجل التجاري:', 10, 165, { features: ['rtla'], align: 'right' })
        .text('Commercial Reg. :', 10, 165, { align: 'left' })
        .text(`${data.crNum}`, 20, 165, { align: 'center' });

    doc.fontSize(7)
        .text(`موظف الصندوق: `, 10, 230, { features: ['rtla'], align: 'right' })
        .text('Cashier:', 10, 230, { align: 'left' })
        .text(`${data.cashierName}`, 20, 230, { features: ['rtla'], align: 'center' });

    doc.fontSize(22)
        .text(`Order #${data.orderNum}`, 10, 245, { features: ['rtla'], align: 'center' });

    doc.lineWidth(0.5)
        .dash(5, { space: 5 })
        .moveTo(10, 185)
        .lineTo(doc.page.width - 10, 185)
        .stroke('black');

    doc.undash();
    doc.rect(10, 195, doc.page.width - 20, 15)
        .fill('#f2f2f2');
    doc.lineWidth(0.5)
        .moveTo(10, 210)
        .lineTo(doc.page.width - 10, 210)
        .stroke('black');
    doc.lineWidth(0.5)
        .moveTo(middleX, 195)
        .lineTo(middleX, 225)
        .stroke('black');
    doc.lineWidth(0.5)
        .rect(10, 195, doc.page.width - 20, 30)
        .stroke('black');

    let currentY = 275;

    doc.fillColor('black')
        .fontSize(7)
        .text('الرقم الضريبي', 20, 196, { features: ['rtla'], align: 'right', width: doc.page.width - 45 })
        .text('VAT No. ', 20, 196, { align: 'right', width: doc.page.width - 85 })
        .text(`${data.vatRegisterationNum}`, 20, 212, { align: 'right', width: doc.page.width - 45 });

    doc.fontSize(7)
        .text('رقم الفاتورة', 60, 196, { features: ['rtla'] })
        .text('Invoice No.', 20, 196, { align: 'left' })
        .text(`${data.invoiceNumber}`, 20, 212, { align: 'center', width: doc.page.width - 140 });

    doc.lineWidth(0.5)
        .moveTo(10, 285)
        .lineTo(doc.page.width - 10, 285)
        .stroke('black');

    currentY += 10;

    const columnsArabic = ['الإجمالي', 'السعر', 'المنتج', 'الكمية'];
    const columnsEnglish = ['Total', 'Price', 'Item', 'QTY'];

    const totalWidth = doc.page.width - 20;
    const columnWidths = {
        total: totalWidth * 0.15,
        price: totalWidth * 0.15,
        productName: totalWidth * 0.33,
        quantity: totalWidth * 0.12,
    };

    const startY = currentY + 10;

    columnsArabic.forEach((col, index) => {
        let columnWidth = 0;
        if (col === 'الإجمالي') columnWidth = columnWidths.total;
        if (col === 'السعر') columnWidth = columnWidths.price;
        if (col === 'المنتج') columnWidth = columnWidths.productName;
        if (col === 'الكمية') columnWidth = columnWidths.quantity;

        const xPosition = 10 + (index * columnWidth);
        doc.text(col, xPosition, startY, {
            width: columnWidth - 5,
            align: 'right',
            features: ['rtla']
        });
    });

    currentY = startY + 20;

    columnsEnglish.forEach((col, index) => {
        let columnWidth = 0;
        if (col === 'Total') columnWidth = columnWidths.total;
        if (col === 'Price') columnWidth = columnWidths.price;
        if (col === 'Item') columnWidth = columnWidths.productName;
        if (col === 'QTY') columnWidth = columnWidths.quantity;

        const xPosition = 10 + (index * columnWidth);
        doc.text(col, xPosition, startY + 10, {
            width: columnWidth - 5,
            align: 'right',
            features: ['rtla']
        });
    });

    currentY = startY + 30;

    const lineData = data.invoiceLine;

    lineData.forEach((row) => {
        const rowValues = [row.invoiceLineNetAmount, row.itemNetPrice, row.itemName, row.invoiceQty];
        let maxHeight = 15;

        rowValues.forEach((value, colIndex) => {
            let columnWidth = 0;
            if (columnsArabic[colIndex] === 'الإجمالي') columnWidth = columnWidths.total;
            if (columnsArabic[colIndex] === 'السعر') columnWidth = columnWidths.price;
            if (columnsArabic[colIndex] === 'المنتج') columnWidth = columnWidths.productName;
            if (columnsArabic[colIndex] === 'الكمية') columnWidth = columnWidths.quantity;

            const valueHeight = doc.heightOfString(String(value), {
                width: columnWidth - 5,
                align: 'right',
            });

            if (valueHeight > maxHeight) {
                maxHeight = valueHeight + 5;
            }
        });

        rowValues.forEach((value, colIndex) => {
            let columnWidth = 0;
            if (columnsArabic[colIndex] === 'الإجمالي') columnWidth = columnWidths.total;
            if (columnsArabic[colIndex] === 'السعر') columnWidth = columnWidths.price;
            if (columnsArabic[colIndex] === 'المنتج') columnWidth = columnWidths.productName;
            if (columnsArabic[colIndex] === 'الكمية') columnWidth = columnWidths.quantity;

            const xPosition = 10 + (colIndex * columnWidth);

            doc.text(String(value), xPosition, currentY, {
                width: columnWidth - 5,
                align: 'right',
                features: ['rtla'],
                lineBreak: true,
            });
        });

        currentY += maxHeight;
    });

    const dynamicYPosition = currentY + 20;


    doc.fontSize(7)
        .font('./src/assets/fonts/IBMPlexSansArabic-Medium.ttf')
        .text(`المبلغ الخاضع للضريبة: `, 10, dynamicYPosition, { features: ['rtla'], align: 'right' })
        .text('Total exclusive VAT:', 10, dynamicYPosition, { align: 'left' });

    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf')
        .fontSize(9)
        .text(`${data.invoiceTANoVat} ${data.currencyTANoVat}`, 20, dynamicYPosition, { features: ['rtla'], align: 'center' });

    doc.fontSize(7)
        .font('./src/assets/fonts/IBMPlexSansArabic-Medium.ttf')
        .text(`إجمالي الضريبة `, 10, dynamicYPosition + 15, { features: ['rtla'], align: 'right' })
        .text(`${data.vatCatRate}%`, 10, dynamicYPosition + 15, { align: 'right', width: doc.page.width - 60 })
        .text(`Total VAT ${data.vatCatRate}%:`, 10, dynamicYPosition + 15, { align: 'left' });

    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf')
        .fontSize(9)
        .text(`${data.invoiceTVATA} ${data.currencyTVATA}`, 20, dynamicYPosition + 15, { features: ['rtla'], align: 'center' });

    doc.fontSize(7)
        .font('./src/assets/fonts/IBMPlexSansArabic-Medium.ttf')
        .text(`المجموع مع الضريبة: `, 10, dynamicYPosition + 30, { features: ['rtla'], align: 'right' })
        .text('Total amount with VAT:', 10, dynamicYPosition + 30, { align: 'left' });

    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf')
        .fontSize(9)
        .text(`${data.invoiceTAWithVat} ${data.currencyTAWithVat}`, 20, dynamicYPosition + 30, { features: ['rtla'], align: 'center' });

    doc.lineWidth(0.5)
        .moveTo(10, dynamicYPosition + 50)
        .lineTo(doc.page.width - 10, dynamicYPosition + 50)
        .stroke('black');

    const qrCodeBuffer = Buffer.from(qrcode.split(",")[1], "base64");
    doc.image(qrCodeBuffer, 34.5, dynamicYPosition + 65, {
        fit: [150, 150],
        align: "center",
        valign: "center",
    });

    doc.fontSize(10)
        .fillColor('black')
        .font('./src/assets/fonts/IBMPlexSansArabic-Medium.ttf')
        .text('شكرًا لزيارتنا ونتطلع خدمتك!!', 10, dynamicYPosition + 230, { features: ['rtla'], align: 'center' })
        .text('Thank you for visiting us!', 10, dynamicYPosition + 245, { align: 'center' });

    return doc;
};