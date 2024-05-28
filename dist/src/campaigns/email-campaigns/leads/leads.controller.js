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
exports.LeadsController = void 0;
const common_1 = require("@nestjs/common");
const leads_service_1 = require("./leads.service");
const create_lead_dto_1 = require("./dto/create-lead.dto");
const update_lead_dto_1 = require("./dto/update-lead.dto");
const create_lead_from_pagestead_dto_1 = require("./dto/create-lead-from-pagestead.dto");
const platform_express_1 = require("@nestjs/platform-express");
const lodash_1 = require("lodash");
const import_lead_dto_1 = require("./dto/import-lead.dto");
const setFileTransformValidate_pipe_1 = require("./pipes/transform/setFileTransformValidate.pipe");
const paginator_1 = require("../../../internal/utils/paginator");
const customer_email_transform_pipe_1 = require("../common/pipes/customer-email-transform.pipe");
const validate_segments_pipe_1 = require("../common/pipes/validate-segments.pipe");
const populate_segments_from_bookId_pipe_transform_1 = require("./pipes/transform/populate-segments-from-bookId.pipe.transform");
const auth_service_1 = require("../../../auth/auth.service");
const inherit_data_pipe_1 = require("./pipes/transform/inherit-data.pipe");
const email_lower_case_pipe_1 = require("../../../internal/common/pipes/email-lower-case.pipe");
const lead_1 = require("./domain/lead");
const serialize_interceptor_1 = require("../../../internal/common/interceptors/serialize.interceptor");
const customer_by_identities_pipe_1 = require("../../../customers/customers/pipes/transform/customer-by-identities.pipe");
const validation_transform_pipe_1 = require("../../../internal/common/pipes/validation-transform.pipe");
const leads_filters_dto_1 = require("./dto/leads-filters.dto");
const unsubscribe_lead_dto_1 = require("./dto/unsubscribe-lead.dto");
const bulk_delete_leads_dto_1 = require("./dto/bulk-delete-leads.dto");
let LeadsController = class LeadsController {
    constructor(leadsService) {
        this.leadsService = leadsService;
    }
    async findAll(req, customer, { page, perPage }, filters, { sort }) {
        const identities = (0, lodash_1.get)(req, ['user', 'identities']);
        return this.leadsService.findAllPaginated(identities, customer, page, perPage, filters, sort);
    }
    async create(req, customer, dto) {
        return this.leadsService.create(dto, customer);
    }
    async createLandingPage(req, dto) {
        return this.leadsService.create(dto);
    }
    createFromPagestead(createLeadFromPagesteadDto) {
        return this.leadsService.createFromPagestead(createLeadFromPagesteadDto);
    }
    async update(req, customer, id, updateLeadDto) {
        const identities = (0, lodash_1.get)(req, ['user', 'identities']);
        return this.leadsService.updateUserLead(customer, identities, id, updateLeadDto);
    }
    async removeBulk(dto, customer) {
        return this.leadsService.bulkRemoveCustomerLeads(customer, dto);
    }
    remove(req, customer, id) {
        const identities = (0, lodash_1.get)(req, ['user', 'identities']);
        return this.leadsService.removeUserLead(customer, identities, id);
    }
    importList(dto, customer) {
        return this.leadsService.batchStoreFromFile(dto, customer);
    }
    async downloadLeads(req, customer, res) {
        const user = req.user;
        const report = await this.leadsService.exportLeads(user, customer);
        res.type('csv');
        return res.send(report);
    }
    async unsubscribe(dto) {
        return this.leadsService.unsubscribe(dto.id);
    }
};
__decorate([
    (0, serialize_interceptor_1.Serialize)(lead_1.Lead),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(2, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe, paginator_1.PaginatorTransformPipe)),
    __param(3, (0, common_1.Query)('filters', validation_transform_pipe_1.ValidationTransformPipe)),
    __param(4, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, paginator_1.Paginator,
        leads_filters_dto_1.LeadsFiltersDTO, Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "findAll", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(lead_1.Lead),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(2, (0, common_1.Body)(validation_transform_pipe_1.ValidationTransformPipe, email_lower_case_pipe_1.EmailLowerCasePipe, customer_email_transform_pipe_1.CustomerEmailTransformPipe, validate_segments_pipe_1.ValidateSegmentsPipe, inherit_data_pipe_1.InheritDataPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_lead_dto_1.CreateLeadDto]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "create", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(lead_1.Lead),
    (0, auth_service_1.Public)(),
    (0, common_1.Post)('/public'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(email_lower_case_pipe_1.EmailLowerCasePipe, validate_segments_pipe_1.ValidateSegmentsPipe, inherit_data_pipe_1.InheritDataPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_lead_dto_1.CreateLeadDto]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "createLandingPage", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(lead_1.Lead),
    (0, auth_service_1.Public)(),
    (0, common_1.Post)('create-from-pagestead'),
    __param(0, (0, common_1.Body)(email_lower_case_pipe_1.EmailLowerCasePipe, populate_segments_from_bookId_pipe_transform_1.PopulateSegmentsFromBookIdPipeTransform, inherit_data_pipe_1.InheritDataPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lead_from_pagestead_dto_1.CreateLeadFromPagesteadDto]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "createFromPagestead", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(lead_1.Lead),
    (0, common_1.Patch)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)(email_lower_case_pipe_1.EmailLowerCasePipe, validate_segments_pipe_1.ValidateSegmentsPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, update_lead_dto_1.UpdateLeadDto]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('bulk-delete'),
    __param(0, (0, common_1.Body)(validation_transform_pipe_1.ValidationTransformPipe)),
    __param(1, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_delete_leads_dto_1.BulkDeleteLeadsDto, Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "removeBulk", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(lead_1.Lead),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('import-list'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Body)(customer_email_transform_pipe_1.CustomerEmailTransformPipe, setFileTransformValidate_pipe_1.SetFileTransformValidatePipe)),
    __param(1, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [import_lead_dto_1.ImportLeadDto, Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "importList", null);
__decorate([
    (0, common_1.Get)('exportLeads'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "downloadLeads", null);
__decorate([
    (0, auth_service_1.Public)(),
    (0, common_1.Get)(':id/unsubscribe'),
    __param(0, (0, common_1.Param)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [unsubscribe_lead_dto_1.UnsubscribeLeadDTO]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "unsubscribe", null);
LeadsController = __decorate([
    (0, common_1.Controller)({ path: 'email-campaigns/leads', version: '1' }),
    __metadata("design:paramtypes", [leads_service_1.LeadsService])
], LeadsController);
exports.LeadsController = LeadsController;
//# sourceMappingURL=leads.controller.js.map