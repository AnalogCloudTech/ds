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
exports.ContentsController = void 0;
const common_1 = require("@nestjs/common");
const contents_service_1 = require("./contents.service");
const customer_by_identities_pipe_1 = require("../../../customers/customers/pipes/transform/customer-by-identities.pipe");
let ContentsController = class ContentsController {
    constructor(service) {
        this.service = service;
    }
    async index(customer) {
        return this.service.findAllWithCustomerCampaignId(customer);
    }
    async details(contentId) {
        return this.service.details(contentId);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContentsController.prototype, "index", null);
__decorate([
    (0, common_1.Get)(':contentId'),
    __param(0, (0, common_1.Param)('contentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ContentsController.prototype, "details", null);
ContentsController = __decorate([
    (0, common_1.Controller)({ path: 'email-campaigns/content', version: '1' }),
    __metadata("design:paramtypes", [contents_service_1.ContentsService])
], ContentsController);
exports.ContentsController = ContentsController;
//# sourceMappingURL=contents.controller.js.map