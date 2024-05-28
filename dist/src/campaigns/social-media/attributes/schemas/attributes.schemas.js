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
exports.AttributeSchema = exports.Attribute = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const type_1 = require("../domain/type");
let Attribute = class Attribute {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: type_1.MediaType }),
    __metadata("design:type", String)
], Attribute.prototype, "mediaType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Attribute.prototype, "pageAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Attribute.prototype, "securityKey", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Attribute.prototype, "secretKey", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, ref: 'Customer', type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", Object)
], Attribute.prototype, "customerId", void 0);
Attribute = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'ds__sm_attributes' })
], Attribute);
exports.Attribute = Attribute;
exports.AttributeSchema = mongoose_1.SchemaFactory.createForClass(Attribute);
//# sourceMappingURL=attributes.schemas.js.map