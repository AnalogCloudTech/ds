"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsBooksModule = void 0;
const common_1 = require("@nestjs/common");
const cms_books_service_1 = require("./cms-books.service");
const cms_books_controller_1 = require("./cms-books.controller");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const axios_defaults_config_1 = require("../../internal/utils/axiosTranformer/axios-defaults-config");
const cms_books_repository_1 = require("./cms-books.repository");
let CmsBooksModule = class CmsBooksModule {
};
CmsBooksModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [cms_books_controller_1.CmsBooksController],
        providers: [
            cms_books_service_1.CmsBooksService,
            {
                provide: 'HTTP_BOOK_CMS',
                scope: common_1.Scope.REQUEST,
                useFactory: async (configService) => {
                    try {
                        const baseURL = configService.get('oldCms.authUrl');
                        const identifier = configService.get('oldCms.user');
                        const password = configService.get('oldCms.password');
                        const config = Object.assign(Object.assign({}, (0, axios_defaults_config_1.axiosDefaultsConfig)()), { baseURL });
                        const authAxios = new axios_1.Axios(config);
                        const { status, data } = await authAxios.post('', {
                            identifier,
                            password,
                        });
                        if (status === common_1.HttpStatus.OK) {
                            const { jwt } = data;
                            const baseURL = configService.get('oldCms.url');
                            const config = Object.assign(Object.assign({}, (0, axios_defaults_config_1.axiosDefaultsConfig)({
                                authorization: `Bearer ${jwt}`,
                            })), { baseURL });
                            return new axios_1.Axios(config);
                        }
                        throw new common_1.UnauthorizedException('Book CMS Authentication failed');
                    }
                    catch (error) {
                        if (error instanceof common_1.UnauthorizedException) {
                            throw new common_1.HttpException(`correctly configure environment variables of Book CMS - ${error === null || error === void 0 ? void 0 : error.message}`, common_1.HttpStatus.UNAUTHORIZED);
                        }
                        if (error instanceof Error) {
                            throw new common_1.HttpException(`correctly configure environment variables of Book CMS - ${error === null || error === void 0 ? void 0 : error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                        }
                    }
                },
                inject: [config_1.ConfigService],
            },
            {
                provide: cms_books_repository_1.CmsBooksRepository,
                inject: ['HTTP_BOOK_CMS'],
                useFactory: (httpBookCms, logger) => {
                    return new cms_books_repository_1.CmsBooksRepository(httpBookCms, logger);
                },
            },
        ],
    })
], CmsBooksModule);
exports.CmsBooksModule = CmsBooksModule;
//# sourceMappingURL=cms-books.module.js.map