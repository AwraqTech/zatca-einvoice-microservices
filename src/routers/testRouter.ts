import express from "express";
import validateInvoiceInput from "../controllers/test/validateInput.controller";
import generateValidXMLInvoice from "../controllers/test/generateValidXML";

const router = express.Router();

router.get("/validate-input", validateInvoiceInput);
router.get("/xml-invoice", generateValidXMLInvoice)

export default router;