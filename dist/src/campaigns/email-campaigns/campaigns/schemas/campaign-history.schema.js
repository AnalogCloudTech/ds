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
exports.CampaignHistorySchema = exports.CampaignHistory = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const types_1 = require("../domain/types");
const mongoose_2 = require("mongoose");
let CampaignHistory = class CampaignHistory {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true, ref: 'Campaign', type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", Object)
], CampaignHistory.prototype, "campaign", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Array)
], CampaignHistory.prototype, "templateNames", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], CampaignHistory.prototype, "messageIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: types_1.CampaignHistoryType }),
    __metadata("design:type", String)
], CampaignHistory.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], CampaignHistory.prototype, "createdAt", void 0);
CampaignHistory = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'ds__emailCampaigns__campaigns_history',
    })
], CampaignHistory);
exports.CampaignHistory = CampaignHistory;
exports.CampaignHistorySchema = mongoose_1.SchemaFactory.createForClass(CampaignHistory);
//# sourceMappingURL=campaign-history.schema.js.map