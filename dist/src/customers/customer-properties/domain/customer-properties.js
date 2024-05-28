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
exports.CustomerProperties = void 0;
const class_transformer_1 = require("class-transformer");
const serialize_interceptor_1 = require("../../../internal/common/interceptors/serialize.interceptor");
const customer_1 = require("../../customers/domain/customer");
class CustomerProperties {
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, serialize_interceptor_1.ExposeId)(),
    __metadata("design:type", String)
], CustomerProperties.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => customer_1.Customer),
    __metadata("design:type", customer_1.Customer)
], CustomerProperties.prototype, "customer", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CustomerProperties.prototype, "module", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CustomerProperties.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CustomerProperties.prototype, "value", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], CustomerProperties.prototype, "versions", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], CustomerProperties.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], CustomerProperties.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], CustomerProperties.prototype, "deletedAt", void 0);
exports.CustomerProperties = CustomerProperties;
//# sourceMappingURL=customer-properties.js.map