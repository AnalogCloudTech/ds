"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTemplateVariables = void 0;
const lodash_1 = require("lodash");
function extractTemplateVariables(content) {
    const regex = /{{(.*?)}}/gm;
    const matches = [...content.matchAll(regex)];
    const variables = (0, lodash_1.map)(matches, (match) => {
        return (0, lodash_1.get)(match, '[1]');
    });
    return (0, lodash_1.filter)(variables);
}
exports.extractTemplateVariables = extractTemplateVariables;
//# sourceMappingURL=extract.js.map