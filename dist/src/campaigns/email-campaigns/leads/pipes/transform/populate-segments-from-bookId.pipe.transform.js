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
exports.PopulateSegmentsFromBookIdPipeTransform = void 0;
const common_1 = require("@nestjs/common");
const cms_service_1 = require("../../../../../cms/cms/cms.service");
const cms_filter_builder_1 = require("../../../../../internal/utils/cms/filters/cms.filter.builder");
let PopulateSegmentsFromBookIdPipeTransform = class PopulateSegmentsFromBookIdPipeTransform {
    constructor(cmsService) {
        this.cmsService = cmsService;
    }
    async transform(dto) {
        if (dto.bookId) {
            await this.populateSegments(dto.bookId, dto);
        }
        return dto;
    }
    async populateSegments(bookId, dto) {
        const cmsFilterObjects = [];
        cmsFilterObjects.push({
            name: 'bookId',
            operator: '$eq',
            value: bookId,
        });
        const queryString = `?${cms_filter_builder_1.CmsFilterBuilder.build(cmsFilterObjects)}`;
        const segments = await this.cmsService.segmentsList(queryString);
        dto.segments = segments.map((item) => item.id);
    }
};
PopulateSegmentsFromBookIdPipeTransform = __decorate([
    __param(0, (0, common_1.Inject)(cms_service_1.CmsService)),
    __metadata("design:paramtypes", [cms_service_1.CmsService])
], PopulateSegmentsFromBookIdPipeTransform);
exports.PopulateSegmentsFromBookIdPipeTransform = PopulateSegmentsFromBookIdPipeTransform;
//# sourceMappingURL=populate-segments-from-bookId.pipe.transform.js.map