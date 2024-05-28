"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformType = exports.transformSortBy = exports.transformStatus = exports.transformTitle = exports.statusMap = void 0;
const class_validator_1 = require("class-validator");
exports.statusMap = {
    bounce: 'Bounced',
    open: 'Opened',
    rejected: 'Rejected',
    complaint: 'Spam',
    delivery: 'Success',
    unsubscribed: 'Unsubscribed',
    send: 'Sent',
};
function transformTitle({ obj }) {
    var _a, _b;
    return obj.relationType === 'OnDemandEmail'
        ? (_a = obj === null || obj === void 0 ? void 0 : obj.relationId) === null || _a === void 0 ? void 0 : _a.subject
        : (_b = obj === null || obj === void 0 ? void 0 : obj.relationId) === null || _b === void 0 ? void 0 : _b.name;
}
exports.transformTitle = transformTitle;
function transformStatus({ obj }) {
    return exports.statusMap[obj.status] || '';
}
exports.transformStatus = transformStatus;
function transformSortBy({ value }) {
    if (!value) {
        return {};
    }
    return value.split(',').reduce((acc, curr) => {
        const [key, order] = curr.split(':');
        if (!key || !order) {
            return acc;
        }
        const n = +order;
        acc[key] = (0, class_validator_1.isNumber)(n) ? n : 1;
        return acc;
    }, {});
}
exports.transformSortBy = transformSortBy;
function transformType({ obj }) {
    var _a, _b, _c;
    return obj.relationType === 'OnDemandEmail'
        ? (_a = obj.relationId) === null || _a === void 0 ? void 0 : _a.templateName
        : (_c = (_b = obj.relationType) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.name;
}
exports.transformType = transformType;
//# sourceMappingURL=types.js.map