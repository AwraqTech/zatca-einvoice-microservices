import express from "express";
import { generateInvoiceController } from "../controllers/SimpInvGen.Controller";

const router = express.Router();

router.post("/gen-sim-inv-pdf", generateInvoiceController);

export default router;