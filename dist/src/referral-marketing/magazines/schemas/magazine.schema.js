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
exports.MagazineSchema = exports.Magazine = exports.MagazineStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const customer_schema_1 = require("../../../customers/customers/schemas/customer.schema");
const date_1 = require("../../../internal/utils/date");
var MagazineStatus;
(function (MagazineStatus) {
    MagazineStatus["EDITING"] = "EDITING";
    MagazineStatus["MAGAZINE_GENERATED"] = "MAGAZINE_GENERATED";
    MagazineStatus["SENT_FOR_PRINTING"] = "SENT_FOR_PRINTING";
})(MagazineStatus = exports.MagazineStatus || (exports.MagazineStatus = {}));
let Magazine = class Magazine {
};
__decorate([
    (0, mongoose_1.Prop)({ ref: customer_schema_1.Customer.name, type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", Object)
], Magazine.prototype, "customer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: date_1.Months }),
    __metadata("design:type", String)
], Magazine.prototype, "month", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Magazine.prototype, "year", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Magazine.prototype, "selections", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.Mixed }),
    __metadata("design:type", Object)
], Magazine.prototype, "magazineContent", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Magazine.prototype, "covers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Magazine.prototype, "magazineId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: [] }),
    __metadata("design:type", Array)
], Magazine.prototype, "baseReplacers", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: MagazineStatus,
        default: MagazineStatus.EDITING,
    }),
    __metadata("design:type", String)
], Magazine.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Magazine.prototype, "contentUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: false }),
    __metadata("design:type", Boolean)
], Magazine.prototype, "createdByAutomation", void 0);
Magazine = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'ds__referralMarketing__magazine',
    })
], Magazine);
exports.Magazine = Magazine;
exports.MagazineSchema = mongoose_1.SchemaFactory.createForClass(Magazine);
//# sourceMappingURL=magazine.schema.js.map