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
exports.CampaignSchema = exports.Campaign = void 0;
const utils_1 = require("../../../../internal/common/utils");
const mongoose_1 = require("@nestjs/mongoose");
const types_1 = require("../domain/types");
const mongoose_2 = require("mongoose");
let Campaign = class Campaign extends utils_1.CastableTo {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Campaign.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Campaign.prototype, "segments", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], Campaign.prototype, "allowWeekend", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Campaign.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: types_1.CampaignStatus.DRAFT }),
    __metadata("design:type", String)
], Campaign.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], Campaign.prototype, "allSegments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Campaign.prototype, "contentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, ref: 'Customer', type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", Object)
], Campaign.prototype, "customer", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Campaign.prototype, "messageIds", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Campaign.prototype, "templateIds", void 0);
Campaign = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'ds__emailCampaigns__campaigns' })
], Campaign);
exports.Campaign = Campaign;
exports.CampaignSchema = mongoose_1.SchemaFactory.createForClass(Campaign);
//# sourceMappingURL=campaign.schema.js.map