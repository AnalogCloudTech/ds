"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTwoDigits = exports.millisecondsToHuman = void 0;
const luxon_1 = require("luxon");
const millisecondsToHuman = (ms = 0) => {
    const dur = luxon_1.Duration.fromObject({ milliseconds: ms });
    return dur.shiftTo('hours', 'minutes', 'seconds', 'milliseconds').toObject();
};
exports.millisecondsToHuman = millisecondsToHuman;
const toTwoDigits = (num = 0) => {
    if (num < 10) {
        return ('0' + num).slice(-2);
    }
    return num;
};
exports.toTwoDigits = toTwoDigits;
//# sourceMappingURL=timeFormatters.js.map