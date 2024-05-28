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
exports.GeneratedMagazineSchema = exports.GeneratedMagazine = exports.GenerationStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const customer_schema_1 = require("../../../customers/customers/schemas/customer.schema");
const magazine_schema_1 = require("./magazine.schema");
var GenerationStatus;
(function (GenerationStatus) {
    GenerationStatus["DONE"] = "DONE";
    GenerationStatus["PENDING"] = "PENDING";
    GenerationStatus["PROCESSING"] = "PROCESSING";
    GenerationStatus["ERROR"] = "ERROR";
    GenerationStatus["SENT_FOR_PRINTING"] = "SENT_FOR_PRINTING";
})(GenerationStatus = exports.GenerationStatus || (exports.GenerationStatus = {}));
let GeneratedMagazine = class GeneratedMagazine {
};
__decorate([
    (0, mongoose_1.Prop)({ ref: customer_schema_1.Customer.name, type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", Object)
], GeneratedMagazine.prototype, "customer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ ref: magazine_schema_1.Magazine.name, type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", Object)
], GeneratedMagazine.prototype, "magazine", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], GeneratedMagazine.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: GenerationStatus,
        default: GenerationStatus.PENDING,
    }),
    __metadata("design:type", String)
], GeneratedMagazine.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: true }),
    __metadata("design:type", Boolean)
], GeneratedMagazine.prototype, "active", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], GeneratedMagazine.prototype, "additionalInformation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], GeneratedMagazine.prototype, "isPreview", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], GeneratedMagazine.prototype, "flippingBookUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], GeneratedMagazine.prototype, "coverImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], GeneratedMagazine.prototype, "pageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], GeneratedMagazine.prototype, "bookUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: GenerationStatus,
        default: GenerationStatus.PENDING,
    }),
    __metadata("design:type", String)
], GeneratedMagazine.prototype, "pageStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], GeneratedMagazine.prototype, "coversOnlyUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: false }),
    __metadata("design:type", Boolean)
], GeneratedMagazine.prototype, "createdByAutomation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: [] }),
    __metadata("design:type", Array)
], GeneratedMagazine.prototype, "leadCovers", void 0);
GeneratedMagazine = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'ds__referralMarketing__generatedMagazine',
    })
], GeneratedMagazine);
exports.GeneratedMagazine = GeneratedMagazine;
exports.GeneratedMagazineSchema = mongoose_1.SchemaFactory.createForClass(GeneratedMagazine);
//# sourceMappingURL=generated-magazine.schema.js.map