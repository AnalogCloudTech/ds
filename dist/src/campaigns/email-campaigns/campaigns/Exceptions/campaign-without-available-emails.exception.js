"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignWithoutAvailableEmailsException = void 0;
const common_1 = require("@nestjs/common");
class CampaignWithoutAvailableEmailsException extends common_1.HttpException {
    constructor(defaultResponseMessage = 'Campaign without available emails') {
        super(defaultResponseMessage, common_1.HttpStatus.FAILED_DEPENDENCY);
        this.defaultResponseMessage = defaultResponseMessage;
    }
}
exports.CampaignWithoutAvailableEmailsException = CampaignWithoutAvailableEmailsException;
//# sourceMappingURL=campaign-without-available-emails.exception.js.map