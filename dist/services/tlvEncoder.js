"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TLVUtils = void 0;
class TLVUtils {
    static encodeTLV(tag, value) {
        const length = Buffer.byteLength(value);
        return Buffer.concat([
            Buffer.from([tag]), // Tag
            Buffer.from([length]), // Length
            Buffer.from(value, 'utf8'), // Value
        ]);
    }
    static decodeTLV(tlvBuffer) {
        const tag = tlvBuffer[0];
        const length = tlvBuffer[1];
        const value = tlvBuffer.slice(2, 2 + length).toString('utf8');
        return { tag, length, value };
    }
}
exports.TLVUtils = TLVUtils;
