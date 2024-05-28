"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoAvailableCoachesException = void 0;
const common_1 = require("@nestjs/common");
class NoAvailableCoachesException extends common_1.HttpException {
    constructor() {
        super('Could not find a coach for the session', common_1.HttpStatus.FAILED_DEPENDENCY);
    }
}
exports.NoAvailableCoachesException = NoAvailableCoachesException;
//# sourceMappingURL=no-available-coaches.exception.js.map