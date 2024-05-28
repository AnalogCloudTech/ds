"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = exports.WebhookPayload = exports.SubscriptionUpdatedPayload = exports.InvoiceIssuedPayload = exports.InvoiceIssuedInvoice = exports.InvoiceIssuedSubscription = exports.ComponentDto = exports.Component = exports.RenewalSuccessPayload = exports.SubscriptionPayload = exports.Site = exports.PricingScheme = void 0;
var PricingScheme;
(function (PricingScheme) {
    PricingScheme["PER_UNIT"] = "per_unit";
})(PricingScheme = exports.PricingScheme || (exports.PricingScheme = {}));
class Site {
}
exports.Site = Site;
class SubscriptionPayload {
}
exports.SubscriptionPayload = SubscriptionPayload;
class RenewalSuccessPayload {
}
exports.RenewalSuccessPayload = RenewalSuccessPayload;
class Component {
}
exports.Component = Component;
class ComponentDto {
}
exports.ComponentDto = ComponentDto;
class InvoiceIssuedSubscription {
}
exports.InvoiceIssuedSubscription = InvoiceIssuedSubscription;
class InvoiceIssuedInvoice {
}
exports.InvoiceIssuedInvoice = InvoiceIssuedInvoice;
class LineItem {
}
class InvoiceIssuedPayload {
}
exports.InvoiceIssuedPayload = InvoiceIssuedPayload;
class SubscriptionUpdatedPayload {
}
exports.SubscriptionUpdatedPayload = SubscriptionUpdatedPayload;
class WebhookPayload {
}
exports.WebhookPayload = WebhookPayload;
var State;
(function (State) {
    State["ACTIVE"] = "active";
    State["CANCELED"] = "canceled";
    State["EXPIRED"] = "expired";
    State["ON_HOLD"] = "on_hold";
    State["PAST_DUE"] = "past_due";
    State["SOFT_FAILURE"] = "soft_failure";
    State["TRIALING"] = "trialing";
    State["TRIAL_ENDED"] = "trial_ended";
    State["UNPAID"] = "unpaid";
    State["SUSPENDED"] = "suspended";
    State["AWAITING_SIGNUP"] = "awaiting_signup";
})(State = exports.State || (exports.State = {}));
//# sourceMappingURL=types.js.map