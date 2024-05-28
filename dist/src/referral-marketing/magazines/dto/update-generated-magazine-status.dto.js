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
exports.UpdateGeneratedMagazineStatusDto = void 0;
const class_validator_1 = require("class-validator");
const generated_magazine_schema_1 = require("../schemas/generated-magazine.schema");
const common_1 = require("@nestjs/common");
class UpdateGeneratedMagazineStatusDto {
}
__decorate([
    (0, class_validator_1.IsEnum)(generated_magazine_schema_1.GenerationStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateGeneratedMagazineStatusDto.prototype, "status", void 0);
__decorate([
    (0, common_1.Optional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGeneratedMagazineStatusDto.prototype, "url", void 0);
__decorate([
    (0, common_1.Optional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGeneratedMagazineStatusDto.prototype, "flippingBookUrl", void 0);
__decorate([
    (0, common_1.Optional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGeneratedMagazineStatusDto.prototype, "coverImageHtml", void 0);
__decorate([
    (0, common_1.Optional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGeneratedMagazineStatusDto.prototype, "pageUrl", void 0);
__decorate([
    (0, common_1.Optional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGeneratedMagazineStatusDto.prototype, "bookUrl", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(generated_magazine_schema_1.GenerationStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateGeneratedMagazineStatusDto.prototype, "pageStatus", void 0);
__decorate([
    (0, common_1.Optional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGeneratedMagazineStatusDto.prototype, "coversOnlyUrl", void 0);
exports.UpdateGeneratedMagazineStatusDto = UpdateGeneratedMagazineStatusDto;
//# sourceMappingURL=update-generated-magazine-status.dto.js.map