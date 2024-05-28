"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = exports.ReminderDelays = exports.Status = void 0;
var Status;
(function (Status) {
    Status["SCHEDULED"] = "scheduled";
    Status["SENT"] = "sent";
    Status["RESCHEDULED"] = "rescheduled";
    Status["CANCELED"] = "canceled";
    Status["ERROR"] = "error";
})(Status = exports.Status || (exports.Status = {}));
var ReminderDelays;
(function (ReminderDelays) {
    ReminderDelays[ReminderDelays["CONFIRMATION"] = -1] = "CONFIRMATION";
    ReminderDelays[ReminderDelays["IMMEDIATE"] = 0] = "IMMEDIATE";
    ReminderDelays[ReminderDelays["FIFTEEN_MINUTES"] = 15] = "FIFTEEN_MINUTES";
    ReminderDelays[ReminderDelays["ONE_HOUR"] = 60] = "ONE_HOUR";
    ReminderDelays[ReminderDelays["FOUR_HOURS"] = 240] = "FOUR_HOURS";
})(ReminderDelays = exports.ReminderDelays || (exports.ReminderDelays = {}));
class Email {
}
exports.Email = Email;
//# sourceMappingURL=types.js.map