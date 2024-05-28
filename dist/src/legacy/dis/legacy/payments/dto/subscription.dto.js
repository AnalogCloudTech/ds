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
exports.ProrationBehavior = exports.ListItem = exports.UpgradeSubscriptionResponse = exports.UpgradeSubscriptionDto = exports.LineItem = exports.SubscriptionProrationResponse = exports.SubscriptionProrationDto = exports.CreateSubscriptionDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const product_dto_1 = require("./product.dto");
class CreateSubscriptionDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "customerId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => product_dto_1.SubscriptionProduct),
    __metadata("design:type", Array)
], CreateSubscriptionDto.prototype, "products", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => product_dto_1.OneTimeProduct),
    __metadata("design:type", Array)
], CreateSubscriptionDto.prototype, "oneTimeProducts", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSubscriptionDto.prototype, "trialPeriod", void 0);
exports.CreateSubscriptionDto = CreateSubscriptionDto;
class SubscriptionProrationDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubscriptionProrationDto.prototype, "subscriptionId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubscriptionProrationDto.prototype, "newPriceId", void 0);
exports.SubscriptionProrationDto = SubscriptionProrationDto;
class SubscriptionProrationResponse {
}
exports.SubscriptionProrationResponse = SubscriptionProrationResponse;
class LineItem {
}
exports.LineItem = LineItem;
class UpgradeSubscriptionDto extends SubscriptionProrationDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpgradeSubscriptionDto.prototype, "prorationDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpgradeSubscriptionDto.prototype, "paymentMethodId", void 0);
exports.UpgradeSubscriptionDto = UpgradeSubscriptionDto;
class UpgradeSubscriptionResponse {
}
exports.UpgradeSubscriptionResponse = UpgradeSubscriptionResponse;
class ListItem {
}
exports.ListItem = ListItem;
var ProrationBehavior;
(function (ProrationBehavior) {
    ProrationBehavior["ALWAYS_INVOICE"] = "always_invoice";
    ProrationBehavior["CREATE_PRORATIONS"] = "create_prorations";
    ProrationBehavior["NONE"] = "none";
})(ProrationBehavior = exports.ProrationBehavior || (exports.ProrationBehavior = {}));
//# sourceMappingURL=subscription.dto.js.map