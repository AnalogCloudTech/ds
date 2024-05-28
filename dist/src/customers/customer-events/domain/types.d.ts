export type Metadata = {
    [key: string]: any;
};
export declare enum Events {
    AUTO_LOGIN_SUCCESS = "auto-login-success",
    PAYMENT_SUCCESS = "chargify-payment-success-webhook",
    PAYMENT_FAILED = "chargify-payment-failure-webhook",
    SUBSCRIPTION_STATE_CHANGE = "chargify-subscription-state-change-webhook",
    EXPIRING_CARD = "chargify-expiring-card-webhook",
    SUBSCRIPTION_UPDATED = "chargify-subscription-updated-webhook",
    VERIFY_RMM_SUBSCRIPTION = "chargify-verify-rmm-subscription-webhook",
    DEAL_UPDATE = "deal-update",
    DEAL_CREATE = "deal-create",
    BOOK_CREDITS_ADD = "book-credits-add",
    BOOK_CREDITS_UPDATE = "book-credits-update"
}
