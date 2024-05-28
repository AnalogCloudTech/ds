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
exports.DaySlots = exports.GetBusySlotsDTO = exports.CalendarDtoWithCoach = exports.CalendarDto = exports.BusySlot = void 0;
const class_validator_1 = require("class-validator");
class BusySlot {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BusySlot.prototype, "meetingStart", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BusySlot.prototype, "meetingEnd", void 0);
exports.BusySlot = BusySlot;
class CalendarDto {
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CalendarDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", String)
], CalendarDto.prototype, "calendarDateStart", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", String)
], CalendarDto.prototype, "calendarDateEnd", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CalendarDto.prototype, "BusySlots", void 0);
exports.CalendarDto = CalendarDto;
class CalendarDtoWithCoach extends CalendarDto {
}
exports.CalendarDtoWithCoach = CalendarDtoWithCoach;
class GetBusySlotsDTO {
    constructor() {
        this.outputTimezone = 'UTC';
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], GetBusySlotsDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GetBusySlotsDTO.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], GetBusySlotsDTO.prototype, "outputTimezone", void 0);
exports.GetBusySlotsDTO = GetBusySlotsDTO;
class DaySlots {
    constructor() {
        this.slots = [];
    }
}
exports.DaySlots = DaySlots;
//# sourceMappingURL=calendar.dto.js.map