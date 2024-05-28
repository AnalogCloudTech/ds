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
exports.UpdateOnDemandEmailDto = void 0;
const exists_in_cms_1 = require("../../../../cms/cms/validation-rules/exists-in-cms");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class UpdateOnDemandEmailDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOnDemandEmailDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, exists_in_cms_1.ExistsInCms)(['templateDetails']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateOnDemandEmailDto.prototype, "templateId", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((self) => !self.allSegments),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateOnDemandEmailDto.prototype, "segments", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateOnDemandEmailDto.prototype, "allSegments", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateOnDemandEmailDto.prototype, "sendImmediately", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((self) => !self.sendImmediately),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOnDemandEmailDto.prototype, "scheduleDate", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOnDemandEmailDto.prototype, "timezone", void 0);
exports.UpdateOnDemandEmailDto = UpdateOnDemandEmailDto;
//# sourceMappingURL=update-on-demand-email.dto.js.map