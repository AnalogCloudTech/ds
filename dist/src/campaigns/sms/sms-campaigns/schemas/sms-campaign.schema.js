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
exports.SmsCampaignSchema = exports.SmsCampaign = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const types_1 = require("../domain/types");
const mongoose_2 = require("mongoose");
const class_transformer_1 = require("class-transformer");
let SmsCampaign = class SmsCampaign {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SmsCampaign.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, maxlength: 160 }),
    __metadata("design:type", String)
], SmsCampaign.prototype, "text", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], SmsCampaign.prototype, "templateId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], SmsCampaign.prototype, "segments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], SmsCampaign.prototype, "allSegments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: types_1.Statuses, default: types_1.Statuses.STATUS_SCHEDULED }),
    __metadata("design:type", String)
], SmsCampaign.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], SmsCampaign.prototype, "scheduleDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], SmsCampaign.prototype, "messageIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, ref: 'Customer', type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", Object)
], SmsCampaign.prototype, "customer", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], SmsCampaign.prototype, "createdAt", void 0);
SmsCampaign = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'ds__sms_campaigns',
        timestamps: true,
    })
], SmsCampaign);
exports.SmsCampaign = SmsCampaign;
exports.SmsCampaignSchema = mongoose_1.SchemaFactory.createForClass(SmsCampaign);
//# sourceMappingURL=sms-campaign.schema.js.map