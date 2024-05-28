"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpentelemetryInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const api_1 = require("@opentelemetry/api");
let OpentelemetryInterceptor = class OpentelemetryInterceptor {
    intercept(ctx, next) {
        const request = ctx.switchToHttp().getRequest();
        const span = api_1.trace.getSpan(api_1.context.active());
        if (request === null || request === void 0 ? void 0 : request.user) {
            const { userId, email, isAdmin, isPilotCustomer, role, hasSocialMediaTrainingAccess, } = request.user;
            span === null || span === void 0 ? void 0 : span.setAttributes({
                user: userId,
                email,
                isAdmin,
                isPilotCustomer,
                role,
                hasSocialMediaTrainingAccess,
            });
        }
        return next.handle().pipe((0, rxjs_1.catchError)((err) => {
            const ignoreErrors = [
                common_1.HttpStatus.NOT_FOUND,
                common_1.HttpStatus.OK,
                common_1.HttpStatus.ACCEPTED,
            ];
            if (!ignoreErrors.includes(err === null || err === void 0 ? void 0 : err.status) && span) {
                span.setStatus({
                    code: api_1.SpanStatusCode.ERROR,
                    message: err === null || err === void 0 ? void 0 : err.message,
                });
                span.recordException({
                    message: err === null || err === void 0 ? void 0 : err.message,
                    code: err === null || err === void 0 ? void 0 : err.status,
                    name: err === null || err === void 0 ? void 0 : err.name,
                    stack: err === null || err === void 0 ? void 0 : err.stack,
                });
            }
            return (0, rxjs_1.throwError)(() => err);
        }), (0, rxjs_1.finalize)(() => {
            if (span) {
                span.setStatus({
                    code: api_1.SpanStatusCode.OK,
                    message: 'OK',
                });
                span.end();
            }
        }));
    }
};
OpentelemetryInterceptor = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST })
], OpentelemetryInterceptor);
exports.OpentelemetryInterceptor = OpentelemetryInterceptor;
//# sourceMappingURL=opentelemetry.interceptor.js.map