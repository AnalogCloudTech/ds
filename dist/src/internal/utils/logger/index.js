"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerWithContext = exports.LoggerPayload = void 0;
const common_1 = require("@nestjs/common");
class LoggerPayload {
}
exports.LoggerPayload = LoggerPayload;
const LoggerWithContext = (context) => {
    return {
        provide: 'logger',
        useFactory: () => {
            return new common_1.Logger(context);
        },
    };
};
exports.LoggerWithContext = LoggerWithContext;
//# sourceMappingURL=index.js.map