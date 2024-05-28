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
exports.EmailReminderSchema = exports.EmailReminder = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const class_transformer_1 = require("class-transformer");
const types_1 = require("../domain/types");
const luxon_1 = require("luxon");
let EmailReminder = class EmailReminder {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true, ref: 'Customer', type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", Object)
], EmailReminder.prototype, "customer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, ref: 'Coach', type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", Object)
], EmailReminder.prototype, "coach", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, ref: 'Session', type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", Object)
], EmailReminder.prototype, "session", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EmailReminder.prototype, "subject", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EmailReminder.prototype, "meetingLink", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], EmailReminder.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], EmailReminder.prototype, "meetingDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EmailReminder.prototype, "timezone", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: types_1.Status,
        default: types_1.Status.SCHEDULED,
        type: String,
    }),
    __metadata("design:type", String)
], EmailReminder.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], EmailReminder.prototype, "messageId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: [], type: (Array) }),
    __metadata("design:type", Array)
], EmailReminder.prototype, "snsResponses", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null, type: String }),
    __metadata("design:type", String)
], EmailReminder.prototype, "smsId", void 0);
EmailReminder = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'ds__onboard__email_reminders',
        toJSON: { virtuals: true },
    })
], EmailReminder);
exports.EmailReminder = EmailReminder;
const EmailReminderSchema = mongoose_1.SchemaFactory.createForClass(EmailReminder);
exports.EmailReminderSchema = EmailReminderSchema;
EmailReminderSchema.virtual('meetingDateFormatted').get(function () {
    const dateString = luxon_1.DateTime.fromJSDate(this.meetingDate)
        .setZone(this.timezone)
        .toLocaleString(luxon_1.DateTime.DATETIME_SHORT, {
        locale: 'en-US',
    });
    return `${dateString} (${this.timezone})`;
});
//# sourceMappingURL=email-reminder.schema.js.map