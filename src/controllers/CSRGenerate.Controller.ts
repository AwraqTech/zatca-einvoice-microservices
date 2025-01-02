import { Request, Response } from "express";
import generateCSR from "../services/EGS/generateCSR";
import axios from "axios";
import { encrypt } from "../services/EncryptionAES256";

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
    otp,
  } = req.body;

  // Validate required fields
  if (
    !commonName ||
    !serialNumber ||
    !organizationIdentifier ||
    !organizationUnitName ||
    !organizationName ||
    !countryName ||
    !invoiceType ||
    !locationAddress ||
    !industryBusinessCategory ||
    !otp
  ) {
    return res.status(400).json({ message: "Required fields are missing." });
  }

  try {
    // Generate CSR
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

    const csrBase64 = Buffer.from(csrPem).toString("base64");

    // Step 1: Call compliance API
    const complianceResponse = await axios.post(
      "https://gw-fatoora.zatca.gov.sa/e-invoicing/developer-portal/compliance",
      { csr: csrBase64 },
      {
        headers: {
          accept: "application/json",
          OTP: otp,
          "Accept-Version": "V2",
          "Content-Type": "application/json",
        },
      }
    );

    const {
      binarySecurityToken: userName,
      secret: password,
      requestID: complianceRequestId,
    } = complianceResponse.data;

    // Step 2: Call CSIDs API
    const csidsResponse = await axios.post(
      "https://gw-fatoora.zatca.gov.sa/e-invoicing/developer-portal/production/csids",
      { compliance_request_id: complianceRequestId },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${userName}:${password}`).toString("base64")}`,
          "Accept-Version": "V2",
          "Content-Type": "application/json",
        },
      }
    );

    // Encrypt sensitive data
    const encryptedUsername = encrypt(csidsResponse.data.binarySecurityToken);
    const encryptedPassword = encrypt(csidsResponse.data.secret);

    // Return encrypted credentials
    res.status(200).json({
      username: encryptedUsername,
      password: encryptedPassword,
    });
  } catch (error: any) {
    console.error("CSR Generation Error:", error?.response?.data || error.message);
    res
      .status(500)
      .json({ message: "Failed to generate CSR.", error: error?.response?.data || error.message });
  }
}
