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
exports.SmsTemplatesController = void 0;
const common_1 = require("@nestjs/common");
const sms_templates_service_1 = require("./sms-templates.service");
const serialize_interceptor_1 = require("../../../internal/common/interceptors/serialize.interceptor");
const sms_template_1 = require("./domain/sms-template");
const common_2 = require("../../../cms/cms/types/common");
let SmsTemplatesController = class SmsTemplatesController {
    constructor(smsTemplatesService) {
        this.smsTemplatesService = smsTemplatesService;
    }
    async findAll(query) {
        return this.smsTemplatesService.findAllPaginated(query);
    }
    async findOne(id) {
        const template = await this.smsTemplatesService.findById(id);
        if (!template) {
            throw new common_1.NotFoundException(template, 'template not found');
        }
        return template;
    }
};
__decorate([
    (0, serialize_interceptor_1.Serialize)(sms_template_1.SmsTemplateDomain),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_2.QueryParams]),
    __metadata("design:returntype", Promise)
], SmsTemplatesController.prototype, "findAll", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(sms_template_1.SmsTemplateDomain),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SmsTemplatesController.prototype, "findOne", null);
SmsTemplatesController = __decorate([
    (0, common_1.Controller)({
        version: '1',
        path: 'sms-templates',
    }),
    __metadata("design:paramtypes", [sms_templates_service_1.SmsTemplatesService])
], SmsTemplatesController);
exports.SmsTemplatesController = SmsTemplatesController;
//# sourceMappingURL=sms-templates.controller.js.map