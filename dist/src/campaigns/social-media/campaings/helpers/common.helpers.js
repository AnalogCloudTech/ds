"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonHelpers = void 0;
const common_1 = require("@nestjs/common");
const fb_1 = require("fb");
const lodash_1 = require("lodash");
class CommonHelpers {
    async postFBMessage(data, attributes) {
        (0, lodash_1.forEach)(attributes, async (attr) => {
            (0, fb_1.setAccessToken)(`${attr.securityKey}`);
            await this.fbPost(attr, data);
        });
    }
    async fbPost(attributes, result) {
        try {
            const url = `/${attributes.pageAddress}/photos`;
            await (0, fb_1.api)(url, 'POST', {
                url: `${result.image}`,
                message: result.content,
            });
        }
        catch (error) {
            common_1.Logger.error(`Customer ${attributes.customerId._id} `, error.response.error.message);
        }
    }
}
exports.CommonHelpers = CommonHelpers;
//# sourceMappingURL=common.helpers.js.map