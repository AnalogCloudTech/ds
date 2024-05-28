"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isoToEpoch = exports.nowEpoch = exports.timeElapsed = exports.timeStampToHumanReadable = exports.toISO = exports.toTimeZone = exports.TimeZones = void 0;
const common_1 = require("@nestjs/common");
const luxon_1 = require("luxon");
var TimeZones;
(function (TimeZones) {
    TimeZones["UTC"] = "UTC";
    TimeZones["EST"] = "EST";
})(TimeZones = exports.TimeZones || (exports.TimeZones = {}));
const toTimeZone = (dateTime, zone) => {
    return dateTime.setZone(zone || 'UTC');
};
exports.toTimeZone = toTimeZone;
const toISO = (seconds) => {
    if (!seconds) {
        return null;
    }
    const date = luxon_1.DateTime.fromSeconds(seconds);
    return date.toISO();
};
exports.toISO = toISO;
const timeStampToHumanReadable = (date, toZone = TimeZones.UTC, fromZone = TimeZones.UTC) => {
    const dateTime = luxon_1.DateTime.fromISO(date, { zone: fromZone });
    const toTimeZoneObject = (0, exports.toTimeZone)(dateTime, toZone);
    return toTimeZoneObject
        .setLocale('en-us')
        .toLocaleString(luxon_1.DateTime.DATETIME_FULL);
};
exports.timeStampToHumanReadable = timeStampToHumanReadable;
const timeElapsed = (epoch, type = 'seconds') => {
    const unit = type;
    const now = luxon_1.DateTime.now();
    const date = luxon_1.DateTime.fromSeconds(epoch);
    const diff = now.diff(date, unit).toObject();
    return diff[type];
};
exports.timeElapsed = timeElapsed;
const nowEpoch = () => {
    return Math.floor(Date.now() / 1000);
};
exports.nowEpoch = nowEpoch;
const isoToEpoch = (iso) => {
    const date = luxon_1.DateTime.fromISO(iso);
    if (!date.isValid) {
        throw new common_1.HttpException({
            message: (date === null || date === void 0 ? void 0 : date.invalidExplanation) || 'Failed to parse the provided date',
        }, common_1.HttpStatus.BAD_REQUEST);
    }
    return date.toSeconds();
};
exports.isoToEpoch = isoToEpoch;
//# sourceMappingURL=dateFormatters.js.map