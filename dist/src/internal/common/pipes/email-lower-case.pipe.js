"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailLowerCasePipe = void 0;
class EmailLowerCasePipe {
    transform(object) {
        var _a;
        if (!object.hasOwnProperty('email')) {
            return object;
        }
        return Object.assign(Object.assign({}, object), { email: (_a = object === null || object === void 0 ? void 0 : object.email) === null || _a === void 0 ? void 0 : _a.toLowerCase() });
    }
}
exports.EmailLowerCasePipe = EmailLowerCasePipe;
//# sourceMappingURL=email-lower-case.pipe.js.map