"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExtensionFromMimeType = void 0;
const mime = require("mime-types");
function getExtensionFromMimeType(mimeType) {
    return mime.extension(mimeType);
}
exports.getExtensionFromMimeType = getExtensionFromMimeType;
//# sourceMappingURL=index.js.map