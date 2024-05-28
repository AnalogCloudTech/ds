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
exports.CreateRmPrintTicketResponseDto = exports.CreateRmPrintTicketDto = void 0;
const class_validator_1 = require("class-validator");
class CreateRmPrintTicketDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRmPrintTicketDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRmPrintTicketDto.prototype, "coverUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRmPrintTicketDto.prototype, "magazineMonth", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRmPrintTicketDto.prototype, "additionalInformation", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRmPrintTicketDto.prototype, "rmProofLink", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRmPrintTicketDto.prototype, "rmShippedMagazineLink", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRmPrintTicketDto.prototype, "rmMemberSiteLink", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRmPrintTicketDto.prototype, "adminFullName", void 0);
exports.CreateRmPrintTicketDto = CreateRmPrintTicketDto;
class CreateRmPrintTicketResponseDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRmPrintTicketResponseDto.prototype, "ticketId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRmPrintTicketResponseDto.prototype, "contactId", void 0);
exports.CreateRmPrintTicketResponseDto = CreateRmPrintTicketResponseDto;
//# sourceMappingURL=createRmPrintTicket.dto.js.map