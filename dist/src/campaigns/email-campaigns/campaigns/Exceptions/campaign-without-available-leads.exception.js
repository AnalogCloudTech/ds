"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignWithoutAvailableLeadsException = void 0;
const common_1 = require("@nestjs/common");
class CampaignWithoutAvailableLeadsException extends common_1.HttpException {
    constructor(defaultResponseMessage = 'Campaign without available leads') {
        super(defaultResponseMessage, common_1.HttpStatus.FAILED_DEPENDENCY);
        this.defaultResponseMessage = defaultResponseMessage;
    }
}
exports.CampaignWithoutAvailableLeadsException = CampaignWithoutAvailableLeadsException;
//# sourceMappingURL=campaign-without-available-leads.exception.js.map