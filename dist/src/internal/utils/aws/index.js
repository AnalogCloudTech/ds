"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageIdsArray = void 0;
function getMessageIdsArray(awsSendResponse) {
    return awsSendResponse.flatMap((response) => {
        return response.Status.map(({ MessageId }) => MessageId);
    });
}
exports.getMessageIdsArray = getMessageIdsArray;
//# sourceMappingURL=index.js.map