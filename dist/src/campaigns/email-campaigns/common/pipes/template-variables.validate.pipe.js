"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateVariablesValidatePipe = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
const extract_1 = require("../../../../internal/utils/templates/variables/extract");
const find_unmapped_variables_1 = require("../../../../internal/utils/templates/variables/find-unmapped-variables");
class TemplateVariablesValidatePipe {
    transform(dto) {
        const content = (0, lodash_1.get)(dto, 'content', '');
        const variables = (0, extract_1.extractTemplateVariables)(content);
        const unmapped = (0, find_unmapped_variables_1.findUnmappedVariables)(variables);
        if ((0, lodash_1.get)(unmapped, ['length']) > 0) {
            throw new common_1.BadRequestException([
                `Unmapped template variables found: {{${unmapped.join('}}, {{')}}}`,
            ]);
        }
        return dto;
    }
}
exports.TemplateVariablesValidatePipe = TemplateVariablesValidatePipe;
//# sourceMappingURL=template-variables.validate.pipe.js.map