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
exports.TemplatesService = void 0;
const common_1 = require("@nestjs/common");
const cms_service_1 = require("../../../cms/cms/cms.service");
const common_2 = require("../../../cms/cms/types/common");
const ses_service_1 = require("../../../internal/libs/aws/ses/ses.service");
const constants_1 = require("../../../internal/libs/aws/ses/constants");
const webhook_1 = require("../../../cms/cms/types/webhook");
let TemplatesService = class TemplatesService {
    constructor(cmsService, sesService) {
        this.cmsService = cmsService;
        this.sesService = sesService;
    }
    async list(query) {
        query = Object.assign(Object.assign({}, query), { publicationState: common_2.PublicationState.LIVE });
        return this.cmsService.socialTemplatesList(query);
    }
    async templateDetails(templateId) {
        const query = {
            publicationState: common_2.PublicationState.LIVE,
            populate: '*',
        };
        return this.cmsService.socialMediaTemplateDetails(templateId, query);
    }
    async handleCmsWebhook(event) {
        if (event.model !== 'social-media-template') {
            return;
        }
        const templateId = (0, constants_1.buildTemplateName)(event.entry.id);
        switch (event.event) {
            case webhook_1.EventType.ENTRY_UPDATE:
                return this.sesService.updateTemplate(templateId, event.entry.subject, event.entry.content);
            case webhook_1.EventType.ENTRY_CREATE:
                return this.sesService.createTemplate(templateId, event.entry.subject, event.entry.content);
            case webhook_1.EventType.ENTRY_DELETE:
                return this.sesService.deleteTemplate(templateId);
        }
    }
};
TemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cms_service_1.CmsService,
        ses_service_1.SesService])
], TemplatesService);
exports.TemplatesService = TemplatesService;
//# sourceMappingURL=templates.service.js.map