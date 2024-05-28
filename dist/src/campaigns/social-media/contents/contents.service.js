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
exports.ContentsService = void 0;
const common_1 = require("@nestjs/common");
const cms_service_1 = require("../../../cms/cms/cms.service");
const common_2 = require("../../../cms/cms/types/common");
let ContentsService = class ContentsService {
    constructor(cmsService) {
        this.cmsService = cmsService;
    }
    async list(query) {
        query = Object.assign({ populate: ['CampaignPost', 'image'], publicationState: common_2.PublicationState.LIVE }, query);
        return this.cmsService.socialMediaContentsList(query);
    }
    async details(contentId) {
        return this.cmsService.socialMediaContentsDetails(contentId);
    }
};
ContentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cms_service_1.CmsService])
], ContentsService);
exports.ContentsService = ContentsService;
//# sourceMappingURL=contents.service.js.map