"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeysGuard = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../../../../../auth/auth.service");
const core_1 = require("@nestjs/core");
let ApiKeysGuard = class ApiKeysGuard {
    constructor(reflector, authService) {
        this.reflector = reflector;
        this.authService = authService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization || request.query.apiKey;
        const isApiKeyOnly = this.reflector.getAllAndOverride(auth_service_1.IS_APIKEY_ONLY_KEY, [context.getHandler(), context.getClass()]);
        if (!authorization) {
            return !isApiKeyOnly;
        }
        const prefixRegexp = new RegExp(auth_service_1.API_KEY_PREFIX, 'i');
        const apiKey = authorization.replace(prefixRegexp, '');
        const trimmedApiKey = apiKey.trim();
        if (!trimmedApiKey) {
            return true;
        }
        const result = await this.authService.validateApiKey(trimmedApiKey);
        return Boolean(result);
    }
};
ApiKeysGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        auth_service_1.AuthService])
], ApiKeysGuard);
exports.ApiKeysGuard = ApiKeysGuard;
//# sourceMappingURL=api-keys.guard.js.map