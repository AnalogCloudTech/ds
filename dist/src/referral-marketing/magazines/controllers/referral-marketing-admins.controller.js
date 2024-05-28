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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralMarketingAdminsController = void 0;
const common_1 = require("@nestjs/common");
const serialize_interceptor_1 = require("../../../internal/common/interceptors/serialize.interceptor");
const generated_magazine_1 = require("../domain/generated-magazine");
const referral_marketing_admins_service_1 = require("../services/referral-marketing-admins.service");
const is_admin_guard_1 = require("../../../internal/common/guards/is-admin.guard");
const create_magazine_admin_dto_1 = require("../dto/create-magazine-admin.dto");
const upload_custom_magazine_dto_1 = require("../dto/upload-custom-magazine.dto");
const turn_month_dto_1 = require("../dto/turn-month.dto");
const update_magazines_admin_dto_1 = require("../dto/update-magazines-admin.dto");
const update_magazine_admin_dto_1 = require("../dto/update-magazine-admin.dto");
const update_magazine_dto_1 = require("../dto/update-magazine.dto");
const validation_transform_pipe_1 = require("../../../internal/common/pipes/validation-transform.pipe");
const customer_by_identities_pipe_1 = require("../../../customers/customers/pipes/transform/customer-by-identities.pipe");
let ReferralMarketingAdminsController = class ReferralMarketingAdminsController {
    constructor(adminsService) {
        this.adminsService = adminsService;
    }
    generateMagazine(dto) {
        const { createTicket, isPreview, userEmail, customerId } = dto, rest = __rest(dto, ["createTicket", "isPreview", "userEmail", "customerId"]);
        return this.adminsService.generateMagazine(rest, createTicket || false, isPreview || false, userEmail, customerId);
    }
    uploadCustomCover(dto) {
        return this.adminsService.uploadCustomCover(dto);
    }
    sendMagazinesToPrint(dto) {
        return this.adminsService.manySendForPrinting(dto);
    }
    sendMagazineToPrint(dto) {
        return this.adminsService.singleSendForPrinting(dto);
    }
    startMonthlyTurnOver(dto) {
        return this.adminsService.scheduleMonthlyTurnOver(dto);
    }
    getMonthlyTurnOverStatus() {
        return this.adminsService.getMonthlyTurnOverQueueCount();
    }
    schedulePermanentLinkTurnOver(dto) {
        return this.adminsService.schedulePermanentLinksTurnOver(dto);
    }
    getSchedulePermanentLinkTurnOver() {
        return this.adminsService.getPermanentQueueCount();
    }
    getGeneratedMagazine(year, month, customerId) {
        return this.adminsService.getGeneratedMagazine(customerId, year, month);
    }
    getMagazine(year, month, customerId) {
        return this.adminsService.getMagazine(customerId, year, month);
    }
    updateMagazine(year, month, customerId, dto) {
        return this.adminsService.updateMagazine(customerId, year, month, dto);
    }
    createTicket(id, customerId, admin) {
        return this.adminsService.createTicket(id, customerId, admin);
    }
};
__decorate([
    (0, common_1.Post)('generate-magazine'),
    (0, serialize_interceptor_1.Serialize)(generated_magazine_1.GeneratedMagazineDomain),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_magazine_admin_dto_1.CreateMagazineAdminDto]),
    __metadata("design:returntype", void 0)
], ReferralMarketingAdminsController.prototype, "generateMagazine", null);
__decorate([
    (0, common_1.Post)('upload-custom-cover'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_custom_magazine_dto_1.UploadCustomMagazineDto]),
    __metadata("design:returntype", void 0)
], ReferralMarketingAdminsController.prototype, "uploadCustomCover", null);
__decorate([
    (0, common_1.Post)('many-magazines-send-to-print'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_magazines_admin_dto_1.UpdateMagazinesAdminDto]),
    __metadata("design:returntype", void 0)
], ReferralMarketingAdminsController.prototype, "sendMagazinesToPrint", null);
__decorate([
    (0, common_1.Post)('single-magazine-send-to-print'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_magazine_admin_dto_1.UpdateMagazineAdminDto]),
    __metadata("design:returntype", void 0)
], ReferralMarketingAdminsController.prototype, "sendMagazineToPrint", null);
__decorate([
    (0, common_1.Post)('monthly-turn-over'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [turn_month_dto_1.TurnMonthDto]),
    __metadata("design:returntype", void 0)
], ReferralMarketingAdminsController.prototype, "startMonthlyTurnOver", null);
__decorate([
    (0, common_1.Get)('monthly-turn-over'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReferralMarketingAdminsController.prototype, "getMonthlyTurnOverStatus", null);
__decorate([
    (0, common_1.Post)('permanent-link-turn-over'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [turn_month_dto_1.CurrentMagazineMonthDate]),
    __metadata("design:returntype", void 0)
], ReferralMarketingAdminsController.prototype, "schedulePermanentLinkTurnOver", null);
__decorate([
    (0, common_1.Get)('permanent-link-turn-over'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReferralMarketingAdminsController.prototype, "getSchedulePermanentLinkTurnOver", null);
__decorate([
    (0, common_1.Get)('generated-magazines/:year/:month/:customerId'),
    (0, serialize_interceptor_1.Serialize)(generated_magazine_1.GeneratedMagazineDomain),
    __param(0, (0, common_1.Param)('year')),
    __param(1, (0, common_1.Param)('month')),
    __param(2, (0, common_1.Param)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ReferralMarketingAdminsController.prototype, "getGeneratedMagazine", null);
__decorate([
    (0, common_1.Get)(':year/:month/:customerId'),
    __param(0, (0, common_1.Param)('year')),
    __param(1, (0, common_1.Param)('month')),
    __param(2, (0, common_1.Param)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ReferralMarketingAdminsController.prototype, "getMagazine", null);
__decorate([
    (0, common_1.Patch)(':year/:month/:customerId'),
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    __param(0, (0, common_1.Param)('year')),
    __param(1, (0, common_1.Param)('month')),
    __param(2, (0, common_1.Param)('customerId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, update_magazine_dto_1.UpdateMagazineDto]),
    __metadata("design:returntype", void 0)
], ReferralMarketingAdminsController.prototype, "updateMagazine", null);
__decorate([
    (0, common_1.Post)(':id/:customerId/create-ticket'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('customerId')),
    __param(2, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ReferralMarketingAdminsController.prototype, "createTicket", null);
ReferralMarketingAdminsController = __decorate([
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, common_1.Controller)({
        path: 'admin/referral-marketing',
        version: '1',
    }),
    __metadata("design:paramtypes", [referral_marketing_admins_service_1.ReferralMarketingAdminsService])
], ReferralMarketingAdminsController);
exports.ReferralMarketingAdminsController = ReferralMarketingAdminsController;
//# sourceMappingURL=referral-marketing-admins.controller.js.map