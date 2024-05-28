"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUnmappedVariables = void 0;
const available_1 = require("./available");
function findUnmappedVariables(templateVariables) {
    return templateVariables.filter((templateVariable) => !available_1.availableTemplateVariables.includes(templateVariable));
}
exports.findUnmappedVariables = findUnmappedVariables;
//# sourceMappingURL=find-unmapped-variables.js.map