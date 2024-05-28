"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateScheduleDateTransformPipe = void 0;
const common_1 = require("@nestjs/common");
const luxon_1 = require("luxon");
class ValidateScheduleDateTransformPipe {
    validateScheduleDate(dto) {
        if (!dto.scheduleDate) {
            throw new common_1.BadRequestException([
                'Schedule date is required when Send Immediately is false',
            ]);
        }
        const scheduleDate = luxon_1.DateTime.fromISO(dto.scheduleDate).setZone(dto.timezone);
        if (!scheduleDate.isValid) {
            throw new common_1.BadRequestException(scheduleDate.invalidExplanation);
        }
        if (luxon_1.DateTime.now() > scheduleDate) {
            throw new common_1.BadRequestException(['Schedule date must be greater than now']);
        }
    }
    transformScheduleDate(dto) {
        const scheduleDate = luxon_1.DateTime.now().setZone(dto.timezone).startOf('second');
        if (!scheduleDate.isValid) {
            throw new common_1.BadRequestException(scheduleDate.invalidExplanation);
        }
        dto.scheduleDate = scheduleDate.toISO({
            includeOffset: false,
            suppressMilliseconds: true,
        });
        return dto;
    }
    transform(dto) {
        if (!dto.sendImmediately) {
            this.validateScheduleDate(dto);
        }
        if (dto.sendImmediately) {
            dto = this.transformScheduleDate(dto);
        }
        return dto;
    }
}
exports.ValidateScheduleDateTransformPipe = ValidateScheduleDateTransformPipe;
//# sourceMappingURL=validate-schedule-date.pipe.js.map