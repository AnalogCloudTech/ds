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
exports.CampaignsSchema = exports.Campaigns = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const utils_1 = require("../../../../internal/common/utils");
const type_1 = require("../domain/type");
let Campaigns = class Campaigns extends utils_1.CastableTo {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Campaigns.prototype, "campaignName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Campaigns.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: type_1.CampaignStatus }),
    __metadata("design:type", String)
], Campaigns.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Campaigns.prototype, "contenId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, ref: 'Customer', type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", Object)
], Campaigns.prototype, "customerId", void 0);
Campaigns = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'ds__sm_campaigns' })
], Campaigns);
exports.Campaigns = Campaigns;
exports.CampaignsSchema = mongoose_1.SchemaFactory.createForClass(Campaigns);
//# sourceMappingURL=campaigns.schema.js.map