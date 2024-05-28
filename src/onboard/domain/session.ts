import { Offer } from '../domain/offer';
import {
  OrderNumber,
  SessionId,
  DraftId,
  Step,
  CoachingDateSelection,
} from './types';
import { StepResult } from './step-result';
import { Customer } from '@/customers/customers/domain/customer';
import { Expose, Type } from 'class-transformer';
import { Coach } from './coach';
import { Webinar } from './webinar';
import { GenerateBookStatus } from '@/onboard/generate-book/domain/generate-book-status';
import { GuideOrderDocument } from '@/guides/orders/schemas/guide-orders.schema';
import { SessionType } from '@/onboard/schemas/session.schema';

export class Session {
  @Expose()
  @Type(() => Customer)
  customer: Customer = null;

  @Expose()
  draftId: DraftId = null;

  @Expose()
  order: OrderNumber = null;

  @Expose()
  currentOffer: Offer = null;

  @Expose()
  step: Step = Step.PLACE_ORDER;

  @Expose()
  previousStep: StepResult = null;

  @Expose()
  @Type(() => Webinar)
  webinar: Webinar;

  @Expose()
  @Type(() => Coach)
  coach: Coach;

  @Expose()
  @Type(() => GenerateBookStatus)
  book: GenerateBookStatus;

  @Expose()
  id: SessionId = null;

  @Expose()
  @Type(() => Offer)
  offer: Offer = null;

  @Expose()
  autoLoginToken: null;

  @Expose()
  hasHubspotOwnerId = false;

  @Expose()
  steps: string[];

  @Expose()
  guideOrdered = false;

  @Expose()
  guideOrder: GuideOrderDocument;

  @Expose()
  coachingSelection: CoachingDateSelection;

  @Expose()
  scheduleDate: string;

  @Expose()
  sessionType: SessionType;
}
