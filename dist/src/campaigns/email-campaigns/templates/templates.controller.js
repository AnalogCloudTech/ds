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
exports.TemplatesController = void 0;
const common_1 = require("@nestjs/common");
const util_1 = require("util");
const templates_service_1 = require("./templates.service");
const paginator_1 = require("../../../internal/utils/paginator");
const customer_by_identities_pipe_1 = require("../../../customers/customers/pipes/transform/customer-by-identities.pipe");
const template_1 = require("../../../cms/cms/types/template");
const serialize_interceptor_1 = require("../../../internal/common/interceptors/serialize.interceptor");
const validation_transform_pipe_1 = require("../../../internal/common/pipes/validation-transform.pipe");
let TemplatesController = class TemplatesController {
    constructor(templatesService, logger) {
        this.templatesService = templatesService;
        this.logger = logger;
    }
    async webhook(event) {
        this.logger.log(`Received webhook: ${(0, util_1.inspect)(event)}`);
        return this.templatesService.handleCmsWebhook(event);
    }
    list(customer, paginator) {
        return this.templatesService.list(customer, paginator);
    }
    listDropDown() {
        return this.templatesService.listDropdown();
    }
    async show(templateId) {
        return this.templatesService.templateDetails(templateId);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "webhook", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(template_1.TemplateDetails),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe, paginator_1.PaginatorTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, paginator_1.Paginator]),
    __metadata("design:returntype", void 0)
], TemplatesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('dropdown/list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TemplatesController.prototype, "listDropDown", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "show", null);
TemplatesController = __decorate([
    (0, common_1.Controller)({ path: 'email-campaigns/templates', version: '1' }),
    __metadata("design:paramtypes", [templates_service_1.TemplatesService,
        common_1.Logger])
], TemplatesController);
exports.TemplatesController = TemplatesController;
//# sourceMappingURL=templates.controller.js.map