"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationTransformPipe = void 0;
const common_1 = require("@nestjs/common");
class ValidationTransformPipe extends common_1.ValidationPipe {
    constructor(options) {
        if (!options) {
            options = {
                transform: true,
            };
        }
        else {
            options = Object.assign(Object.assign({}, options), { transform: true });
        }
        super(options);
    }
}
exports.ValidationTransformPipe = ValidationTransformPipe;
//# sourceMappingURL=validation-transform.pipe.js.map