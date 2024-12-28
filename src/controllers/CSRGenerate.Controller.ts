import { Request, Response } from "express";
import generateCSR from "../services/EGS/generateCSR";
import axios from "axios";

export default async function csrGenerationController(req: Request, res: Response) {
    const {
        commonName,
        serialNumber,
        organizationIdentifier,
        organizationUnitName,
        organizationName,
        countryName,
        invoiceType,
        locationAddress,
        industryBusinessCategory,
        otp
    } = req.body;

    if (!commonName || !serialNumber || !organizationIdentifier || !organizationUnitName || !organizationName || !countryName || !invoiceType || !locationAddress || !industryBusinessCategory || !otp) {
        return res.status(400).send({ message: "Required fields are missing." });
    }

    try {
        const { csrPem } = generateCSR(
            commonName,
            serialNumber,
            organizationIdentifier,
            organizationUnitName,
            organizationName,
            countryName,
            invoiceType,
            locationAddress,
            industryBusinessCategory
        );

        const csrBase64 = Buffer.from(csrPem).toString('base64');

        const response = await axios.post(
            "https://gw-fatoora.zatca.gov.sa/e-invoicing/developer-portal/compliance",
            {
                csr: csrBase64,
            },
            {
                headers: {
                    'accept': 'application/json',
                    'OTP': `${otp}`,
                    'Accept-Version': 'V2',
                    'Content-Type': 'application/json'
                },
            }
        );

        res.status(200).send({ responseData: response.data });
    } catch (error: any) {
        console.error("CSR Generation Error:", error.message);
        res.status(500).send({ message: "Failed to generate CSR.", error: error.message });
    }
}
