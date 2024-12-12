"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eInvoiceController_1 = require("../Controllers/eInvoiceController");
const router = (0, express_1.Router)();
router.post('/generate-invoice', eInvoiceController_1.createEInvoice);
exports.default = router;
