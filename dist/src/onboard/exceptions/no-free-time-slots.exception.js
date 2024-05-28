"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoFreeTimeSlotsException = void 0;
const common_1 = require("@nestjs/common");
class NoFreeTimeSlotsException extends common_1.HttpException {
    constructor() {
        super('No free time slots', common_1.HttpStatus.FAILED_DEPENDENCY);
    }
}
exports.NoFreeTimeSlotsException = NoFreeTimeSlotsException;
//# sourceMappingURL=no-free-time-slots.exception.js.map