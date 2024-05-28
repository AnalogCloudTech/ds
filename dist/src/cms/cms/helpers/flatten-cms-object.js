"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenCmsObject = void 0;
function flattenCmsObject(object) {
    return Object.assign({ id: object.id }, object.attributes);
}
exports.flattenCmsObject = flattenCmsObject;
//# sourceMappingURL=flatten-cms-object.js.map