import mongoose from 'mongoose';

export type CustomerId = mongoose.Types.ObjectId;

export type StripeId = string;

export type HubspotId = string;

export type Url = string;

export enum Status {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
}

export enum CustomerStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export enum SubscriptionStatus {
  CANCELED = 'canceled',
  ACTIVE = 'active',
  TRIALING = 'trialing',
}

export enum CustomerMilestoneStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export enum CustomerMilestones {
  GENERATED_BOOK = 'generated_book',
  LAST_LOGIN = 'last_login',
  PROFILE_PICTURE = 'profile_picture',
  LEADS = 'leads',
  PRINTED_BOOK = 'printed_book',
  EMAIL_CAMPAIGN = 'email_campaign',
}

export enum AccountType {
  REALTOR = 'Realtor',
  DENTIST = 'Dentist',
  CONTRACTED = 'Contracted',
  REFFERAL_MARKETING = 'ReferralMarketing',
}

export type SMSPreferences = {
  schedulingCoachReminders: boolean;
};
