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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChargifyService = void 0;
const axios_1 = require("axios");
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
let ChargifyService = class ChargifyService {
    constructor(http) {
        this.http = http;
    }
    async passthru(url, reqMethod, payload) {
        try {
            const response = await this.http[reqMethod](url, payload);
            return (0, lodash_1.get)(response, 'data');
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError) {
                const { response: errorResponse, status } = error;
                throw new common_1.HttpException(errorResponse, status);
            }
        }
    }
};
ChargifyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('HTTP_CHARGIFY')),
    __metadata("design:paramtypes", [axios_1.Axios])
], ChargifyService);
exports.ChargifyService = ChargifyService;
//# sourceMappingURL=chargify.service.js.map