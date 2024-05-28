import { ObjectId } from 'mongoose';
import { SchemaId } from '@/internal/types/helpers';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';

export type PaymentProcessorId = string;

export type OfferAccepted = boolean;

export type SessionId = string;

export type DraftId = string;

export enum SessionStatus {
  INITIAL = 'initial',
  ONGOING = 'ongoing',
  FINISHED = 'finished',
  CANCELED = 'canceled',
}

export enum Countries {
  CANADA = 'Canada',
  USA = 'USA',
}

export enum OfferType {
  MAIN = 'main',
  UPSELL = 'upsell',
  DOWNSELL = 'downsell',
}

export enum AccountType {
  REALTOR = 'Realtor',
  DENTIST = 'Dentist',
  CONTRACTED = 'Contracted',
  REFFERAL_MARKETING = 'ReferralMarketing',
}

export type OrderNumber = string;

export enum Step {
  PLACE_ORDER = 'place_order',
  PLACE_ORDER_WAIT = 'place_order_wait',
  ADDON = 'addon',
  ADDON_WAIT = 'addon_wait',
  SCHEDULE_COACHING = 'schedule_coaching',
  SCHEDULE_COACHING_WAIT = 'schedule_coaching_wait',
  TRAINING_WEBINAR = 'training_webinar',
  TRAINING_WEBINAR_WAIT = 'training_webinar_wait',
  BOOK_DETAILS = 'book_details',
  BOOK_DETAILS_WAIT = 'book_details_wait',
  DENTIST_GUIDE_DETAILS = 'dentist_guide_details',
  YOUR_BOOK = 'your_book',
  YOUR_GUIDE = 'your_guide',
  ORDER_CONFIRMATION = 'order_confirmation',
  DONE = 'done',
  ACCOUNT_WAIT = 'account_wait',
}

export const DefaultSteps = [
  Step.PLACE_ORDER,
  Step.PLACE_ORDER_WAIT,
  Step.SCHEDULE_COACHING,
  Step.TRAINING_WEBINAR,
  Step.BOOK_DETAILS,
  Step.BOOK_DETAILS_WAIT,
  Step.YOUR_BOOK,
  Step.ORDER_CONFIRMATION,
  Step.DONE,
];

export enum StepStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

type DateSelection = {
  selectedTz: string;
  utcStart: Date;
  utcEnd?: Date;
};

export type OfferCode = string;

export type OfferImageUrl = string;

export type WebinarImageUrl = string;

export type CoachImageUrl = string;

export type BookOptionImageUrl = string;

export type BookPackageId = string;

export type ProductId = ObjectId;

export type OfferId = ObjectId;

export type BookOptionId = ObjectId;

export type CoachingDateSelection = DateSelection;

export type WebinarDateSelection = DateSelection;

export type MarketingParameters = {
  channel?: string;
  utmSource?: string;
  utmMedium?: string;
  utmContent?: string;
  utmTerm?: string;
  affiliateId?: string;
};

export type SalesParameters = {
  orderSystem?: string;
  salesAgent?: string;
};

export type Deal = {
  dealId: string;
  subscriptionId: string;
};

export type SessionCustomerHubspot = {
  _id: SchemaId;
  currentStep: Step;
  customer: Pick<CustomerDocument, 'firstName' | 'email' | 'hubspotId'>;
};
export type CanadianBookOption = { id: string; image: string };
export type CanadianBooks = {
  _id: BookOptionId;
  image: string;
};
export type DealDetail = {
  dealExists?: boolean;
  dealId?: string;
  email?: string;
};

export type CustomerStatus = {
  status: string;
  updatedAt: string;
  subscriptionId: string;
};

export type CoachingDetails = {
  marketing_consultant_owner: string;
  first_coaching_call_scheduled: string;
};
