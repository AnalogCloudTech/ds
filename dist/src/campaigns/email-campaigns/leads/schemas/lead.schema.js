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
exports.LeadSchema = exports.Lead = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const types_1 = require("../domain/types");
const address_1 = require("../dto/address");
let Lead = class Lead {
};
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    __metadata("design:type", String)
], Lead.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    __metadata("design:type", String)
], Lead.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    __metadata("design:type", String)
], Lead.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lead.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: (Array) }),
    __metadata("design:type", Array)
], Lead.prototype, "segments", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: false,
    }),
    __metadata("design:type", Boolean)
], Lead.prototype, "allSegments", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lead.prototype, "bookId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    __metadata("design:type", String)
], Lead.prototype, "customerEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, ref: 'Customer', type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", Object)
], Lead.prototype, "customer", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lead.prototype, "formId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lead.prototype, "pageName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lead.prototype, "pageTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lead.prototype, "domain", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Lead.prototype, "unsubscribed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Lead.prototype, "isValid", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", address_1.Address)
], Lead.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: types_1.LastUsage }),
    __metadata("design:type", types_1.LastUsage)
], Lead.prototype, "lastUsage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ nullable: true, default: null }),
    __metadata("design:type", Date)
], Lead.prototype, "deletedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Lead.prototype, "createdAt", void 0);
Lead = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'ds__emailCampaigns__leads' })
], Lead);
exports.Lead = Lead;
const LeadSchema = mongoose_1.SchemaFactory.createForClass(Lead);
exports.LeadSchema = LeadSchema;
LeadSchema.pre('find', function () {
    var _a;
    this.where({
        deletedAt: (_a = this.getQuery()['deletedAt']) !== null && _a !== void 0 ? _a : null,
    });
});
//# sourceMappingURL=lead.schema.js.map