"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateBookModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const generate_book_service_1 = require("./generate-book.service");
const axios_defaults_config_1 = require("../../internal/utils/axiosTranformer/axios-defaults-config");
let GenerateBookModule = class GenerateBookModule {
};
GenerateBookModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        providers: [
            generate_book_service_1.GenerateBookService,
            {
                inject: [config_1.ConfigService],
                provide: 'HTTP_GENERATE_BOOK',
                useFactory: (configService) => {
                    const baseURL = configService.get('bookApi.url');
                    const apiKey = configService.get('bookApi.key');
                    const params = {
                        key: apiKey,
                    };
                    const config = Object.assign(Object.assign({}, (0, axios_defaults_config_1.axiosDefaultsConfig)()), { baseURL,
                        params });
                    return new axios_1.Axios(config);
                },
            },
        ],
        exports: [generate_book_service_1.GenerateBookService, 'HTTP_GENERATE_BOOK'],
    })
], GenerateBookModule);
exports.GenerateBookModule = GenerateBookModule;
//# sourceMappingURL=generate-book.module.js.map