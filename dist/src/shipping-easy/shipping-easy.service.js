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
exports.ShippingEasyService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const luxon_1 = require("luxon");
const shipping_easy_helper_1 = require("./helpers/shipping-easy.helper");
const constants_1 = require("./constants");
let ShippingEasyService = class ShippingEasyService {
    constructor(http, apiKey, apiSecret) {
        this.http = http;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
    }
    async getOrders(orderStatus, page = 1, perPage = 200) {
        const timestamp = parseInt((Date.now() / 1000).toString());
        const queryParamObject = {
            last_updated_at: luxon_1.DateTime.now().toFormat('yyyy-MM-dd'),
            page: page,
            per_page: perPage,
            status: orderStatus,
        };
        const apiSignature = (0, shipping_easy_helper_1.prepareApiSignature)('GET', '/api/orders', timestamp, queryParamObject, this.apiKey, this.apiSecret);
        const url = `/orders?api_signature=${apiSignature}&api_timestamp=${timestamp}&api_key=${this.apiKey}&` +
            (0, shipping_easy_helper_1.formatQueryString)(queryParamObject);
        try {
            const response = await this.http.get(url);
            return JSON.parse(response.data);
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError) {
                throw new common_1.HttpException({
                    message: 'Error while retrieveing shippingEasy records',
                    method: 'getOrders',
                    error: error.message,
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
};
ShippingEasyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.SHIPPINGEASY_PROVIDER_NAME)),
    __param(1, (0, common_1.Inject)(constants_1.SHIPPINGEASY_API_KEY)),
    __param(2, (0, common_1.Inject)(constants_1.SHIPPINGEASY_SECRET_KEY)),
    __metadata("design:paramtypes", [axios_1.Axios, String, String])
], ShippingEasyService);
exports.ShippingEasyService = ShippingEasyService;
//# sourceMappingURL=shipping-easy.service.js.map