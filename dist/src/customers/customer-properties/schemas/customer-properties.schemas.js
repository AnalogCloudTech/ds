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
exports.CustomerPropertiesSchema = exports.CustomerProperties = void 0;
const customer_schema_1 = require("../../customers/schemas/customer.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let CustomerProperties = class CustomerProperties {
};
__decorate([
    (0, mongoose_1.Prop)({ ref: customer_schema_1.Customer.name, type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", Object)
], CustomerProperties.prototype, "customer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CustomerProperties.prototype, "module", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CustomerProperties.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Date)
], CustomerProperties.prototype, "deletedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: '' }),
    __metadata("design:type", String)
], CustomerProperties.prototype, "value", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: (Array) }),
    __metadata("design:type", Array)
], CustomerProperties.prototype, "versions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], CustomerProperties.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], CustomerProperties.prototype, "updatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        ref: customer_schema_1.Customer.name,
        type: mongoose_2.SchemaTypes.String,
        default: null,
    }),
    __metadata("design:type", Object)
], CustomerProperties.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, ref: customer_schema_1.Customer.name, type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", Object)
], CustomerProperties.prototype, "updatedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CustomerProperties.prototype, "customerEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], CustomerProperties.prototype, "metadata", void 0);
CustomerProperties = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'ds__customer_properties',
    })
], CustomerProperties);
exports.CustomerProperties = CustomerProperties;
exports.CustomerPropertiesSchema = mongoose_1.SchemaFactory.createForClass(CustomerProperties);
//# sourceMappingURL=customer-properties.schemas.js.map