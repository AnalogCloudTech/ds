"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeysModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const nestjs_console_1 = require("nestjs-console");
const api_keys_service_1 = require("./api-keys.service");
const api_keys_cli_service_1 = require("./api-keys.cli.service");
const api_key_schema_1 = require("./schemas/api-key.schema");
let ApiKeysModule = class ApiKeysModule {
};
ApiKeysModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_console_1.ConsoleModule,
            mongoose_1.MongooseModule.forFeature([{ name: api_key_schema_1.ApiKey.name, schema: api_key_schema_1.ApiKeySchema }]),
        ],
        providers: [api_keys_service_1.ApiKeysService, api_keys_cli_service_1.ApiKeysCliService, common_1.Logger],
        exports: [api_keys_service_1.ApiKeysService],
    })
], ApiKeysModule);
exports.ApiKeysModule = ApiKeysModule;
//# sourceMappingURL=api-keys.module.js.map