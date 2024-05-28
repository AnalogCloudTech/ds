"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExistsInCms = exports.ExistsInCmsRule = void 0;
const class_validator_1 = require("class-validator");
const cms_service_1 = require("../cms.service");
let ExistsInCmsRule = class ExistsInCmsRule {
    constructor(cmsService) {
        this.cmsService = cmsService;
    }
    async validate(value, validationArguments) {
        try {
            const methodName = validationArguments.constraints[0];
            await this.cmsService[methodName](value);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    defaultMessage(validationArguments) {
        return `${validationArguments === null || validationArguments === void 0 ? void 0 : validationArguments.property} doesn't exists in CMS`;
    }
};
ExistsInCmsRule = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'ExistsInCms', async: true }),
    __metadata("design:paramtypes", [cms_service_1.CmsService])
], ExistsInCmsRule);
exports.ExistsInCmsRule = ExistsInCmsRule;
function ExistsInCms(constraints) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'ExistsInCms',
            target: object.constructor,
            propertyName: propertyName,
            constraints: constraints,
            validator: ExistsInCmsRule,
        });
    };
}
exports.ExistsInCms = ExistsInCms;
//# sourceMappingURL=exists-in-cms.js.map