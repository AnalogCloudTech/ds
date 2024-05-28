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
exports.UpdateCampaignStatusDto = exports.UpdateCampaignDto = exports.CreateCampaignDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const types_1 = require("../domain/types");
const exists_in_cms_1 = require("../../../../cms/cms/validation-rules/exists-in-cms");
class CreateCampaignDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCampaignDto.prototype, "allowWeekend", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(types_1.CampaignStatus),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, exists_in_cms_1.ExistsInCms)(['contentDetails']),
    __metadata("design:type", Number)
], CreateCampaignDto.prototype, "contentId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCampaignDto.prototype, "allSegments", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((self) => !self.allSegments),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ArrayUnique)(),
    (0, exists_in_cms_1.ExistsInCms)(['allSegmentsExists']),
    __metadata("design:type", Array)
], CreateCampaignDto.prototype, "segments", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateCampaignDto.prototype, "customerId", void 0);
exports.CreateCampaignDto = CreateCampaignDto;
class UpdateCampaignDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCampaignDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateCampaignDto.prototype, "allowWeekend", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCampaignDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(types_1.CampaignStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCampaignDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, exists_in_cms_1.ExistsInCms)(['contentDetails']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateCampaignDto.prototype, "contentId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateCampaignDto.prototype, "allSegments", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((self) => !self.allSegments),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ArrayUnique)(),
    (0, exists_in_cms_1.ExistsInCms)(['allSegmentsExists']),
    __metadata("design:type", Array)
], UpdateCampaignDto.prototype, "segments", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateCampaignDto.prototype, "customerId", void 0);
exports.UpdateCampaignDto = UpdateCampaignDto;
class UpdateCampaignStatusDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(types_1.CampaignStatus),
    __metadata("design:type", String)
], UpdateCampaignStatusDto.prototype, "status", void 0);
exports.UpdateCampaignStatusDto = UpdateCampaignStatusDto;
//# sourceMappingURL=campaign.dto.js.map