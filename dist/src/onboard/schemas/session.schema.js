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
exports.SessionSchema = exports.Session = exports.SessionType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const types_1 = require("../domain/types");
const utils_1 = require("../../internal/common/utils");
const generate_book_status_1 = require("../generate-book/domain/generate-book-status");
var SessionType;
(function (SessionType) {
    SessionType["UPSELL"] = "UPSELL";
    SessionType["DENTIST"] = "DENTIST";
    SessionType["TW"] = "TW";
    SessionType["OTHER"] = "OTHER";
    SessionType["CONTRACTED"] = "CONTRACTED";
})(SessionType = exports.SessionType || (exports.SessionType = {}));
let Session = class Session extends utils_1.CastableTo {
};
__decorate([
    (0, mongoose_1.Prop)({ ref: 'Offer', type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", Object)
], Session.prototype, "offer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ ref: 'Customer', type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", Object)
], Session.prototype, "customer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ ref: 'Coach', type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", Object)
], Session.prototype, "coach", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: [] }),
    __metadata("design:type", Array)
], Session.prototype, "declinedCoaches", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Session.prototype, "stepResults", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Session.prototype, "paymentIntents", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Session.prototype, "offerAcceptance", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Session.prototype, "webinarSelection", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Session.prototype, "coachingSelection", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Session.prototype, "payments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", generate_book_status_1.GenerateBookStatus)
], Session.prototype, "book", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Session.prototype, "currentStep", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Session.prototype, "draftId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Session.prototype, "metrics", void 0);
__decorate([
    (0, mongoose_1.Prop)({ ref: 'BookOption', type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", Object)
], Session.prototype, "bookOption", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Session.prototype, "marketingParameters", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Session.prototype, "salesParameters", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: types_1.DefaultSteps }),
    __metadata("design:type", Array)
], Session.prototype, "steps", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: null }),
    __metadata("design:type", Array)
], Session.prototype, "deals", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Session.prototype, "dealDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Session.prototype, "customerStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Session.prototype, "guideOrdered", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Session.prototype, "guideOrder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: SessionType, default: SessionType.OTHER }),
    __metadata("design:type", String)
], Session.prototype, "sessionType", void 0);
Session = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'ds__onboard__sessions' })
], Session);
exports.Session = Session;
exports.SessionSchema = mongoose_1.SchemaFactory.createForClass(Session).index({
    _id: 1,
    offer: 1,
});
//# sourceMappingURL=session.schema.js.map