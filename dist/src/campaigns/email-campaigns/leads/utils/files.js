"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectEncodingAndCovertToString = void 0;
const encoding_japanese_1 = require("encoding-japanese");
function detectEncodingAndCovertToString(fileBuffer) {
    const uint8Array = new Uint8Array(fileBuffer);
    const detectedEncoding = (0, encoding_japanese_1.detect)(fileBuffer).toString();
    const convertedEncoding = (0, encoding_japanese_1.convert)(uint8Array, {
        from: detectedEncoding,
        to: 'UTF8',
    });
    return (0, encoding_japanese_1.codeToString)(convertedEncoding);
}
exports.detectEncodingAndCovertToString = detectEncodingAndCovertToString;
//# sourceMappingURL=files.js.map