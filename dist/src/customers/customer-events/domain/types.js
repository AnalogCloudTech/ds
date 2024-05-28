"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
var Events;
(function (Events) {
    Events["AUTO_LOGIN_SUCCESS"] = "auto-login-success";
    Events["PAYMENT_SUCCESS"] = "chargify-payment-success-webhook";
    Events["PAYMENT_FAILED"] = "chargify-payment-failure-webhook";
    Events["SUBSCRIPTION_STATE_CHANGE"] = "chargify-subscription-state-change-webhook";
    Events["EXPIRING_CARD"] = "chargify-expiring-card-webhook";
    Events["SUBSCRIPTION_UPDATED"] = "chargify-subscription-updated-webhook";
    Events["VERIFY_RMM_SUBSCRIPTION"] = "chargify-verify-rmm-subscription-webhook";
    Events["DEAL_UPDATE"] = "deal-update";
    Events["DEAL_CREATE"] = "deal-create";
    Events["BOOK_CREDITS_ADD"] = "book-credits-add";
    Events["BOOK_CREDITS_UPDATE"] = "book-credits-update";
})(Events = exports.Events || (exports.Events = {}));
//# sourceMappingURL=types.js.map