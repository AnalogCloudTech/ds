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
exports.SmsReplyPayloadDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class SmsReplyPayloadDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SmsReplyPayloadDto.prototype, "ToCountry", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SmsReplyPayloadDto.prototype, "SmsMessageSid", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SmsReplyPayloadDto.prototype, "NumMedia", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SmsReplyPayloadDto.prototype, "ToCity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SmsReplyPayloadDto.prototype, "FromZip", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SmsReplyPayloadDto.prototype, "SmsSid", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SmsReplyPayloadDto.prototype, "FromState", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SmsReplyPayloadDto.prototype, "SmsStatus", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SmsReplyPayloadDto.prototype, "FromCity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SmsReplyPayloadDto.prototype, "Body", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SmsReplyPayloadDto.prototype, "FromCountry", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SmsReplyPayloadDto.prototype, "To", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SmsReplyPayloadDto.prototype, "MessagingServiceSid", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SmsReplyPayloadDto.prototype, "ToZip", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SmsReplyPayloadDto.prototype, "NumSegments", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SmsReplyPayloadDto.prototype, "MessageSid", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SmsReplyPayloadDto.prototype, "AccountSid", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SmsReplyPayloadDto.prototype, "From", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], SmsReplyPayloadDto.prototype, "ApiVersion", void 0);
exports.SmsReplyPayloadDto = SmsReplyPayloadDto;
//# sourceMappingURL=sms-reply-payload.dto.js.map