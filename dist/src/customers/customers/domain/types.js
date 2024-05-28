"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountType = exports.CustomerMilestones = exports.CustomerMilestoneStatus = exports.SubscriptionStatus = exports.CustomerStatus = exports.Status = void 0;
var Status;
(function (Status) {
    Status["ACTIVE"] = "active";
    Status["PENDING"] = "pending";
    Status["INACTIVE"] = "inactive";
})(Status = exports.Status || (exports.Status = {}));
var CustomerStatus;
(function (CustomerStatus) {
    CustomerStatus["ACTIVE"] = "Active";
    CustomerStatus["INACTIVE"] = "Inactive";
})(CustomerStatus = exports.CustomerStatus || (exports.CustomerStatus = {}));
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["CANCELED"] = "canceled";
    SubscriptionStatus["ACTIVE"] = "active";
    SubscriptionStatus["TRIALING"] = "trialing";
})(SubscriptionStatus = exports.SubscriptionStatus || (exports.SubscriptionStatus = {}));
var CustomerMilestoneStatus;
(function (CustomerMilestoneStatus) {
    CustomerMilestoneStatus["PENDING"] = "pending";
    CustomerMilestoneStatus["COMPLETED"] = "completed";
})(CustomerMilestoneStatus = exports.CustomerMilestoneStatus || (exports.CustomerMilestoneStatus = {}));
var CustomerMilestones;
(function (CustomerMilestones) {
    CustomerMilestones["GENERATED_BOOK"] = "generated_book";
    CustomerMilestones["LAST_LOGIN"] = "last_login";
    CustomerMilestones["PROFILE_PICTURE"] = "profile_picture";
    CustomerMilestones["LEADS"] = "leads";
    CustomerMilestones["PRINTED_BOOK"] = "printed_book";
    CustomerMilestones["EMAIL_CAMPAIGN"] = "email_campaign";
})(CustomerMilestones = exports.CustomerMilestones || (exports.CustomerMilestones = {}));
var AccountType;
(function (AccountType) {
    AccountType["REALTOR"] = "Realtor";
    AccountType["DENTIST"] = "Dentist";
    AccountType["CONTRACTED"] = "Contracted";
})(AccountType = exports.AccountType || (exports.AccountType = {}));
//# sourceMappingURL=types.js.map