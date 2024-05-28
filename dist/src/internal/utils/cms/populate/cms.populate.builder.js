"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsPopulateBuilder = void 0;
const qs_1 = require("qs");
class CmsPopulateBuilder {
    static build(queryObject) {
        return (0, qs_1.stringify)(queryObject, {
            encodeValuesOnly: true,
        });
    }
}
exports.CmsPopulateBuilder = CmsPopulateBuilder;
//# sourceMappingURL=cms.populate.builder.js.map