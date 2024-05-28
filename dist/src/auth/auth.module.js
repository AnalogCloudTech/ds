"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const api_keys_module_1 = require("./api-keys/api-keys.module");
const api_key_strategy_1 = require("./api-key.strategy");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const jwt_strategy_1 = require("./jwt.strategy");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                imports: [],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const secret = configService.get('auth.jwtSecret');
                    const expiresIn = configService.get('auth.jwtExpiration');
                    const signOptions = {
                        expiresIn,
                    };
                    return {
                        secret,
                        signOptions,
                    };
                },
            }),
            api_keys_module_1.ApiKeysModule,
        ],
        providers: [auth_service_1.AuthService, api_key_strategy_1.ApiKeyStrategy, jwt_strategy_1.JwtStrategy],
        controllers: [auth_controller_1.AuthController],
        exports: [jwt_1.JwtModule],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map