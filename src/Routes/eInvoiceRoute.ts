import { Router } from "express";
import { createEInvoice } from "../Controllers/eInvoiceController";

const router = Router();

router.post('/generate-invoice', createEInvoice);

export default router;