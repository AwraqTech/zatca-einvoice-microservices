"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SimpInvGen_Controller_1 = require("../controllers/SimpInvGen.Controller");
const router = express_1.default.Router();
router.post("/gen-sim-inv-pdf", SimpInvGen_Controller_1.generateInvoiceController);
exports.default = router;
