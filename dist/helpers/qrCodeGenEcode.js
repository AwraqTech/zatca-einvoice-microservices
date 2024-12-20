"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQRCodeBase64 = generateQRCodeBase64;
const qrcode_1 = __importDefault(require("qrcode"));
const tlvEncoder_1 = require("../services/tlvEncoder");
function generateQRCodeBase64(_a) {
    return __awaiter(this, arguments, void 0, function* ({ sellerName, vatRegNum, date, time, invTotalWithVat, vatTotal, }) {
        const qrCodeBufferArray = [];
        qrCodeBufferArray.push(tlvEncoder_1.TLVUtils.encodeTLV(1, sellerName));
        qrCodeBufferArray.push(tlvEncoder_1.TLVUtils.encodeTLV(2, vatRegNum));
        qrCodeBufferArray.push(tlvEncoder_1.TLVUtils.encodeTLV(3, date));
        qrCodeBufferArray.push(tlvEncoder_1.TLVUtils.encodeTLV(4, time));
        qrCodeBufferArray.push(tlvEncoder_1.TLVUtils.encodeTLV(5, invTotalWithVat));
        qrCodeBufferArray.push(tlvEncoder_1.TLVUtils.encodeTLV(6, vatTotal));
        const encodedTLV = Buffer.concat(qrCodeBufferArray);
        const encodedTLVHex = encodedTLV.toString("hex");
        const encodedTLVBase64 = Buffer.from(encodedTLVHex, "hex").toString("base64");
        const qrCodeBase64 = yield qrcode_1.default.toDataURL(encodedTLVBase64);
        return qrCodeBase64;
    });
}
