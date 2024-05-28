import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import {
  BookOptionId,
  CoachingDateSelection,
  CustomerStatus,
  Deal,
  DealDetail,
  DefaultSteps,
  DraftId,
  MarketingParameters,
  OfferAccepted,
  OfferId,
  PaymentProcessorId,
  SalesParameters,
  Step,
  StepStatus,
  WebinarDateSelection,
} from '../domain/types';
import { Session as DomainSession } from '../domain/session';
import { CastableTo } from '@/internal/common/utils';
import { OfferDocument } from './offer.schema';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CoachId } from '@/onboard/coaches/domain/types';
import { CoachDocument } from '@/onboard/coaches/schemas/coach.schema';
import { GenerateBookStatus } from '@/onboard/generate-book/domain/generate-book-status';
import { SchemaId } from '@/internal/types/helpers';
import { GuideOrderDocument } from '@/guides/orders/schemas/guide-orders.schema';

type OfferIdAsString = string;

export type StepResult = {
  status: StepStatus;
  description?: string;
  timestamp: Date;
};

type PaymentSuccess = {
  reference?: string;
  timestamp: Date;
};

type Payments = {
  [key: OfferIdAsString]: PaymentSuccess;
};
type OfferPaymentIntents = {
  [key: OfferIdAsString]: PaymentProcessorId;
};

type OfferAcceptance = {
  [key: OfferIdAsString]: OfferAccepted;
};

export type StepResults = {
  [key in Step]?: StepResult;
};

type Metrics = {
  [key in Step]?: boolean;
};

export enum SessionType {
  UPSELL = 'UPSELL',
  DENTIST = 'DENTIST',
  TW = 'TW',
  OTHER = 'OTHER',
  CONTRACTED = 'CONTRACTED',
}

@Schema({ timestamps: true, collection: 'ds__onboard__sessions' })
export class Session extends CastableTo<DomainSession> {
  @Prop({ ref: 'Offer', type: SchemaTypes.ObjectId })
  offer: OfferId | OfferDocument;

  @Prop({ ref: 'Customer', type: SchemaTypes.ObjectId })
  customer: SchemaId | CustomerDocument;

  @Prop({ ref: 'Coach', type: SchemaTypes.ObjectId })
  coach: CoachId | CoachDocument;

  @Prop({ type: Array, default: [] })
  declinedCoaches: CoachId[];

  @Prop({ type: Object, default: {} })
  stepResults: StepResults;

  @Prop({ type: Object, default: {} })
  paymentIntents: OfferPaymentIntents;

  @Prop({ type: Object, default: {} })
  offerAcceptance: OfferAcceptance;

  @Prop({ type: Object, default: {} })
  webinarSelection: WebinarDateSelection;

  @Prop({ type: Object, default: {} })
  coachingSelection: CoachingDateSelection;

  @Prop({ type: Object, default: {} })
  payments: Payments;

  @Prop({ type: Object, default: {} })
  book: GenerateBookStatus;

  @Prop({ type: String })
  currentStep: Step;

  @Prop({ type: String })
  draftId: DraftId;

  @Prop({ type: Object, default: {} })
  metrics: Metrics;

  @Prop({ ref: 'BookOption', type: SchemaTypes.ObjectId })
  bookOption: BookOptionId | string;

  order: number;

  @Prop({ type: Object, default: {} })
  marketingParameters?: MarketingParameters;

  @Prop({ type: Object, default: {} })
  salesParameters?: SalesParameters;

  @Prop({ type: Array, default: DefaultSteps })
  steps?: [];

  @Prop({ type: Array, default: null })
  deals?: Deal[];

  @Prop({ type: Object, default: {} })
  dealDetails?: DealDetail;

  @Prop({ type: Object, default: {} })
  customerStatus?: CustomerStatus;

  @Prop({ type: Boolean, default: false })
  guideOrdered: boolean;

  @Prop({ type: Object, default: {} })
  guideOrder: GuideOrderDocument;

  @Prop({ enum: SessionType, default: SessionType.OTHER })
  sessionType: SessionType;
}

export type SessionDocument = Session & Document;

export const SessionSchema = SchemaFactory.createForClass(Session).index({
  _id: 1,
  offer: 1,
});
