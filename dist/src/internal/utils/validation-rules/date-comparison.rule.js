"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateComparison = exports.DateComparisonRule = void 0;
const class_validator_1 = require("class-validator");
const luxon_1 = require("luxon");
let DateComparisonRule = class DateComparisonRule {
    validate(value, validationArguments) {
        const { object, constraints } = validationArguments;
        const [fieldToCompare, maxDateDiff] = constraints;
        const targetDate = object[fieldToCompare];
        const diff = luxon_1.Interval.fromDateTimes(luxon_1.DateTime.fromJSDate(value), luxon_1.DateTime.fromJSDate(targetDate));
        if (!diff.isValid) {
            return false;
        }
        const diffInDays = diff.length('day');
        return diffInDays <= maxDateDiff;
    }
    defaultMessage(validationArguments) {
        const { property, constraints } = validationArguments;
        const [fieldToCompare, maxDateDiff] = constraints;
        return `The difference between ${property} and ${fieldToCompare} must be a maximum of ${maxDateDiff} days`;
    }
};
DateComparisonRule = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'DateComparison' })
], DateComparisonRule);
exports.DateComparisonRule = DateComparisonRule;
function DateComparison(compareWith, maxDateDiff = 90) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'DateComparison',
            target: object.constructor,
            propertyName,
            constraints: [compareWith, maxDateDiff],
            validator: DateComparisonRule,
        });
    };
}
exports.DateComparison = DateComparison;
//# sourceMappingURL=date-comparison.rule.js.map