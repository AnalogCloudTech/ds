"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerInterceptor = void 0;
const common_1 = require("@nestjs/common");
let LoggerInterceptor = class LoggerInterceptor {
    constructor() {
        this.logger = new common_1.Logger('HTTP');
    }
    intercept(context, next) {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const response = httpContext.getResponse();
        response.on('finish', () => {
            const { method, originalUrl } = request;
            const { statusCode, statusMessage } = response;
            const message = `${method} ${originalUrl} ${statusCode} ${statusMessage}`;
            if (statusCode >= 500) {
                return this.logger.error(message);
            }
            if (statusCode >= 400) {
                return this.logger.warn(message);
            }
            return this.logger.log(message);
        });
        return next.handle();
    }
};
LoggerInterceptor = __decorate([
    (0, common_1.Injectable)()
], LoggerInterceptor);
exports.LoggerInterceptor = LoggerInterceptor;
//# sourceMappingURL=logger.interceptor.js.map