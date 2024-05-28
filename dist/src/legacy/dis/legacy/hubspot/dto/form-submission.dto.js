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
exports.FormSubmissionDto = exports.FormContext = exports.FormFields = void 0;
const class_validator_1 = require("class-validator");
class FormFields {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FormFields.prototype, "objectTypeId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FormFields.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], FormFields.prototype, "value", void 0);
exports.FormFields = FormFields;
class FormContext {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FormContext.prototype, "pageUri", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FormContext.prototype, "pageName", void 0);
exports.FormContext = FormContext;
class FormSubmissionDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FormSubmissionDto.prototype, "portalId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Number)
], FormSubmissionDto.prototype, "formId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], FormSubmissionDto.prototype, "fields", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", FormContext)
], FormSubmissionDto.prototype, "context", void 0);
exports.FormSubmissionDto = FormSubmissionDto;
//# sourceMappingURL=form-submission.dto.js.map