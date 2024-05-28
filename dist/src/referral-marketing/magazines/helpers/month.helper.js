"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumToMonth = exports.monthToEnum = void 0;
const date_1 = require("../../../internal/utils/date");
const monthToEnum = (month) => {
    return date_1.Months[month.toLowerCase()];
};
exports.monthToEnum = monthToEnum;
const enumToMonth = (month) => {
    const monthFind = Object.entries(date_1.Months).find(([_, value]) => value === month);
    return monthFind ? monthFind[0] : null;
};
exports.enumToMonth = enumToMonth;
//# sourceMappingURL=month.helper.js.map