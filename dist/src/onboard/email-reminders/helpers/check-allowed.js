"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAllowedSms = void 0;
const luxon_1 = require("luxon");
function checkAllowedSms(reminder) {
    const now = reminder.date;
    const currentHour = luxon_1.DateTime.fromJSDate(now).setZone('America/New_York').hour;
    return currentHour >= 9 && currentHour < 18;
}
exports.checkAllowedSms = checkAllowedSms;
//# sourceMappingURL=check-allowed.js.map