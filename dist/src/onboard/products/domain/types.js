"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneTimeProductFamilyHandles = exports.HubspotPriceProperty = exports.HubspotProductProperty = exports.Type = void 0;
var Type;
(function (Type) {
    Type["ONE_TIME"] = "one_time";
    Type["SUBSCRIPTION"] = "subscription";
})(Type = exports.Type || (exports.Type = {}));
var HubspotProductProperty;
(function (HubspotProductProperty) {
    HubspotProductProperty["AUTHORIFY_PRODUCT"] = "authorify_product";
    HubspotProductProperty["REFERRAL_MARKETING_PRODUCT"] = "referral_marketing_product";
    HubspotProductProperty["DENTIST_PRODUCT"] = "dentist_product";
})(HubspotProductProperty = exports.HubspotProductProperty || (exports.HubspotProductProperty = {}));
var HubspotPriceProperty;
(function (HubspotPriceProperty) {
    HubspotPriceProperty["RECURRING_REVENUE_AMOUNT"] = "recurring_revenue_amount";
})(HubspotPriceProperty = exports.HubspotPriceProperty || (exports.HubspotPriceProperty = {}));
exports.oneTimeProductFamilyHandles = [
    'click_funnel_family',
    'book_credits_family',
    'guide_credits_family',
    'dentistguide',
    'holiday_sale_credits',
];
//# sourceMappingURL=types.js.map