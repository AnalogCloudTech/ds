"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulingOnBusySlotException = void 0;
const common_1 = require("@nestjs/common");
class SchedulingOnBusySlotException extends common_1.HttpException {
    constructor(defaultResponseMessage = 'Selected time slot is not available') {
        super(defaultResponseMessage, common_1.HttpStatus.BAD_REQUEST);
        this.defaultResponseMessage = defaultResponseMessage;
    }
}
exports.SchedulingOnBusySlotException = SchedulingOnBusySlotException;
//# sourceMappingURL=scheduling-on-busy-slot.exception.js.map