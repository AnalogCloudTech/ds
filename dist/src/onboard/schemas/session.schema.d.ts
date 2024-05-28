import { Document } from 'mongoose';
import { BookOptionId, CoachingDateSelection, CustomerStatus, Deal, DealDetail, DraftId, MarketingParameters, OfferAccepted, OfferId, PaymentProcessorId, SalesParameters, Step, StepStatus, WebinarDateSelection } from '../domain/types';
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
type StepResult = {
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
export declare enum SessionType {
    UPSELL = "UPSELL",
    DENTIST = "DENTIST",
    TW = "TW",
    OTHER = "OTHER",
    CONTRACTED = "CONTRACTED"
}
export declare class Session extends CastableTo<DomainSession> {
    offer: OfferId | OfferDocument;
    customer: SchemaId | CustomerDocument;
    coach: CoachId | CoachDocument;
    declinedCoaches: CoachId[];
    stepResults: StepResults;
    paymentIntents: OfferPaymentIntents;
    offerAcceptance: OfferAcceptance;
    webinarSelection: WebinarDateSelection;
    coachingSelection: CoachingDateSelection;
    payments: Payments;
    book: GenerateBookStatus;
    currentStep: Step;
    draftId: DraftId;
    metrics: Metrics;
    bookOption: BookOptionId | string;
    order: number;
    marketingParameters?: MarketingParameters;
    salesParameters?: SalesParameters;
    steps?: [];
    deals?: Deal[];
    dealDetails?: DealDetail;
    customerStatus?: CustomerStatus;
    guideOrdered: boolean;
    guideOrder: GuideOrderDocument;
    sessionType: SessionType;
}
export type SessionDocument = Session & Document;
export declare const SessionSchema: import("mongoose").Schema<Session, import("mongoose").Model<Session, any, any, any>, any, any>;
export {};
