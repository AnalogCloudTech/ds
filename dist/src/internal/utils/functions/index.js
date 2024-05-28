"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.PropertiesSanitizer = void 0;
const lodash_1 = require("lodash");
function PropertiesSanitizer(obj) {
    return (0, lodash_1.pickBy)(obj, (value) => {
        return !((0, lodash_1.isNil)(value) && (0, lodash_1.isUndefined)(value));
    });
}
exports.PropertiesSanitizer = PropertiesSanitizer;
async function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(null);
        }, time);
    });
}
exports.sleep = sleep;
//# sourceMappingURL=index.js.map