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
exports.OnDemandEmailSchema = exports.OnDemandEmail = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const class_transformer_1 = require("class-transformer");
const mongoose_2 = require("mongoose");
const types_1 = require("../domain/types");
let OnDemandEmail = class OnDemandEmail {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], OnDemandEmail.prototype, "subject", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], OnDemandEmail.prototype, "templateId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], OnDemandEmail.prototype, "templateName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], OnDemandEmail.prototype, "segments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], OnDemandEmail.prototype, "allSegments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: types_1.Statuses.STATUS_SCHEDULED }),
    __metadata("design:type", String)
], OnDemandEmail.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, ref: 'Customer', type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", Object)
], OnDemandEmail.prototype, "customer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], OnDemandEmail.prototype, "sendImmediately", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], OnDemandEmail.prototype, "scheduleDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], OnDemandEmail.prototype, "completionDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], OnDemandEmail.prototype, "timezone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], OnDemandEmail.prototype, "messageIds", void 0);
OnDemandEmail = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'ds__emailCampaigns__on_demand_emails',
    })
], OnDemandEmail);
exports.OnDemandEmail = OnDemandEmail;
exports.OnDemandEmailSchema = mongoose_1.SchemaFactory.createForClass(OnDemandEmail);
//# sourceMappingURL=on-demand-email.schema.js.map