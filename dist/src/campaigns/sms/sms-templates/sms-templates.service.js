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
exports.SmsTemplatesService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const sms_templates_repository_1 = require("./sms-templates.repository");
const build_cms_pagination_1 = require("../../../cms/cms/helpers/build-cms-pagination");
const flatten_cms_object_1 = require("../../../cms/cms/helpers/flatten-cms-object");
let SmsTemplatesService = class SmsTemplatesService {
    constructor(http) {
        this.http = http;
        this.repository = new sms_templates_repository_1.SmsTemplatesRepository(http);
    }
    async findById(id) {
        const template = await this.repository.findById(id);
        return template ? (0, flatten_cms_object_1.flattenCmsObject)(template) : null;
    }
    async findByKey(key) {
        const queryParams = {
            filters: {
                key,
            },
        };
        try {
            const template = await this.repository.first(queryParams);
            return template ? (0, flatten_cms_object_1.flattenCmsObject)(template) : null;
        }
        catch (error) {
            return null;
        }
    }
    async findAllPaginated(query) {
        const response = await this.repository.findAllPaginated(query);
        return (0, build_cms_pagination_1.buildCmsPagination)(response);
    }
};
SmsTemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('HTTP_CMS')),
    __metadata("design:paramtypes", [axios_1.Axios])
], SmsTemplatesService);
exports.SmsTemplatesService = SmsTemplatesService;
//# sourceMappingURL=sms-templates.service.js.map