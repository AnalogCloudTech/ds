"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EqualTo = exports.EqualToRule = void 0;
const class_validator_1 = require("class-validator");
const lodash_1 = require("lodash");
let EqualToRule = class EqualToRule {
    validate(value, validationArguments) {
        const { object, constraints } = validationArguments;
        return value === (0, lodash_1.get)(object, (0, lodash_1.first)(constraints));
    }
    defaultMessage(validationArguments) {
        const { property, constraints } = validationArguments;
        return `value of ${property} must be equals to ${constraints}`;
    }
};
EqualToRule = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'EqualTo' })
], EqualToRule);
exports.EqualToRule = EqualToRule;
function EqualTo(compareWith) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'EqualTo',
            target: object.constructor,
            propertyName,
            constraints: [compareWith],
            validator: EqualToRule,
        });
    };
}
exports.EqualTo = EqualTo;
//# sourceMappingURL=equal-to.js.map