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
exports.EmailHistorySchema = exports.EmailHistory = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const types_1 = require("./types");
const lead_schema_1 = require("../../leads/schemas/lead.schema");
const utils_1 = require("../../../../internal/common/utils");
let EmailHistory = class EmailHistory extends utils_1.CastableTo {
};
__decorate([
    (0, mongoose_1.Prop)({ ref: lead_schema_1.Lead.name, type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", Object)
], EmailHistory.prototype, "lead", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: types_1.LeadHistoryStatus,
        default: types_1.LeadHistoryStatus.SEND,
    }),
    __metadata("design:type", String)
], EmailHistory.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ refPath: 'relationType', required: true, type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", Object)
], EmailHistory.prototype, "relationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: types_1.RelationTypes }),
    __metadata("design:type", String)
], EmailHistory.prototype, "relationType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Array)
], EmailHistory.prototype, "extraInfos", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null, type: Object }),
    __metadata("design:type", Object)
], EmailHistory.prototype, "rawData", void 0);
EmailHistory = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'ds__emailCampaigns__email_history',
    })
], EmailHistory);
exports.EmailHistory = EmailHistory;
exports.EmailHistorySchema = mongoose_1.SchemaFactory.createForClass(EmailHistory);
//# sourceMappingURL=email-history.schema.js.map