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
exports.CampaignAttributesService = void 0;
const ses_service_1 = require("../../../internal/libs/aws/ses/ses.service");
const customers_service_1 = require("../../../customers/customers/customers.service");
const customer_1 = require("../../../customers/customers/domain/customer");
const common_1 = require("@nestjs/common");
let CampaignAttributesService = class CampaignAttributesService {
    constructor(customerService, sesService) {
        this.customerService = customerService;
        this.sesService = sesService;
    }
    async create(id, createAttributeDto) {
        const emailIsVerified = await this.sesService.emailIsVerified(createAttributeDto.email);
        if (!emailIsVerified) {
            await this.sesService.sendVerificationEmail(createAttributeDto.email);
        }
        return this.customerService.saveCampaignAttributes(id, createAttributeDto);
    }
    async findOne(id) {
        const customer = (await this.customerService.findById(id)).castTo(customer_1.Customer);
        return customer === null || customer === void 0 ? void 0 : customer.attributes;
    }
    remove(id) {
        return this.customerService.saveCampaignAttributes(id, null);
    }
};
CampaignAttributesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customers_service_1.CustomersService,
        ses_service_1.SesService])
], CampaignAttributesService);
exports.CampaignAttributesService = CampaignAttributesService;
//# sourceMappingURL=campaign-attributes.service.js.map