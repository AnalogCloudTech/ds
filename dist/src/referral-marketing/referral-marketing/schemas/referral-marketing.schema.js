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
exports.ReferralSchema = exports.ReferralMarketing = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const utils_1 = require("../../../internal/common/utils");
const types_1 = require("../domain/types");
let ReferralMarketing = class ReferralMarketing extends utils_1.CastableTo {
};
__decorate([
    (0, mongoose_1.Prop)({ unique: true }),
    __metadata("design:type", String)
], ReferralMarketing.prototype, "referralCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: types_1.ChangeStatus,
    }),
    __metadata("design:type", String)
], ReferralMarketing.prototype, "changeStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: types_1.Leads,
    }),
    __metadata("design:type", String)
], ReferralMarketing.prototype, "marketingType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ReferralMarketing.prototype, "magazineTemplate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Array)
], ReferralMarketing.prototype, "internalNotes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], ReferralMarketing.prototype, "memberDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], ReferralMarketing.prototype, "frontCover", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], ReferralMarketing.prototype, "insideCover", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], ReferralMarketing.prototype, "backInsideCoverTemplate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ReferralMarketing.prototype, "backCoverTemplate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ReferralMarketing.prototype, "additionalInstructions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], ReferralMarketing.prototype, "additionalCustomization", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], ReferralMarketing.prototype, "listingDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, require: true }),
    __metadata("design:type", Object)
], ReferralMarketing.prototype, "referralPartner", void 0);
ReferralMarketing = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'ds__referral_marketing' })
], ReferralMarketing);
exports.ReferralMarketing = ReferralMarketing;
exports.ReferralSchema = mongoose_1.SchemaFactory.createForClass(ReferralMarketing);
//# sourceMappingURL=referral-marketing.schema.js.map