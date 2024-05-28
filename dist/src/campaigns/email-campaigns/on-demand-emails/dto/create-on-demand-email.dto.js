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
exports.CreateOnDemandEmailDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const exists_in_cms_1 = require("../../../../cms/cms/validation-rules/exists-in-cms");
class CreateOnDemandEmailDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOnDemandEmailDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, exists_in_cms_1.ExistsInCms)(['templateDetails']),
    __metadata("design:type", Number)
], CreateOnDemandEmailDto.prototype, "templateId", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((self) => !self.allSegments),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Array)
], CreateOnDemandEmailDto.prototype, "segments", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateOnDemandEmailDto.prototype, "allSegments", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateOnDemandEmailDto.prototype, "customer", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateOnDemandEmailDto.prototype, "sendImmediately", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((self) => !self.sendImmediately),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateOnDemandEmailDto.prototype, "scheduleDate", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOnDemandEmailDto.prototype, "timezone", void 0);
exports.CreateOnDemandEmailDto = CreateOnDemandEmailDto;
//# sourceMappingURL=create-on-demand-email.dto.js.map