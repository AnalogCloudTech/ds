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
exports.Session = void 0;
const offer_1 = require("../domain/offer");
const types_1 = require("./types");
const step_result_1 = require("./step-result");
const customer_1 = require("../../customers/customers/domain/customer");
const class_transformer_1 = require("class-transformer");
const coach_1 = require("./coach");
const webinar_1 = require("./webinar");
const generate_book_status_1 = require("../generate-book/domain/generate-book-status");
const session_schema_1 = require("../schemas/session.schema");
class Session {
    constructor() {
        this.customer = null;
        this.draftId = null;
        this.order = null;
        this.currentOffer = null;
        this.step = types_1.Step.PLACE_ORDER;
        this.previousStep = null;
        this.id = null;
        this.offer = null;
        this.hasHubspotOwnerId = false;
        this.guideOrdered = false;
    }
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => customer_1.Customer),
    __metadata("design:type", customer_1.Customer)
], Session.prototype, "customer", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Session.prototype, "draftId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Session.prototype, "order", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", offer_1.Offer)
], Session.prototype, "currentOffer", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Session.prototype, "step", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", step_result_1.StepResult)
], Session.prototype, "previousStep", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => webinar_1.Webinar),
    __metadata("design:type", webinar_1.Webinar)
], Session.prototype, "webinar", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => coach_1.Coach),
    __metadata("design:type", coach_1.Coach)
], Session.prototype, "coach", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => generate_book_status_1.GenerateBookStatus),
    __metadata("design:type", generate_book_status_1.GenerateBookStatus)
], Session.prototype, "book", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Session.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => offer_1.Offer),
    __metadata("design:type", offer_1.Offer)
], Session.prototype, "offer", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", void 0)
], Session.prototype, "autoLoginToken", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], Session.prototype, "hasHubspotOwnerId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], Session.prototype, "steps", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], Session.prototype, "guideOrdered", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], Session.prototype, "guideOrder", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], Session.prototype, "coachingSelection", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Session.prototype, "scheduleDate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Session.prototype, "sessionType", void 0);
exports.Session = Session;
//# sourceMappingURL=session.js.map