"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformPasswordEncryptedPipe = void 0;
const bcryptjs_1 = require("bcryptjs");
class TransformPasswordEncryptedPipe {
    async transform(dto) {
        const encryptedPassword = await (0, bcryptjs_1.hash)(dto.password, 10);
        return Object.assign(Object.assign({}, dto), { encryptedPassword });
    }
}
exports.TransformPasswordEncryptedPipe = TransformPasswordEncryptedPipe;
//# sourceMappingURL=transform-password-encrypted.pipe.js.map