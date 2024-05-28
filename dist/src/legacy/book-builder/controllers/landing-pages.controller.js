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
exports.LandingPagesController = void 0;
const common_1 = require("@nestjs/common");
const landing_pages_service_1 = require("../services/landing-pages.service");
const landing_page_profile_1 = require("../../../customers/customers/domain/landing-page-profile");
const update_landing_page_profile_dto_1 = require("../../../customers/customers/dto/update-landing-page-profile.dto");
const auth_service_1 = require("../../../auth/auth.service");
const lodash_1 = require("lodash");
const customer_by_identities_pipe_1 = require("../../../customers/customers/pipes/transform/customer-by-identities.pipe");
const create_custom_url_dto_1 = require("../dto/create-custom-url.dto");
const is_admin_guard_1 = require("../../../internal/common/guards/is-admin.guard");
let LandingPagesController = class LandingPagesController {
    constructor(service) {
        this.service = service;
    }
    getLandingPageProfile(customer) {
        return customer.landingPageProfile;
    }
    async saveLandingPageProfile(customer, dto) {
        const result = await this.service.saveProfile(customer.id, dto);
        return result.landingPageProfile;
    }
    async getLandingPageDetailsByEmail(email) {
        const landingPageDetails = await this.service.getLandingPageDetailsByEmail(email);
        const { landingPageProfile } = (0, lodash_1.first)(landingPageDetails);
        return landingPageProfile;
    }
    async getCustomLandingPageByEmail(email) {
        return this.service.findDetailsByEmail(email);
    }
    async createCustomLandingPage(dto) {
        return this.service.createCustomLandingPage(dto);
    }
    async updateCustomLandingPageUrl(id, body) {
        return this.service.updateCustomLandingPage(id, body);
    }
    async deleteCustomlandingPageUrl(id) {
        return this.service.deleteCustomLandingPage(id);
    }
};
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", landing_page_profile_1.LandingPageProfile)
], LandingPagesController.prototype, "getLandingPageProfile", null);
__decorate([
    (0, common_1.Post)('profile'),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_landing_page_profile_dto_1.UpdateLandingPageProfileDto]),
    __metadata("design:returntype", Promise)
], LandingPagesController.prototype, "saveLandingPageProfile", null);
__decorate([
    (0, common_1.Get)('profile/:email'),
    (0, auth_service_1.Public)(),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LandingPagesController.prototype, "getLandingPageDetailsByEmail", null);
__decorate([
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, common_1.Get)('custom-url/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LandingPagesController.prototype, "getCustomLandingPageByEmail", null);
__decorate([
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, common_1.Post)('custom-url'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_custom_url_dto_1.CreateCustomUrlDto]),
    __metadata("design:returntype", Promise)
], LandingPagesController.prototype, "createCustomLandingPage", null);
__decorate([
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, common_1.Patch)('custom-url/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LandingPagesController.prototype, "updateCustomLandingPageUrl", null);
__decorate([
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, common_1.Delete)('custom-url/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LandingPagesController.prototype, "deleteCustomlandingPageUrl", null);
LandingPagesController = __decorate([
    (0, common_1.Controller)({ path: 'landing-pages', version: '1' }),
    __metadata("design:paramtypes", [landing_pages_service_1.LandingPagesService])
], LandingPagesController);
exports.LandingPagesController = LandingPagesController;
//# sourceMappingURL=landing-pages.controller.js.map