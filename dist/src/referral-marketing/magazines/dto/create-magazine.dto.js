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
exports.CreateMagazineDto = void 0;
const exists_in_cms_1 = require("../../../cms/cms/validation-rules/exists-in-cms");
const class_validator_1 = require("class-validator");
class CreateMagazineDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, exists_in_cms_1.ExistsInCms)(['magazineDetails']),
    __metadata("design:type", Number)
], CreateMagazineDto.prototype, "magazineId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateMagazineDto.prototype, "baseReplacers", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateMagazineDto.prototype, "createdByAutomation", void 0);
exports.CreateMagazineDto = CreateMagazineDto;
//# sourceMappingURL=create-magazine.dto.js.map