import mongoose from 'mongoose';
export type CustomerId = mongoose.Types.ObjectId;
export type StripeId = string;
export type HubspotId = string;
export type Url = string;
export declare enum Status {
    ACTIVE = "active",
    PENDING = "pending",
    INACTIVE = "inactive"
}
export declare enum CustomerStatus {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare enum SubscriptionStatus {
    CANCELED = "canceled",
    ACTIVE = "active",
    TRIALING = "trialing"
}
export declare enum CustomerMilestoneStatus {
    PENDING = "pending",
    COMPLETED = "completed"
}
export declare enum CustomerMilestones {
    GENERATED_BOOK = "generated_book",
    LAST_LOGIN = "last_login",
    PROFILE_PICTURE = "profile_picture",
    LEADS = "leads",
    PRINTED_BOOK = "printed_book",
    EMAIL_CAMPAIGN = "email_campaign"
}
export declare enum AccountType {
    REALTOR = "Realtor",
    DENTIST = "Dentist",
    CONTRACTED = "Contracted"
}
export type SMSPreferences = {
    schedulingCoachReminders: boolean;
};
