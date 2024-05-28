"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractDiagnosticCode = void 0;
const common_1 = require("@nestjs/common");
const ActionMapper = {
    delivery: extractDeliveryAction,
    complaint: extractComplaintAction,
    bounce: extractBounceAction,
    open: extractOpenAction,
    send: extractSendAction,
    deliverydelay: extractDeliveryDelayAction,
    click: extractClickAction,
};
function extractClickAction(snsMessage) {
    return snsMessage.mail.destination;
}
function extractDeliveryDelayAction(snsMessage) {
    return snsMessage.mail.destination;
}
function extractSendAction(snsMessage) {
    return snsMessage.mail.destination;
}
function extractOpenAction(snsMessage) {
    return snsMessage.mail.destination;
}
function extractBounceAction(msg) {
    const { bounce } = msg;
    if (!bounce) {
        throw new common_1.HttpException({
            message: 'missing bounce object',
        }, common_1.HttpStatus.BAD_REQUEST);
    }
    const { bouncedRecipients } = bounce;
    return bouncedRecipients.map(({ emailAddress }) => emailAddress);
}
function extractDeliveryAction(msg) {
    const { delivery } = msg;
    if (!delivery) {
        throw new common_1.HttpException({
            message: 'missing delivery object',
        }, common_1.HttpStatus.BAD_REQUEST);
    }
    const { recipients } = delivery;
    return recipients;
}
function extractComplaintAction(msg) {
    const { complaint } = msg;
    if (!complaint) {
        throw new common_1.HttpException({
            message: 'missing complaint object',
        }, common_1.HttpStatus.BAD_REQUEST);
    }
    const { complainedRecipients } = complaint;
    return complainedRecipients;
}
function extractEmailsFromSNSMessage(msg) {
    const { eventType } = msg;
    const key = eventType.toLocaleLowerCase();
    if (ActionMapper[key]) {
        const action = eventType.toLocaleLowerCase();
        return ActionMapper[action](msg);
    }
    return [];
}
exports.default = extractEmailsFromSNSMessage;
function extractDeliveryDelayDiagnosticCode(snsMessage) {
    var _a;
    if (snsMessage.eventType !== 'DeliveryDelay') {
        return [];
    }
    return (_a = snsMessage === null || snsMessage === void 0 ? void 0 : snsMessage.deliveryDelay) === null || _a === void 0 ? void 0 : _a.delayedRecipients.map((delayed) => delayed.diagnosticCode);
}
function extractDiagnosticCode(snsMessage) {
    if (snsMessage.bounce) {
        return extractBounceAction(snsMessage);
    }
    if (snsMessage.deliveryDelay) {
        return extractDeliveryDelayDiagnosticCode(snsMessage);
    }
    return [];
}
exports.extractDiagnosticCode = extractDiagnosticCode;
//# sourceMappingURL=extract-data.js.map