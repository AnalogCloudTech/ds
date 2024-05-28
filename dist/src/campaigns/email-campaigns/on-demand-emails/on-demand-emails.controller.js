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
exports.OnDemandEmailsController = void 0;
const common_1 = require("@nestjs/common");
const on_demand_emails_service_1 = require("./on-demand-emails.service");
const create_on_demand_email_dto_1 = require("./dto/create-on-demand-email.dto");
const update_on_demand_email_dto_1 = require("./dto/update-on-demand-email.dto");
const validate_schedule_date_pipe_1 = require("./pipes/validate-schedule-date.pipe");
const on_demand_email_1 = require("./domain/on-demand-email");
const verified_email_guard_service_1 = require("../common/guards/verified-email-guard.service");
const can_be_changed_pipe_service_1 = require("./pipes/can-be-changed-pipe.service");
const paginator_1 = require("../../../internal/utils/paginator");
const customer_by_identities_pipe_1 = require("../../../customers/customers/pipes/transform/customer-by-identities.pipe");
const serialize_interceptor_1 = require("../../../internal/common/interceptors/serialize.interceptor");
const validation_transform_pipe_1 = require("../../../internal/common/pipes/validation-transform.pipe");
let OnDemandEmailsController = class OnDemandEmailsController {
    constructor(onDemandEmailsService) {
        this.onDemandEmailsService = onDemandEmailsService;
    }
    async create(customer, createOnDemandEmailDto) {
        return this.onDemandEmailsService.create(customer, createOnDemandEmailDto);
    }
    async findAll(customer, { page, perPage }) {
        return this.onDemandEmailsService.findAllPaginated(customer, page, perPage);
    }
    async findOne(customer, id) {
        return this.onDemandEmailsService.findOneByUser(customer, id);
    }
    async update(id, updateOnDemandEmailDto) {
        return this.onDemandEmailsService.update(id, updateOnDemandEmailDto);
    }
    async remove(id) {
        return this.onDemandEmailsService.remove(id);
    }
};
__decorate([
    (0, serialize_interceptor_1.Serialize)(on_demand_email_1.OnDemandEmail),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(verified_email_guard_service_1.VerifiedEmailGuard),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe, validate_schedule_date_pipe_1.ValidateScheduleDateTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_on_demand_email_dto_1.CreateOnDemandEmailDto]),
    __metadata("design:returntype", Promise)
], OnDemandEmailsController.prototype, "create", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(on_demand_email_1.OnDemandEmail),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe, paginator_1.PaginatorTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, paginator_1.Paginator]),
    __metadata("design:returntype", Promise)
], OnDemandEmailsController.prototype, "findAll", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(on_demand_email_1.OnDemandEmail),
    (0, common_1.Get)(':onDemandEmailId'),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Param)('onDemandEmailId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OnDemandEmailsController.prototype, "findOne", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(on_demand_email_1.OnDemandEmail),
    (0, common_1.Patch)(':onDemandEmailId'),
    __param(0, (0, common_1.Param)('onDemandEmailId', can_be_changed_pipe_service_1.CanBeChangedPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_on_demand_email_dto_1.UpdateOnDemandEmailDto]),
    __metadata("design:returntype", Promise)
], OnDemandEmailsController.prototype, "update", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(on_demand_email_1.OnDemandEmail),
    (0, common_1.Delete)(':onDemandEmailId'),
    __param(0, (0, common_1.Param)('onDemandEmailId', can_be_changed_pipe_service_1.CanBeChangedPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OnDemandEmailsController.prototype, "remove", null);
OnDemandEmailsController = __decorate([
    (0, common_1.Controller)({ path: 'email-campaigns/on-demand-emails', version: '1' }),
    __metadata("design:paramtypes", [on_demand_emails_service_1.OnDemandEmailsService])
], OnDemandEmailsController);
exports.OnDemandEmailsController = OnDemandEmailsController;
//# sourceMappingURL=on-demand-emails.controller.js.map