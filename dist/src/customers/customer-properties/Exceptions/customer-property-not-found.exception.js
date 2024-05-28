"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerPropertyNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class CustomerPropertyNotFoundException extends common_1.HttpException {
    constructor(defaultResponseMessage = 'Customer Property Not found') {
        super(defaultResponseMessage, common_1.HttpStatus.NOT_FOUND);
        this.defaultResponseMessage = defaultResponseMessage;
    }
}
exports.CustomerPropertyNotFoundException = CustomerPropertyNotFoundException;
//# sourceMappingURL=customer-property-not-found.exception.js.map