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
exports.CampaignAttributesController = void 0;
const ses_service_1 = require("../../../internal/libs/aws/ses/ses.service");
const attributesDto_1 = require("../../../customers/customers/dto/attributesDto");
const common_1 = require("@nestjs/common");
const campaign_attributes_service_1 = require("./campaign-attributes.service");
const email_lower_case_pipe_1 = require("../../../internal/common/pipes/email-lower-case.pipe");
const customer_by_identities_pipe_1 = require("../../../customers/customers/pipes/transform/customer-by-identities.pipe");
let CampaignAttributesController = class CampaignAttributesController {
    constructor(attributesService, sesService) {
        this.attributesService = attributesService;
        this.sesService = sesService;
    }
    async create(createAttributeDto, customer) {
        await this.attributesService.create(customer.id, createAttributeDto);
    }
    findOne(customer) {
        return this.attributesService.findOne(customer.id);
    }
    async remove(customer) {
        await this.attributesService.remove(customer.id);
    }
    verifyEmail(email) {
        return this.sesService.sendVerificationEmail(email);
    }
    emailIsVerified(email) {
        return this.sesService.emailIsVerified(email);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(email_lower_case_pipe_1.EmailLowerCasePipe)),
    __param(1, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attributesDto_1.CreateAttributesDto, Object]),
    __metadata("design:returntype", Promise)
], CampaignAttributesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CampaignAttributesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CampaignAttributesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaignAttributesController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('isverified'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaignAttributesController.prototype, "emailIsVerified", null);
CampaignAttributesController = __decorate([
    (0, common_1.Controller)({ path: 'email-campaigns/attributes', version: '1' }),
    __metadata("design:paramtypes", [campaign_attributes_service_1.CampaignAttributesService,
        ses_service_1.SesService])
], CampaignAttributesController);
exports.CampaignAttributesController = CampaignAttributesController;
//# sourceMappingURL=campaign-attributes.controller.js.map