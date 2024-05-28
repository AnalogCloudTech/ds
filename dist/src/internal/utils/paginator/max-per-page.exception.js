"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxPerPageException = void 0;
const common_1 = require("@nestjs/common");
class MaxPerPageException extends common_1.HttpException {
    constructor() {
        super('Max items per page should be 50 or less', common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.MaxPerPageException = MaxPerPageException;
//# sourceMappingURL=max-per-page.exception.js.map