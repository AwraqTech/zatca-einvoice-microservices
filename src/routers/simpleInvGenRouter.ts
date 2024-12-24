import express from "express";
import { generateInvoiceController } from "../controllers/SimpInvGen.Controller";
import { generateInvoiceXMLController } from "../controllers/SimpInvXML.Controller";

const router = express.Router();

router.post("/gen-sim-inv-pdf", generateInvoiceController);
router.post("/gen-sim-inv-xml", generateInvoiceXMLController);

export default router;