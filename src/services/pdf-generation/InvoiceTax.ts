import { DataDictionaryMandatory } from "../../models/DataDictionaryMandatory";
import PDFDocument from 'pdfkit';
import axios from 'axios';

export async function taxInvoicePdf(data: DataDictionaryMandatory, qrcode: string) {

    const doc = new PDFDocument({ font: './src/assets/fonts/IBMPlexSansArabic-Medium.ttf', size: "A4", margin: 30 });
    const middleX = doc.page.width / 2;

    const issueDate =
        typeof data.invoiceIssueDate === "string"
            ? (data.invoiceIssueDate as string).split("-").reverse().join("/")
            : new Date(data.invoiceIssueDate as Date).toLocaleDateString("en-GB");

    const issueTime = typeof data.invoiceIssueTime === "string"
        ? data.invoiceIssueTime
        : new Date(data.invoiceIssueTime).toISOString();

    try {
        const response = await axios({
            url: data.orgLogo,
            responseType: 'arraybuffer'
        });

        const qr = await axios({
            url: 'https://docs.lightburnsoftware.com/legacy/img/QRCode/ExampleCode.png',
            responseType: 'arraybuffer'
        });

        doc.lineWidth(0.5);

        doc.rect(20, 20, doc.page.width - 40, 70)
            .fillAndStroke('white', 'black', 'non-zero');

        doc.rect(doc.page.width - 20, 160, -doc.page.width + 170, 120)
            .fillAndStroke('white', 'black', 'non-zero');

        doc.lineWidth(0.5)
            .moveTo(middleX / 1.5, 20)
            .lineTo(middleX / 1.5, 90)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(middleX * 1.35, 20)
            .lineTo(middleX * 1.35, 90)
            .stroke('black');

        doc.rect(20, 100, doc.page.width - 40, 15)
            .fillAndStroke('white', 'black', 'non-zero');

        doc.lineWidth(0.5)
            .moveTo(middleX / 3.8, 100)
            .lineTo(middleX / 3.8, 115)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(middleX / 1.25, 100)
            .lineTo(middleX / 1.25, 115)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(middleX + 210, 100)
            .lineTo(middleX + 210, 115)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(middleX + 90, 100)
            .lineTo(middleX + 90, 115)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(middleX, 100)
            .lineTo(middleX, 115)
            .stroke('black');

        doc.lineWidth(0.5)
            .moveTo(doc.page.width - 20, 175)
            .lineTo(doc.page.width - 445, 175)
            .stroke('black');

        doc.lineWidth(0.5)
            .moveTo(doc.page.width - 20, 190)
            .lineTo(doc.page.width - 445, 190)
            .stroke('black');

        doc.lineWidth(0.5)
            .moveTo(doc.page.width - 20, 205)
            .lineTo(doc.page.width - 445, 205)
            .stroke('black');

        doc.lineWidth(0.5)
            .moveTo(doc.page.width - 20, 220)
            .lineTo(doc.page.width - 445, 220)
            .stroke('black');

        doc.lineWidth(0.5)
            .moveTo(doc.page.width - 20, 235)
            .lineTo(doc.page.width - 445, 235)
            .stroke('black');

        doc.lineWidth(0.5)
            .moveTo(doc.page.width - 20, 250)
            .lineTo(doc.page.width - 445, 250)
            .stroke('black');

        doc.lineWidth(0.5)
            .moveTo(doc.page.width - 20, 265)
            .lineTo(doc.page.width - 445, 265)
            .stroke('black');

        doc.lineWidth(0.5)
            .moveTo(middleX * 1.6, 160)
            .lineTo(middleX * 1.6, 280)
            .stroke('black');

        doc.lineWidth(0.5)
            .moveTo(middleX / 1.2, 160)
            .lineTo(middleX / 1.2, 280)
            .stroke('black');

        doc.rect(20, 125, doc.page.width - 40, 25)
            .fillAndStroke('#c2c2c2', 'black', 'non-zero');

        doc.rect(20, 290, doc.page.width - 40, 15)
            .fillAndStroke('#c2c2c2', 'black', 'non-zero');
        doc.rect(20, 305, doc.page.width - 40, 75)
            .fillAndStroke('white', 'black', 'non-zero');
        doc.lineWidth(0.5)
            .moveTo(middleX * 1.7, 305)
            .lineTo(middleX * 1.7, 380)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(middleX * 1.23, 305)
            .lineTo(middleX * 1.23, 380)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(90, 305)
            .lineTo(90, 380)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(middleX - 70, 305)
            .lineTo(middleX - 70, 380)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(20, 320)
            .lineTo(doc.page.width - 20, 320)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(20, 335)
            .lineTo(doc.page.width - 20, 335)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(20, 350)
            .lineTo(doc.page.width - 20, 350)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(20, 365)
            .lineTo(doc.page.width - 20, 365)
            .stroke('black');

        doc.lineWidth(0.5)
            .moveTo(middleX, 290)
            .lineTo(middleX, 380)
            .stroke('black');

        doc.rect(20, 390, doc.page.width - 40, 15)
            .fillAndStroke('#c2c2c2', 'black', 'non-zero');
        doc.rect(20, 405, doc.page.width - 40, 40)
            .fillAndStroke('#c2c2c2', 'black', 'non-zero');
        doc.lineWidth(0.5)
            .moveTo(160, 405)
            .lineTo(160, 445)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(230, 405)
            .lineTo(230, 445)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(290, 405)
            .lineTo(290, 445)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(335, 405)
            .lineTo(335, 445)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(410, 405)
            .lineTo(410, 445)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(460, 405)
            .lineTo(460, 445)
            .stroke('black');

        // Place the image
        doc.image(response.data, middleX - 60, 35, {
            fit: [120, 120],
            align: 'center'
        });

        // QR Code
        doc.image(qr.data, 20, 160, {
            fit: [120, 120],
            align: 'right'
        });

    } catch (error) {
        console.error('Error fetching image: ', error);
    }

    doc.on('pageAdded', async function () {
        // Header
        // Right Arabic Information
        doc.lineWidth(0.5);
        doc.rect(20, 20, doc.page.width - 40, 70)
            .fillAndStroke('white', 'black', 'non-zero');
        doc.rect(doc.page.width - 20, 160, -doc.page.width + 170, 120)
            .fillAndStroke('white', 'black', 'non-zero');
        doc.rect(20, 100, doc.page.width - 40, 15)
            .fillAndStroke('white', 'black', 'non-zero');
        doc.lineWidth(0.5)
            .moveTo(middleX / 3.8, 100)
            .lineTo(middleX / 3.8, 115)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(middleX / 1.25, 100)
            .lineTo(middleX / 1.25, 115)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(middleX + 210, 100)
            .lineTo(middleX + 210, 115)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(middleX + 90, 100)
            .lineTo(middleX + 90, 115)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(middleX, 100)
            .lineTo(middleX, 115)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(middleX / 1.5, 20)
            .lineTo(middleX / 1.5, 90)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(middleX * 1.35, 20)
            .lineTo(middleX * 1.35, 90)
            .stroke('black');

        doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(7).fillColor('black').text(`${data.sellerName}`, doc.page.width - 160, 25, {
            features: ['rtla', 'aalt'],
            align: 'right'
        });
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Medium.ttf').fontSize(7).fillColor('black').text(`${data.addressStreet} ${data.addressPostalCode} - ${data.addressBuildingNum}`, doc.page.width - 160, doc.y + lineHeight, {
            features: ['rtla'],
            align: 'right'
        });
        doc.fontSize(7).fillColor('black').text(`${data.addressCity} ${data.addressCountryCode}`, doc.page.width - 160, doc.y + lineHeight, {
            features: ['rtla'],
            align: 'right'
        });

        // Left English Information
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(7).fillColor('black').text(`${data.sellerName}`, 25, 25, {
            width: doc.page.width / 4,
            align: 'left'
        });
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Medium.ttf').fontSize(7).fillColor('black').text(`${data.addressStreet} ${data.addressPostalCode} - ${data.addressBuildingNum}`, 25, doc.y + lineHeight, {
            width: doc.page.width / 4,
            align: 'left'
        });
        doc.fontSize(7).fillColor('black').text(`${data.addressCity} ${data.addressCountryCode}`, 25, doc.y + lineHeight, {
            width: doc.page.width / 4,
            align: 'left'
        });

        // Commercial Registeration
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`السجل التجاري:`, doc.page.width - 160, 101, {
            features: ['rtla'],
            align: 'right'
        });
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Medium.ttf').fontSize(8).fillColor('black').text(`${data.crNum}`, middleX + 40, 101, {
            align: 'center'
        });
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Commercial Reg. :`, middleX + 10, 101, {
            width: doc.page.width / 4,
            align: 'left'
        });

        // VAT Number
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`الرقم الضريبي:`, middleX - 55, 101, {
            features: ['rtla'],
            align: 'left'
        });
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Medium.ttf').fontSize(8).fillColor('black').text(`310151258200003`, (middleX / 2) - 30, 101, {
            align: 'left'
        });
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`VAT Number:`, 25, 101, {
            align: 'left'
        });

        // Arabic footer text
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`شكرا للتعامل معنا, و نسعى لتحسين تجربة العملاء معنا`, 25, doc.page.height - 45, {
            features: ['rtla'],
            align: 'right',
            baseline: 'bottom'
        });

        // English footer text
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Thank you for dealing with us, and we strive to improve the customer experience with us.`, 25, doc.page.height - 45, {
            align: 'left',
            baseline: 'bottom'
        });

        const response = await axios({
            url: data.orgLogo,
            responseType: 'arraybuffer'
        });

        // Place the image
        doc.image(response.data, middleX - 60, 35, {
            fit: [120, 120],
            align: 'center'
        });
    });

    const lineHeight = 2;

    // Right Arabic Information
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(7).fillColor('black').text(`${data.sellerName}`, doc.page.width - 160, 25, {
        features: ['rtla', 'aalt'],
        align: 'right'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Medium.ttf').fontSize(7).fillColor('black').text(`${data.addressStreet} ${data.addressPostalCode} - ${data.addressBuildingNum}`, doc.page.width - 160, doc.y + lineHeight, {
        features: ['rtla'],
        align: 'right'
    });
    doc.fontSize(7).fillColor('black').text(`${data.addressCity} ${data.addressCountryCode}`, doc.page.width - 160, doc.y + lineHeight, {
        features: ['rtla'],
        align: 'right'
    });

    // Left English Information
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(7).fillColor('black').text(`${data.sellerName}`, 25, 25, {
        width: doc.page.width / 4,
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Medium.ttf').fontSize(7).fillColor('black').text(`${data.addressStreet} ${data.addressPostalCode} - ${data.addressBuildingNum}`, 25, doc.y + lineHeight, {
        width: doc.page.width / 4,
        align: 'left'
    });
    doc.fontSize(7).fillColor('black').text(`${data.addressCity} ${data.addressCountryCode}`, 25, doc.y + lineHeight, {
        width: doc.page.width / 4,
        align: 'left'
    });

    // Commercial Registeration
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`السجل التجاري:`, doc.page.width - 160, 101, {
        features: ['rtla'],
        align: 'right'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Medium.ttf').fontSize(8).fillColor('black').text(`${data.crNum}`, middleX + 40, 101, {
        align: 'center'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Commercial Reg. :`, middleX + 10, 101, {
        width: doc.page.width / 4,
        align: 'left'
    });

    // VAT Number
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`الرقم الضريبي:`, middleX - 55, 101, {
        features: ['rtla'],
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Medium.ttf').fontSize(8).fillColor('black').text(`310151258200003`, (middleX / 2) - 30, 101, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`VAT Number:`, 25, 101, {
        align: 'left'
    });

    // Tax Invoice Title Arabic & English
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(14).fillColor('black').text(`فاتورة ضريبية`, 20, 126, {
        features: ['rtla'],
        align: 'right'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(14).fillColor('black').text(`Tax Invoice`, 25, 126, {
        align: 'left'
    });

    // Imvoice Information
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`رقم الفاتورة:`, 20, 161, {
        features: ['rtla'],
        align: 'right',
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`رقم أمر الشراء:`, 20, 176, {
        features: ['rtla'],
        align: 'right',
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`تاريخ الفاتورة:`, 20, 191, {
        features: ['rtla'],
        align: 'right',
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`وقت الفاتورة:`, 20, 206, {
        features: ['rtla'],
        align: 'right',
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`نوع الفاتورة:`, 20, 221, {
        features: ['rtla'],
        align: 'right',
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`رقم الحساب البنكي:`, 20, 236, {
        features: ['rtla'],
        align: 'right',
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`رقم الآيبان:`, 20, 251, {
        features: ['rtla'],
        align: 'right',
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`إسم المصرف البنكي:`, 20, 266, {
        features: ['rtla'],
        align: 'right',
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Invoice Number:`, 160, 161, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Purchase Order:`, 160, 176, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Invoice Date:`, 160, 191, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Invoice Time:`, 160, 206, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Invoice Type:`, 160, 221, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Bank Account:`, 160, 236, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`IBAN Number:`, 160, 251, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Bank Name:`, 160, 266, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`INV00646`, middleX - 130, 161, {
        align: 'center'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`PO#41000586419`, middleX - 130, 176, {
        align: 'center'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`16/01/2025`, middleX - 130, 191, {
        align: 'center'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`10:33:49`, middleX - 130, 206, {
        align: 'center'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`1100`, middleX - 130, 221, {
        align: 'center'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`451310684000`, middleX - 130, 236, {
        align: 'center'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`SA165498451310684000`, middleX - 130, 251, {
        align: 'center'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Al-Rajhi Bank`, middleX - 130, 266, {
        align: 'center'
    });

    // Seller & Buyer Informations
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`معلومات البائع`, 20, 291, {
        features: ['rtla'],
        align: 'right',
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Seller Information`, middleX - 90, 291, {
        align: 'right',
        width: doc.page.width / 2
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Buyer Information`, 25, 291, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`معلومات المشتري`, 110, 291, {
        features: ['rtla'],
        align: 'left'
    });

    // Seller
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`الإسم`, 20, 306, {
        features: ['rtla'],
        align: 'right',
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`المدينة`, 20, 321, {
        features: ['rtla'],
        align: 'right',
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`العنوان`, 20, 336, {
        features: ['rtla'],
        align: 'right',
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`السجل التجاري`, 20, 351, {
        features: ['rtla'],
        align: 'right',
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`الرقم الضريبي`, 20, 366, {
        features: ['rtla'],
        align: 'right',
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Name`, middleX + 5, 306, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`City`, middleX + 5, 321, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Address`, middleX + 5, 336, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`C.R Number`, middleX + 5, 351, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`VAT Number`, middleX + 5, 366, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Medium.ttf').fontSize(8).fillColor('black').text(`شركة أكرم شريف للمقاولات`, middleX, 306, {
        features: ['rtla'],
        align: 'center',
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Medium.ttf').fontSize(8).fillColor('black').text(`الدمام`, middleX, 321, {
        features: ['rtla'],
        align: 'center',
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Medium.ttf').fontSize(8).fillColor('black').text(`الواحة 7ج عمارة المعجل`, middleX, 336, {
        features: ['rtla'],
        align: 'center',
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Medium.ttf').fontSize(8).fillColor('black').text(`2050186688`, middleX, 351, {
        align: 'center',
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Medium.ttf').fontSize(8).fillColor('black').text(`310151258200003`, middleX, 366, {
        align: 'center',
    });

    // Buyer
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`الإسم`, -5, 306, {
        features: ['rtla'],
        align: 'right',
        width: doc.page.width / 2
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`المدينة`, -5, 321, {
        features: ['rtla'],
        align: 'right',
        width: doc.page.width / 2
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`العنوان`, -5, 336, {
        features: ['rtla'],
        align: 'right',
        width: doc.page.width / 2
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`السجل التجاري`, -5, 351, {
        features: ['rtla'],
        align: 'right',
        width: doc.page.width / 2
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`الرقم الضريبي`, -5, 366, {
        features: ['rtla'],
        align: 'right',
        width: doc.page.width / 2
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Name`, 25, 306, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`City`, 25, 321, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Address`, 25, 336, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`C.R Number`, 25, 351, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`VAT Number`, 25, 366, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Medium.ttf').fontSize(8).fillColor('black').text(`شركة أكرم شريف للمقاولات`, -250, 306, {
        features: ['rtla'],
        align: 'center',
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Medium.ttf').fontSize(8).fillColor('black').text(`الدمام`, -250, 321, {
        features: ['rtla'],
        align: 'center',
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Medium.ttf').fontSize(8).fillColor('black').text(`الواحة 7ج عمارة المعجل`, -250, 336, {
        features: ['rtla'],
        align: 'center',
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Medium.ttf').fontSize(8).fillColor('black').text(`2050186688`, -250, 351, {
        align: 'center',
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Medium.ttf').fontSize(8).fillColor('black').text(`310151258200003`, -250, 366, {
        align: 'center',
    });

    // Invoice Details
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`بيانات الفاتورة`, 20, 391, {
        features: ['rtla'],
        align: 'right',
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Invoice Details`, 25, 391, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Nature of services or goods`, 25, 406, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`تفاصيل السلعة أو الخدمة`, 25, 416, {
        features: ['rtla'],
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Unit Price`, 166, 406, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`سعر الوحدة`, 166, 416, {
        features: ['rtla'],
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Quantity`, 236, 406, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`الكمية`, 236, 416, {
        features: ['rtla'],
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Unit`, 296, 406, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`الوحدة`, 296, 416, {
        features: ['rtla'],
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Taxable Amount`, 341, 406, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`المبلغ الخاضع للضريبة`, 341, 416, {
        width: 50,
        features: ['rtla'],
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Discount`, 416, 406, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`الخصم`, 416, 416, {
        width: 50,
        features: ['rtla'],
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Subtotal (Including VAT)`, 466, 406, {
        align: 'left'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`المجموع شامل ضريبة القيمة المضافة`, 466, 416, {
        width: 80,
        features: ['rtla'],
        align: 'left'
    });

    // Footer
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`شكرا للتعامل معنا, و نسعى لتحسين تجربة العملاء معنا`, 25, doc.page.height - 45, {
        features: ['rtla'],
        align: 'right',
        baseline: 'bottom'
    });
    doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Thank you for dealing with us, and we strive to improve the customer experience with us.`, 25, doc.page.height - 45, {
        align: 'left',
        baseline: 'bottom'
    });

    let currentY = 445;

    const rectangleHeight = 250;
    const maxHeight = doc.page.height - 65;

    if (currentY + rectangleHeight > maxHeight) {
        const remainingHeightOnCurrentPage = maxHeight - currentY;
        doc.rect(20, currentY, doc.page.width - 40, remainingHeightOnCurrentPage)
            .fillAndStroke('white', 'black', 'non-zero');
        doc.lineWidth(0.5)
            .moveTo(160, currentY)
            .lineTo(160, remainingHeightOnCurrentPage + currentY)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(230, currentY)
            .lineTo(230, remainingHeightOnCurrentPage + currentY)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(290, currentY)
            .lineTo(290, remainingHeightOnCurrentPage + currentY)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(335, currentY)
            .lineTo(335, remainingHeightOnCurrentPage + currentY)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(410, currentY)
            .lineTo(410, remainingHeightOnCurrentPage + currentY)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(460, currentY)
            .lineTo(460, remainingHeightOnCurrentPage + currentY)
            .stroke('black');

        doc.addPage();

        currentY = 125;

        const remainingHeight = rectangleHeight - remainingHeightOnCurrentPage;
        doc.rect(20, currentY, doc.page.width - 40, remainingHeight + 55)
            .fillAndStroke('white', 'black', 'non-zero');
        doc.rect(20, currentY, doc.page.width - 40, 15)
            .fillAndStroke('#c2c2c2', 'black', 'non-zero');
        doc.rect(20, currentY + 15, doc.page.width - 40, 40)
            .fillAndStroke('#c2c2c2', 'black', 'non-zero');
        doc.lineWidth(0.5)
            .moveTo(160, currentY + 15)
            .lineTo(160, currentY + 55)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(230, currentY + 15)
            .lineTo(230, currentY + 55)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(290, currentY + 15)
            .lineTo(290, currentY + 55)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(335, currentY + 15)
            .lineTo(335, currentY + 55)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(410, currentY + 15)
            .lineTo(410, currentY + 55)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(460, currentY + 15)
            .lineTo(460, currentY + 55)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(160, currentY + 55)
            .lineTo(160, remainingHeight + currentY + 55)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(230, currentY + 55)
            .lineTo(230, remainingHeight + currentY + 55)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(290, currentY + 55)
            .lineTo(290, remainingHeight + currentY + 55)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(335, currentY + 55)
            .lineTo(335, remainingHeight + currentY + 55)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(410, currentY + 55)
            .lineTo(410, remainingHeight + currentY + 55)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(460, currentY + 55)
            .lineTo(460, remainingHeight + currentY + 55)
            .stroke('black');

        // Invoice Details
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`بيانات الفاتورة`, 20, currentY + 1, {
            features: ['rtla'],
            align: 'right',
        });
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Invoice Details`, 25, currentY + 1, {
            align: 'left'
        });
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Nature of services or goods`, 25, currentY + 16, {
            align: 'left'
        });
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`تفاصيل السلعة أو الخدمة`, 25, currentY + 26, {
            features: ['rtla'],
            align: 'left'
        });
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Unit Price`, 166, currentY + 16, {
            align: 'left'
        });
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`سعر الوحدة`, 166, currentY + 26, {
            features: ['rtla'],
            align: 'left'
        });
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Quantity`, 236, currentY + 16, {
            align: 'left'
        });
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`الكمية`, 236, currentY + 26, {
            features: ['rtla'],
            align: 'left'
        });
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Unit`, 296, currentY + 16, {
            align: 'left'
        });
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`الوحدة`, 296, currentY + 26, {
            features: ['rtla'],
            align: 'left'
        });
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Taxable Amount`, 341, currentY + 16, {
            align: 'left'
        });
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`المبلغ الخاضع للضريبة`, 341, currentY + 26, {
            width: 50,
            features: ['rtla'],
            align: 'left'
        });
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Discount`, 416, currentY + 16, {
            align: 'left'
        });
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`الخصم`, 416, currentY + 26, {
            width: 50,
            features: ['rtla'],
            align: 'left'
        });
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`Subtotal (Including VAT)`, 466, currentY + 16, {
            align: 'left'
        });
        doc.font('./src/assets/fonts/IBMPlexSansArabic-Bold.ttf').fontSize(8).fillColor('black').text(`المجموع شامل ضريبة القيمة المضافة`, 466, currentY + 26, {
            width: 80,
            features: ['rtla'],
            align: 'left'
        });
    } else {
        doc.rect(20, currentY, doc.page.width - 40, rectangleHeight)
            .fillAndStroke('white', 'black', 'non-zero');
        doc.lineWidth(0.5)
            .moveTo(160, 445)
            .lineTo(160, rectangleHeight + 445)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(230, 445)
            .lineTo(230, rectangleHeight + 445)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(290, 445)
            .lineTo(290, rectangleHeight + 445)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(335, 445)
            .lineTo(335, rectangleHeight + 445)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(410, 445)
            .lineTo(410, rectangleHeight + 445)
            .stroke('black');
        doc.lineWidth(0.5)
            .moveTo(460, 445)
            .lineTo(460, rectangleHeight + 445)
            .stroke('black');
    }

    return doc;
};