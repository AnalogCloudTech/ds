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
exports.AuthService = exports.ApiKeyOnly = exports.Public = exports.IS_APIKEY_ONLY_KEY = exports.IS_PUBLIC_KEY = exports.API_KEY_PREFIX = void 0;
const common_1 = require("@nestjs/common");
const api_keys_service_1 = require("./api-keys/api-keys.service");
const jwt_1 = require("@nestjs/jwt");
exports.API_KEY_PREFIX = 'afy-api-key';
exports.IS_PUBLIC_KEY = 'isPublic';
exports.IS_APIKEY_ONLY_KEY = 'isApiKeyOnly';
const Public = () => (0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true);
exports.Public = Public;
const ApiKeyOnly = () => (0, common_1.SetMetadata)(exports.IS_APIKEY_ONLY_KEY, true);
exports.ApiKeyOnly = ApiKeyOnly;
let AuthService = class AuthService {
    constructor(apiKeysService, jwtService) {
        this.apiKeysService = apiKeysService;
        this.jwtService = jwtService;
    }
    validateApiKey(key) {
        return this.apiKeysService.findByKey(key);
    }
    login(user) {
        const payload = { sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [api_keys_service_1.ApiKeysService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map