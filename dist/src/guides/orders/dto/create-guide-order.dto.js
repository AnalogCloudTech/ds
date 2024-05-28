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
exports.UpdateGuideDto = exports.CreateGuideOrderDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const guide_orders_1 = require("../domain/guide-orders");
const mapped_types_1 = require("@nestjs/mapped-types");
class CreateGuideOrderDto {
}
__decorate([
    (0, class_transformer_1.Type)(() => guide_orders_1.FrontCover),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], CreateGuideOrderDto.prototype, "frontCover", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateGuideOrderDto.prototype, "practiceName", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => guide_orders_1.Address),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", guide_orders_1.Address)
], CreateGuideOrderDto.prototype, "practiceAddress", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateGuideOrderDto.prototype, "practicePhone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateGuideOrderDto.prototype, "practiceLogo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGuideOrderDto.prototype, "practiceWebsite", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGuideOrderDto.prototype, "practiceEmail", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGuideOrderDto.prototype, "guideId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGuideOrderDto.prototype, "guideName", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateGuideOrderDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateGuideOrderDto.prototype, "thumbnail", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGuideOrderDto.prototype, "landingPage", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGuideOrderDto.prototype, "readPage", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => guide_orders_1.Address),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", guide_orders_1.Address)
], CreateGuideOrderDto.prototype, "shippingAddress", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGuideOrderDto.prototype, "sessionId", void 0);
exports.CreateGuideOrderDto = CreateGuideOrderDto;
class UpdateGuideDto extends (0, mapped_types_1.PartialType)(CreateGuideOrderDto) {
}
__decorate([
    (0, class_validator_1.IsEnum)(guide_orders_1.OrderStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateGuideDto.prototype, "status", void 0);
exports.UpdateGuideDto = UpdateGuideDto;
//# sourceMappingURL=create-guide-order.dto.js.map