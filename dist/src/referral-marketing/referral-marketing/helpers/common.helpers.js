"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonHelper = void 0;
const randomstring_1 = require("randomstring");
class CommonHelper {
    randomGenerator() {
        return (0, randomstring_1.generate)(8);
    }
}
exports.CommonHelper = CommonHelper;
//# sourceMappingURL=common.helpers.js.map