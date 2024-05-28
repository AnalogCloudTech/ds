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
exports.VoidInvoiceDto = exports.CreateInvoiceDto = exports.Product = void 0;
const class_validator_1 = require("class-validator");
class Product {
}
exports.Product = Product;
class InvoiceInfo {
}
class CreateInvoiceDto {
}
__decorate([
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", InvoiceInfo)
], CreateInvoiceDto.prototype, "invoice", void 0);
exports.CreateInvoiceDto = CreateInvoiceDto;
class Void {
}
class VoidInvoiceDto {
}
__decorate([
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Void)
], VoidInvoiceDto.prototype, "void", void 0);
exports.VoidInvoiceDto = VoidInvoiceDto;
//# sourceMappingURL=invoice.dto.js.map