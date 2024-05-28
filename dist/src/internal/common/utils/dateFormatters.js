"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixDateInDaylightSaving = exports.isInDaylightSaving = exports.compareChargifyDates = exports.getDifferenceInDays = exports.convertToHSDate = exports.dateStringToHSDate = exports.epochToHSDate = exports.isoToEpoch = exports.nowEpoch = exports.timeElapsed = exports.timeStampToHumanReadable = exports.toISO = exports.toTimeZone = exports.TimeZones = void 0;
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
function epochToHSDate(epoch) {
    const date = new Date(0);
    date.setUTCSeconds(epoch);
    return luxon_1.DateTime.fromJSDate(date).toFormat('yyyy-LL-dd');
}
exports.epochToHSDate = epochToHSDate;
function dateStringToHSDate(dateString) {
    const date = new Date(dateString);
    return luxon_1.DateTime.fromJSDate(date).toFormat('yyyy-LL-dd');
}
exports.dateStringToHSDate = dateStringToHSDate;
function convertToHSDate(dateString) {
    const newDateFormat = dateString.substring(0, 10);
    return luxon_1.DateTime.fromISO(newDateFormat).toFormat('yyyy-LL-dd');
}
exports.convertToHSDate = convertToHSDate;
function getDifferenceInDays(endDate) {
    const today = luxon_1.DateTime.now();
    const endDateObj = luxon_1.DateTime.fromISO(endDate);
    const diff = endDateObj.diff(today, 'days').toObject();
    return Math.abs(diff.days);
}
exports.getDifferenceInDays = getDifferenceInDays;
function compareChargifyDates(firstDate, secondDate) {
    if (!firstDate || !secondDate)
        return false;
    const date1 = luxon_1.DateTime.fromISO(firstDate.substring(0, 10));
    const date2 = luxon_1.DateTime.fromISO(secondDate.substring(0, 10));
    return date1.valueOf() === date2.valueOf();
}
exports.compareChargifyDates = compareChargifyDates;
function isInDaylightSaving(year, startDate, endDate) {
    const startDST = luxon_1.DateTime.fromISO(`${year}-03-12T02:00:00-0500`);
    const endDST = luxon_1.DateTime.fromISO(`${year}-11-05T02:00:00-0500`);
    return startDate < endDST && startDST < endDate;
}
exports.isInDaylightSaving = isInDaylightSaving;
function fixDateInDaylightSaving(startDate, endDate) {
    const startToday = luxon_1.DateTime.now().startOf('day');
    const endToday = startToday.endOf('day');
    if (startToday < endDate &&
        !isInDaylightSaving(startToday.year, startToday, endToday) &&
        isInDaylightSaving(startDate.year, startDate, endDate)) {
        startDate = startDate.minus({ hour: 1 });
        endDate = endDate.minus({ hour: 1 });
    }
    return {
        startDate,
        endDate,
    };
}
exports.fixDateInDaylightSaving = fixDateInDaylightSaving;
//# sourceMappingURL=dateFormatters.js.map