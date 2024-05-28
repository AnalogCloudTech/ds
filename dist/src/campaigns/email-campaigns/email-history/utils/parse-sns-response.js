"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseSNSResponse(data) {
    try {
        const parsedJson = JSON.parse(data);
        if ((parsedJson === null || parsedJson === void 0 ? void 0 : parsedJson.Type) !== 'SubscriptionConfirmation') {
            const parsedMsg = JSON.parse(parsedJson.Message);
            return parsedMsg;
        }
        return parsedJson;
    }
    catch (err) {
        return null;
    }
}
exports.default = parseSNSResponse;
//# sourceMappingURL=parse-sns-response.js.map