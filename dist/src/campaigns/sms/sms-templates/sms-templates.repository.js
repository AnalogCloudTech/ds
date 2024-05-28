"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsTemplatesRepository = void 0;
const generic_repository_1 = require("../../../cms/cms/repository/generic.repository");
class SmsTemplatesRepository extends generic_repository_1.GenericRepository {
    constructor() {
        super(...arguments);
        this.baseRoute = 'sms-templates';
    }
}
exports.SmsTemplatesRepository = SmsTemplatesRepository;
//# sourceMappingURL=sms-templates.repository.js.map