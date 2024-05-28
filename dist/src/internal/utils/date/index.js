"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthsLong = exports.diffInDaysFromToday = exports.isWeekDay = exports.isWeekend = exports.MonthsNumber = exports.Months = exports.WeekDays = void 0;
const luxon_1 = require("luxon");
var WeekDays;
(function (WeekDays) {
    WeekDays[WeekDays["MONDAY"] = 1] = "MONDAY";
    WeekDays[WeekDays["TUESDAY"] = 2] = "TUESDAY";
    WeekDays[WeekDays["WEDNESDAY"] = 3] = "WEDNESDAY";
    WeekDays[WeekDays["THURSDAY"] = 4] = "THURSDAY";
    WeekDays[WeekDays["FRIDAY"] = 5] = "FRIDAY";
    WeekDays[WeekDays["SATURDAY"] = 6] = "SATURDAY";
    WeekDays[WeekDays["SUNDAY"] = 7] = "SUNDAY";
})(WeekDays = exports.WeekDays || (exports.WeekDays = {}));
var Months;
(function (Months) {
    Months["january"] = "JAN";
    Months["february"] = "FEB";
    Months["march"] = "MAR";
    Months["april"] = "APR";
    Months["may"] = "MAY";
    Months["june"] = "JUN";
    Months["july"] = "JUL";
    Months["august"] = "AUG";
    Months["september"] = "SEP";
    Months["october"] = "OCT";
    Months["november"] = "NOV";
    Months["december"] = "DEC";
})(Months = exports.Months || (exports.Months = {}));
var MonthsNumber;
(function (MonthsNumber) {
    MonthsNumber[MonthsNumber["JAN"] = 1] = "JAN";
    MonthsNumber[MonthsNumber["FEB"] = 2] = "FEB";
    MonthsNumber[MonthsNumber["MAR"] = 3] = "MAR";
    MonthsNumber[MonthsNumber["APR"] = 4] = "APR";
    MonthsNumber[MonthsNumber["MAY"] = 5] = "MAY";
    MonthsNumber[MonthsNumber["JUN"] = 6] = "JUN";
    MonthsNumber[MonthsNumber["JUL"] = 7] = "JUL";
    MonthsNumber[MonthsNumber["AUG"] = 8] = "AUG";
    MonthsNumber[MonthsNumber["SEP"] = 9] = "SEP";
    MonthsNumber[MonthsNumber["OCT"] = 10] = "OCT";
    MonthsNumber[MonthsNumber["NOV"] = 11] = "NOV";
    MonthsNumber[MonthsNumber["DEC"] = 12] = "DEC";
})(MonthsNumber = exports.MonthsNumber || (exports.MonthsNumber = {}));
function isWeekend(date) {
    const weekendDays = [WeekDays.SATURDAY, WeekDays.SUNDAY];
    return weekendDays.includes(date.weekday);
}
exports.isWeekend = isWeekend;
function isWeekDay(date) {
    return !isWeekend(date);
}
exports.isWeekDay = isWeekDay;
function diffInDaysFromToday(date) {
    const startOfDay = { hour: 0, minute: 0, second: 0, millisecond: 0 };
    const today = luxon_1.DateTime.now().set(startOfDay);
    const dateStartOfDay = luxon_1.DateTime.fromJSDate(date).set(startOfDay);
    return today.diff(dateStartOfDay, ['days']).days;
}
exports.diffInDaysFromToday = diffInDaysFromToday;
var MonthsLong;
(function (MonthsLong) {
    MonthsLong["jan"] = "january";
    MonthsLong["feb"] = "february";
    MonthsLong["mar"] = "march";
    MonthsLong["apr"] = "april";
    MonthsLong["may"] = "may";
    MonthsLong["jun"] = "june";
    MonthsLong["jul"] = "july";
    MonthsLong["aug"] = "august";
    MonthsLong["sep"] = "september";
    MonthsLong["oct"] = "october";
    MonthsLong["nov"] = "november";
    MonthsLong["dec"] = "december";
})(MonthsLong = exports.MonthsLong || (exports.MonthsLong = {}));
//# sourceMappingURL=index.js.map