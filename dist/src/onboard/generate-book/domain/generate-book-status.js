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
exports.GenerateBookStatus = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const types_1 = require("./types");
class Pages {
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], Pages.prototype, "read", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], Pages.prototype, "landing", void 0);
class Links {
}
__decorate([
    (0, class_validator_1.IsUrl)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Links.prototype, "book", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Pages),
    __metadata("design:type", Pages)
], Links.prototype, "pages", void 0);
class Status {
}
__decorate([
    (0, class_validator_1.IsEnum)(types_1.Status),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Status.prototype, "book", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(types_1.Status),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Status.prototype, "pages", void 0);
class GenerateBookStatus {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GenerateBookStatus.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GenerateBookStatus.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GenerateBookStatus.prototype, "bookId", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Links),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Links)
], GenerateBookStatus.prototype, "links", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Status),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Status)
], GenerateBookStatus.prototype, "status", void 0);
exports.GenerateBookStatus = GenerateBookStatus;
//# sourceMappingURL=generate-book-status.js.map