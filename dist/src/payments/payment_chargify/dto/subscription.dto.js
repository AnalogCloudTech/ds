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
exports.Events = exports.SubscriptionEvent = exports.ComponentPriceInfoDto = exports.ComponentPriceDto = exports.CurrentSubscriptionDto = exports.SubscriptionObjDto = exports.PurgeQuery = exports.UpdateSubscriptionDto = exports.ProductChange = exports.CreateSubscriptionDto = exports.updatePaymentMethod = exports.CreditCardAttributes = exports.SubscriptionDto = void 0;
const class_validator_1 = require("class-validator");
class SubscriptionDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Number)
], SubscriptionDto.prototype, "customer_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubscriptionDto.prototype, "product_handle", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SubscriptionDto.prototype, "product_id", void 0);
exports.SubscriptionDto = SubscriptionDto;
class CreditCardAttributes {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreditCardAttributes.prototype, "full_number", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreditCardAttributes.prototype, "expiration_month", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreditCardAttributes.prototype, "expiration_year", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreditCardAttributes.prototype, "first_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreditCardAttributes.prototype, "payment_type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreditCardAttributes.prototype, "chargify_token", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreditCardAttributes.prototype, "last_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreditCardAttributes.prototype, "current_vault", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreditCardAttributes.prototype, "vault_token", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreditCardAttributes.prototype, "gateway_handle", void 0);
exports.CreditCardAttributes = CreditCardAttributes;
class updatePaymentMethod {
}
__decorate([
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", CreditCardAttributes)
], updatePaymentMethod.prototype, "credit_card_attributes", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], updatePaymentMethod.prototype, "next_billing_at", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], updatePaymentMethod.prototype, "product_handle", void 0);
exports.updatePaymentMethod = updatePaymentMethod;
class CreateSubscriptionDto {
}
__decorate([
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", SubscriptionDto)
], CreateSubscriptionDto.prototype, "subscription", void 0);
exports.CreateSubscriptionDto = CreateSubscriptionDto;
class ProductChange {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductChange.prototype, "product_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductChange.prototype, "product_handle", void 0);
exports.ProductChange = ProductChange;
class UpdateSubscriptionDto {
}
__decorate([
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", updatePaymentMethod)
], UpdateSubscriptionDto.prototype, "subscription", void 0);
exports.UpdateSubscriptionDto = UpdateSubscriptionDto;
class PurgeQuery {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PurgeQuery.prototype, "ack", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PurgeQuery.prototype, "subscription_id", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PurgeQuery.prototype, "cascade", void 0);
exports.PurgeQuery = PurgeQuery;
class SubscriptionObjDto {
}
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SubscriptionObjDto.prototype, "component", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Object)
], SubscriptionObjDto.prototype, "product", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubscriptionObjDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubscriptionObjDto.prototype, "current_period_ends_at", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SubscriptionObjDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubscriptionObjDto.prototype, "signup_revenue", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubscriptionObjDto.prototype, "state", void 0);
exports.SubscriptionObjDto = SubscriptionObjDto;
class CurrentSubscriptionDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CurrentSubscriptionDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", SubscriptionObjDto)
], CurrentSubscriptionDto.prototype, "subscription", void 0);
exports.CurrentSubscriptionDto = CurrentSubscriptionDto;
class ComponentPriceDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ComponentPriceDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ComponentPriceDto.prototype, "component_id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ComponentPriceDto.prototype, "starting_quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ComponentPriceDto.prototype, "ending_quantity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ComponentPriceDto.prototype, "unit_price", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ComponentPriceDto.prototype, "price_point_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ComponentPriceDto.prototype, "formatted_unit_price", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ComponentPriceDto.prototype, "segment_id", void 0);
exports.ComponentPriceDto = ComponentPriceDto;
class ComponentPriceInfoDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ComponentPriceInfoDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ComponentPriceInfoDto.prototype, "default", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ComponentPriceInfoDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ComponentPriceInfoDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ComponentPriceInfoDto.prototype, "pricing_scheme", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ComponentPriceInfoDto.prototype, "component_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ComponentPriceInfoDto.prototype, "handle", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ComponentPriceInfoDto.prototype, "archived_at", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ComponentPriceInfoDto.prototype, "created_at", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ComponentPriceInfoDto.prototype, "updated_at", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Array)
], ComponentPriceInfoDto.prototype, "prices", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ComponentPriceInfoDto.prototype, "tax_included", void 0);
exports.ComponentPriceInfoDto = ComponentPriceInfoDto;
class EventSpecificData {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EventSpecificData.prototype, "previous_allocation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EventSpecificData.prototype, "new_allocation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EventSpecificData.prototype, "component_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventSpecificData.prototype, "component_handle", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventSpecificData.prototype, "memo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EventSpecificData.prototype, "allocation_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventSpecificData.prototype, "uid", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventSpecificData.prototype, "number", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EventSpecificData.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventSpecificData.prototype, "due_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EventSpecificData.prototype, "issue_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventSpecificData.prototype, "paid_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventSpecificData.prototype, "due_amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventSpecificData.prototype, "paid_amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventSpecificData.prototype, "tax_amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventSpecificData.prototype, "refund_amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventSpecificData.prototype, "total_amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventSpecificData.prototype, "status_amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Array)
], EventSpecificData.prototype, "line_items", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventSpecificData.prototype, "product_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventSpecificData.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EventSpecificData.prototype, "service_credit_account_balance_in_cents", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EventSpecificData.prototype, "service_credit_balance_change_in_cents", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventSpecificData.prototype, "currency_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventSpecificData.prototype, "at_time", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EventSpecificData.prototype, "product_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EventSpecificData.prototype, "account_transaction_id", void 0);
class LineItemsEntity {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LineItemsEntity.prototype, "uid", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LineItemsEntity.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LineItemsEntity.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LineItemsEntity.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LineItemsEntity.prototype, "unit_price", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LineItemsEntity.prototype, "period_range_start", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LineItemsEntity.prototype, "period_range_end", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LineItemsEntity.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LineItemsEntity.prototype, "line_references", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LineItemsEntity.prototype, "pricing_details_index", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Array)
], LineItemsEntity.prototype, "pricing_details", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LineItemsEntity.prototype, "tax_code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LineItemsEntity.prototype, "tax_amount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LineItemsEntity.prototype, "product_id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LineItemsEntity.prototype, "product_price_point_id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LineItemsEntity.prototype, "price_point_id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LineItemsEntity.prototype, "component_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", void 0)
], LineItemsEntity.prototype, "custom_item", void 0);
class PricingDetailsEntity {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PricingDetailsEntity.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PricingDetailsEntity.prototype, "amount", void 0);
class SubscriptionEvent {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SubscriptionEvent.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubscriptionEvent.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubscriptionEvent.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SubscriptionEvent.prototype, "subscription_id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SubscriptionEvent.prototype, "customer_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubscriptionEvent.prototype, "created_at", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", EventSpecificData)
], SubscriptionEvent.prototype, "event_specific_data", void 0);
exports.SubscriptionEvent = SubscriptionEvent;
class Events {
}
__decorate([
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", SubscriptionEvent)
], Events.prototype, "event", void 0);
exports.Events = Events;
//# sourceMappingURL=subscription.dto.js.map