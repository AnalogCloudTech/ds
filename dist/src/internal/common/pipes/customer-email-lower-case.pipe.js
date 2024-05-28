"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerEmailLowerCasePipe = void 0;
class CustomerEmailLowerCasePipe {
    transform(object) {
        var _a;
        if (!object.hasOwnProperty('customerEmail')) {
            return object;
        }
        return Object.assign(Object.assign({}, object), { customerEmail: (_a = object === null || object === void 0 ? void 0 : object.customerEmail) === null || _a === void 0 ? void 0 : _a.toLowerCase() });
    }
}
exports.CustomerEmailLowerCasePipe = CustomerEmailLowerCasePipe;
//# sourceMappingURL=customer-email-lower-case.pipe.js.map