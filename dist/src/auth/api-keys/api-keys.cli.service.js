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
exports.ApiKeysCliService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_console_1 = require("nestjs-console");
const api_keys_service_1 = require("./api-keys.service");
const luxon_1 = require("luxon");
const contexts_1 = require("../../internal/common/contexts");
let ApiKeysCliService = class ApiKeysCliService {
    constructor(consoleService, apiKeysService, logger) {
        this.consoleService = consoleService;
        this.apiKeysService = apiKeysService;
        this.logger = logger;
        this.createApiKey = async (title) => {
            const createApiKeyDto = { title };
            const apiKey = await this.apiKeysService.create(createApiKeyDto);
            this.logger.log({
                payload: {
                    usageDate: luxon_1.DateTime.now(),
                    title,
                    key: apiKey.key,
                },
            }, contexts_1.CONTEXT_API_KEY_CLI_SERVICE);
        };
        const cli = this.consoleService.getCli();
        const groupCommand = this.consoleService.createGroupCommand({
            command: 'api-keys',
            description: 'Manipulate API keys',
        }, cli);
        this.consoleService.createCommand({
            command: 'create <title>',
            description: 'Create an API key',
        }, this.createApiKey, groupCommand);
    }
};
ApiKeysCliService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_console_1.ConsoleService,
        api_keys_service_1.ApiKeysService,
        common_1.Logger])
], ApiKeysCliService);
exports.ApiKeysCliService = ApiKeysCliService;
//# sourceMappingURL=api-keys.cli.service.js.map