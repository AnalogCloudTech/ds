import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { DateTime } from 'luxon';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { findIndex, first, get, isEmpty, isNull, padStart } from 'lodash';
import {
  CanadianBookOption,
  CanadianBooks,
  CoachingDetails,
  Deal,
  DefaultSteps,
  MarketingParameters,
  OfferCode,
  OfferId,
  OfferType,
  SalesParameters,
  SessionId,
  Step,
  StepStatus,
} from './domain/types';
import {
  Session as SessionModel,
  SessionDocument,
} from './schemas/session.schema';
import { Offer as OfferModel, OfferDocument } from './schemas/offer.schema';
import { ProductDocument } from '@/onboard/products/schemas/product.schema';
import { CreateOfferDto } from './dto/create-offer.dto';
import { CreateCustomerDto } from '@/customers/customers/dto/create-customer.dto';
import { CustomersService } from '@/customers/customers/customers.service';
import { DisService } from '@/legacy/dis/dis.service';
import { Session } from './domain/session';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { Product } from '@/onboard/products/domain/product';
import {
  WebhookIdempotency,
  WebhookIdempotencyDocument,
} from './schemas/webhook-idempotency.schema';
import { Offer } from './domain/offer';
import { CoachesService } from '@/onboard/coaches/coaches.service';
import { CoachDocument } from '@/onboard/coaches/schemas/coach.schema';
import { CreateBookOptionDto } from './dto/create-book-option.dto';
import { BookOption, BookOptionDocument } from './schemas/book-option.schema';
import { GenerateBookService } from '@/onboard/generate-book/generate-book.service';
import { BookDetailsDto } from './dto/book-details.dto';
import { GenerateBookDto } from '@/onboard/generate-book/dto/generate-book.dto';
import { UpdateBookPreferencesDto } from '@/customers/customers/dto/update-book-preferences.dto';
import { Status as GenerateBookStatus } from '@/onboard/generate-book/domain/types';
import {
  AccountType,
  CustomerId,
  Status as CustomerStatus,
} from '@/customers/customers/domain/types';
import {
  HubspotProductProperty,
  ProductId,
  Type as ProductType,
} from '@/onboard/products/domain/types';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import {
  CONTEXT_BOOK_CREDIT,
  CONTEXT_CHARGIFY,
  CONTEXT_ERROR,
  CONTEXT_HUBSPOT,
  CONTEXT_ON_BOARD_DEAL,
  CONTEXT_ONBOARD_CRON_LAST_STEP_ERROR,
  CONTEXT_ONBOARD_METRICS,
  CONTEXT_ONBOARD_SCHEDULING_COACHING,
  CONTEXT_SOCIAL_MEDIA_TRAINING,
} from '@/internal/common/contexts';
import { InjectQueue } from '@nestjs/bull';
import { COACHING_REMINDER_EMAIL_NAME, DEFAULT_TIMEZONE } from './constants';
import { Queue } from 'bull';
import { LeadsService } from '@/campaigns/email-campaigns/leads/leads.service';
import { CmsService } from '@/cms/cms/cms.service';
import { Countries } from '@/onboard/domain/types';
import {
  SalesReportWithDealsLineItem,
  SalesReportWithDealsResponseDto,
} from './dto/sales-with-deals.dto';
import { ConfigService } from '@nestjs/config';
import { ProductsService } from '@/onboard/products/products.service';
import { LineItemDto } from '@/legacy/dis/legacy/hubspot/dto/line-item.dto';
import { CoachEmailReminderResponseDto } from './dto/coach-email-reminder.dto';
import { PaginatorSchema } from '@/internal/utils/paginator';
import { CustomerSubscriptionDocument } from '@/customers/customers/schemas/customer-subscription.schema';
import { UnsubscriptionReportDto } from '@/customers/customers/dto/unsubscription-report.dto';
import { PaymentChargifyService } from '@/payments/payment_chargify/payments.service';
import { EmailRemindersService } from '@/onboard/email-reminders/email-reminders.service';
import {
  Component,
  SessionOnboardSales,
  State,
  Subscription,
  SubscriptionComponent,
} from '@/payments/chargify/domain/types';
import { SimplePublicObject } from '@hubspot/api-client/lib/codegen/crm/deals/model/simplePublicObject';
import {
  compareChargifyDates,
  convertToHSDate,
  dateStringToHSDate,
} from '@/internal/common/utils/dateFormatters';
import * as hubspot from '@hubspot/api-client';
import { SocialMediaDto } from '@/onboard/dto/social-media.dto';
import {
  OfferListReportResponseDto,
  SalesReportResponseDto,
} from './dto/sales-report.dto';
import { CalendarDtoWithCoach } from '@/legacy/dis/legacy/calendar/dto/calendar.dto';
import { LoggerPayload } from '@/internal/utils/logger';
import { CalendarService } from '@/legacy/dis/legacy/calendar/calendar.service';
import { UpdateCreditsAndPackagesDto } from '@/legacy/dis/legacy/hubspot/dto/updateCreditsAndPackages.dto';
import { CreateCustomerEventDto } from '@/customers/customer-events/dto/create-customer-event.dto';
import { CustomerEventsService } from '@/customers/customer-events/customer-events.service';
import { Events } from '@/customers/customer-events/domain/types';
import { CheckSessionPaymentDto } from '@/onboard/dto/check-session-payment.dto';
import { SessionService } from '@/onboard/services/session.service';
import { NoFreeTimeSlotsException } from '@/onboard/exceptions/no-free-time-slots.exception';
import {
  OnboardMetricsDto,
  SearchSuggestionsDto,
} from './dto/onboard-metrics.dto';
import { SchemaId } from '@/internal/types/helpers';
import { HubspotCreateDealRequestDto } from './dto/hubspot-deal-create.dto';
import { ObjectId } from 'mongodb';
import { CreateSubscriptionDto } from '@/payments/payment_chargify/dto/subscription.dto';
import { sleep } from '@/internal/utils/functions';
import { NoAvailableCoachesException } from '@/onboard/exceptions/no-available-coaches.exception';
import { NODE_TYPES } from '@/internal/common/types/mongodb.type';
import { OrderBookAndUpdateSessionDto } from '@/onboard/dto/order-book-and-update-session.dto';
import { Axios } from 'axios';
import { HubspotSyncActionsServices } from '@/legacy/dis/legacy/hubspot/hubspot-sync-actions.services';
import { SummaryDTO, SummaryGuideDTO } from '@/onboard/dto/summary.dto';
import { capitalizeFirstLetter } from '@/internal/utils/string';
import { UpdateScheduledCoachInSessionDto } from '@/onboard/email-reminders/dto/update-scheduled-coach-in-session.dto';
import AfyLoggerService, {
  LogInput,
} from '@/integrations/afy-logger/afy-logger.service';
import { v4 as uuidv4 } from 'uuid';
import { DentistCoachesService } from '@/onboard/dentist-coaches/dentist-coaches.service';
import { OffersService } from '@/onboard/services/offers.service';
import { StepResult } from '@/onboard/domain/step-result';
import { SimplePublicObjectInput } from '@hubspot/api-client/lib/codegen/crm/contacts/model/simplePublicObjectInput';
import { BindCustomerPaymentIntentException } from '@/onboard/exceptions/bind-customer-payment-intent.exception';
import { StepResultException } from '@/onboard/exceptions/step-result.exception';
import { HUBSPOT_SYNC_ACTIONS_QUEUE } from '@/legacy/dis/legacy/hubspot/constants';

@Injectable()
export class OnboardService {
  constructor(
    @InjectQueue(COACHING_REMINDER_EMAIL_NAME) private readonly queue: Queue,
    @InjectQueue(HUBSPOT_SYNC_ACTIONS_QUEUE)
    private readonly hubspotQueue: Queue,
    @InjectModel(OfferModel.name)
    private readonly offerModel: Model<OfferDocument>,
    @InjectModel(SessionModel.name)
    private readonly sessionModel: Model<SessionDocument>,
    @InjectModel(WebhookIdempotency.name)
    private readonly webhookIdempotencyModel: Model<WebhookIdempotencyDocument>,
    @InjectModel(BookOption.name)
    private readonly bookOptionModel: Model<BookOptionDocument>,
    private readonly disService: DisService,
    private readonly configService: ConfigService,
    private readonly customersService: CustomersService,
    private readonly coachesService: CoachesService,
    private readonly dentistCoachesService: DentistCoachesService,
    private readonly generateBookService: GenerateBookService,
    private readonly hubspotService: HubspotService,
    private readonly hubspotSyncActionsServices: HubspotSyncActionsServices,
    private readonly leadsService: LeadsService,
    private cmsServices: CmsService,
    private readonly productsService: ProductsService,
    private readonly logger: Logger,
    private readonly paymentChargifyService: PaymentChargifyService,
    private readonly emailRemindersService: EmailRemindersService,
    private readonly customerEventsService: CustomerEventsService,
    private readonly calendarService: CalendarService,
    private readonly sessionService: SessionService,
    @Inject('HTTP_DIS') private readonly http: Axios,
    private readonly afyLoggerService: AfyLoggerService,
    private readonly offersService: OffersService,
  ) {}

  /**
   * Returns all onboard metrics in a given time
   * if the time is not given it will return the metrics for the last 30 days
   *
   *
   * @param {string} start - starting date in ISO format
   * @param {string} end - ending date in ISO format
   * @returns Array of session models
   *
   */
  async getAllOnboardMetrics(
    start: string,
    end: string,
  ): Promise<Array<SessionModel>> {
    const startDate = start
      ? DateTime.fromISO(start, {
          zone: DEFAULT_TIMEZONE,
        }).startOf('day')
      : DateTime.now().minus({ days: 30 }).startOf('day');
    const endDate = end
      ? DateTime.fromISO(end, {
          zone: DEFAULT_TIMEZONE,
        }).endOf('day')
      : DateTime.now().endOf('day');

    if (startDate.diff(endDate, 'days').days > 360) {
      throw new HttpException(
        { message: 'The maximum range is 360 days' },
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    const filterQuery = <FilterQuery<SessionModel>>{
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    const sessions = await this.sessionModel
      .aggregate<SessionModel>(
        [
          {
            $match: {
              ...filterQuery,
            },
          },
          {
            $lookup: {
              from: 'ds__customers',
              localField: 'customer',
              foreignField: '_id',
              as: 'customerInfo',
            },
          },
          {
            $unwind: {
              path: '$customerInfo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'ds__onboard__offers',
              localField: 'offer',
              foreignField: '_id',
              as: 'offerDetails',
            },
          },
          {
            $unwind: {
              path: '$offerDetails',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'ds__customers_subscriptions',
              localField: 'customer',
              foreignField: 'customer',
              as: 'customerStatus',
            },
          },
          {
            $unwind: {
              path: '$customerStatus',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'ds__customer_events',
              localField: 'customer',
              foreignField: 'customer',
              as: 'customerEvents',
            },
          },
          {
            $addFields: {
              customerEvents: {
                $first: '$customerEvents',
              },
            },
          },
          {
            $project: {
              createdAt: 1,
              updatedAt: 1,
              customerInfo: {
                firstName: 1,
                lastName: 1,
                email: 1,
                stripeId: 1,
                billing: 1,
              },
              offerDetails: { title: 1, trial: 1, code: 1 },
              customerStatus: { status: 1, updatedAt: 1 },
              customerEvents: { event: 1 },
            },
          },
        ],
        {
          readPreference: 'secondaryPreferred',
          batchSize: 1000,
        },
      )
      .exec();
    return sessions;
  }

  public async updateSessionWithCoach({
    coachEmail,
    sessionId,
  }: UpdateScheduledCoachInSessionDto) {
    const coach = await this.coachesService.findByEmail(coachEmail);

    if (!coach) {
      throw new Error(`Coach with email ${coachEmail} not found`);
    }

    const session = await this.sessionService.findById(sessionId);

    if (!session) {
      throw new Error(`Session with id ${sessionId} not found`);
    }

    return this.sessionService.update(<SchemaId>session._id, {
      coach: coach._id,
    });
  }

  public async resumeSession(
    offerId: OfferId,
    email: string,
    password: string,
  ): Promise<SessionDocument | false> {
    const customer = await this.customersService.findByEmail(email);
    if (!customer) {
      return false;
    }

    const session = await this.sessionModel.findOne({
      customer: customer._id,
      offer: offerId,
    });

    if (!session) {
      return false;
    }

    const authenticatesSuccessfully = await this.customersService.authenticate(
      email,
      password,
    );
    if (!authenticatesSuccessfully) {
      return false;
    }

    return session;
  }

  public async offerCodeToOfferId(code: OfferCode): Promise<SchemaId> {
    const offer = await this.offerModel
      .findOne({ code, type: OfferType.MAIN })
      .select('_id')
      .lean();
    return offer?._id;
  }

  async saveAddonAnswer(
    sessionId: SessionId,
    offerId: OfferId,
    accepted: boolean,
  ): Promise<void> {
    const keyAcceptance = `offerAcceptance.${offerId}`;
    const keyResult = `stepResults.${Step.ADDON}`;
    const status = StepStatus.SUCCESS;
    const timestamp = DateTime.now().toJSDate();
    const stepResult = {
      status,
      timestamp,
    };
    await this.sessionModel
      .findByIdAndUpdate(sessionId, {
        [keyAcceptance]: accepted,
        [keyResult]: stepResult,
      })
      .exec();
  }

  public async bindCustomerAndStartPaymentIntent(
    dto: CreateCustomerDto,
    offer: OfferDocument,
    session: SessionDocument,
  ): Promise<SessionDocument> {
    const customer = await this.bindCustomer(dto);
    try {
      await this.startPaymentIntent(
        customer,
        offer,
        session,
        dto.chargifyToken,
      );
      await this.setStepResultPlaceOrder(StepStatus.SUCCESS, session, customer);
    } catch (error) {
      if (error instanceof Error) {
        const message = error?.message
          ? error?.message
          : 'Error starting payment intent';

        await this.setStepResultPlaceOrder(
          StepStatus.ERROR,
          session,
          customer,
          message,
        );

        throw new BindCustomerPaymentIntentException(message, {
          customer: { email: customer.email, name: customer.firstName },
          session: { id: session.id as string },
          dto,
        });
      }
    }
    return session;
  }

  public async setStepResultPlaceOrder(
    status: StepStatus,
    session: SessionDocument,
    customer: CustomerDocument,
    description?: string,
  ) {
    const stepResultIndex = `stepResults.${Step.PLACE_ORDER}`;
    const stepResult = {
      status,
      timestamp: DateTime.now().toJSDate(),
      description,
    };
    const updated = await this.sessionModel
      .updateOne(
        { _id: session._id as SessionId },
        { customer: customer.id as CustomerId, [stepResultIndex]: stepResult },
      )
      .exec();
    if (!updated.acknowledged) {
      throw new InternalServerErrorException();
    }
  }

  public async startPaymentIntent(
    customer: CustomerDocument,
    offer: OfferDocument,
    session: SessionDocument,
    chargifyToken?: string,
  ): Promise<string> {
    const offerId = offer._id;
    const sessionId = <SchemaId>session._id;
    // will check if subscription is already there, will return
    const currentPaymentIntent = get(session, [
      'paymentIntents',
      offerId.toString(),
    ]);
    if (currentPaymentIntent) {
      return currentPaymentIntent;
    }

    // create subscription here
    const { firstName, lastName, email } = customer;
    const products = await this.getOfferProducts(offerId);
    const hasProducts = !isEmpty(products);

    if (!hasProducts) {
      throw new InternalServerErrorException(
        `Offer ${offerId} doesn't have products`,
      );
    }

    const productDetails = products.find(
      (product) => product.type === ProductType.SUBSCRIPTION,
    );
    const {
      chargifyProductHandle,
      chargifyComponentId,
      chargifyProductPriceHandle,
      productWithoutTrial,
    } = productDetails || {};

    const subscriptionDetails: CreateSubscriptionDto = {
      subscription: {
        product_handle: chargifyProductHandle,
        components: [
          {
            component_id: Number(chargifyComponentId),
            allocated_quantity: 1,
          },
        ],
        customer_attributes: {
          first_name: firstName,
          last_name: lastName,
          email,
        },
        credit_card_attributes: {
          payment_type: 'credit_card',
          chargify_token: chargifyToken,
        },
        metafields: {
          sessionId,
          offerId,
        },
      },
    };
    if (!productWithoutTrial) {
      // If the offer product have the trial period
      subscriptionDetails.subscription['product_price_point_handle'] =
        chargifyProductPriceHandle;
    } else {
      // If the offer product doesn't have the trial period
      subscriptionDetails.subscription.components[0]['price_point_id'] =
        chargifyProductPriceHandle;
    }
    try {
      const createSubResponse =
        await this.paymentChargifyService.createSubscription(
          subscriptionDetails,
        );
      const { subscription, errors } = createSubResponse;

      if (!subscription) {
        const errorMessages = errors?.join(' ');
        this.logger.error(
          {
            payload: <LoggerPayload>{
              usageDate: DateTime.now(),
              error: 'subscription is undefined',
              subscriptionDetails,
              subcontext: CONTEXT_CHARGIFY,
            },
          },
          '',
          CONTEXT_ERROR,
        );
        throw new HttpException(
          {
            message: errorMessages,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const paymentIntentKey = `paymentIntents.${offer.id}`;

      const sessionValuesToUpdate = {
        [paymentIntentKey]: subscription.id,
      };

      // if (subscription.id) {
      //   const placeOrderWaitKey = 'stepResults.place_order_wait';
      //   sessionValuesToUpdate[placeOrderWaitKey] = 'success';
      // }
      const chargifyId = <string>get(subscription, 'customer.id');
      if (chargifyId) {
        await this.customersService.update(customer, { chargifyId });
      }
      await session.updateOne(sessionValuesToUpdate, { new: true }).exec();
      return subscription?.id?.toString();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  public isTrainingWebinarEnabled(): boolean {
    return this.configService.get<boolean>('features.trainingWebinar');
  }

  public async offerExists(code: OfferCode): Promise<boolean> {
    const exists = await this.offerModel.exists({ code });
    return !!exists;
  }

  public async sessionExists(
    sessionId: SessionId,
    offerCode: OfferCode,
  ): Promise<boolean> {
    const offerId = await this.offerCodeToOfferId(offerCode);
    if (!offerId) {
      return false;
    }
    return !!this.sessionModel.exists({
      _id: sessionId,
      offer: offerId,
    });
  }

  public async findSession(sessionId: SessionId): Promise<SessionDocument> {
    const sessionDocument = await this.sessionModel
      .findById(sessionId)
      .populate(['offer', 'customer', 'coach']);
    const offerDocument = sessionDocument.offer as OfferDocument;
    sessionDocument.offer = await offerDocument.populate([
      'bookOptions',
      'nonHeadshotBookOptions',
      'bookOptionsCA',
      'nonHeadshotBookOptionsCA',
    ]);
    return sessionDocument;
  }

  async updateDealWithCoachDetails(email: string) {
    try {
      const subscription =
        await this.paymentChargifyService.getSubscriptionsFromEmail(email);
      const deal = await this.hubspotService.getDealBySubscriptionId(
        subscription.id,
      );
      const coachingDetails = await this.getCoachingHubspotDetails(email);
      const updateDeal = {
        properties: {
          ...coachingDetails,
        },
      };
      await this.hubspotService.updateDeal(deal.id, updateDeal);
      return true;
    } catch (error) {
      this.logger.error(
        {
          payload: <LoggerPayload>{
            error,
            message: 'Error updating deal with coaching details',
            usageDate: DateTime.now(),
            subcontext: CONTEXT_HUBSPOT,
          },
        },
        CONTEXT_ERROR,
      );
    }
  }

  public async getCoachingHubspotDetails(
    email: string,
  ): Promise<CoachingDetails | Record<string, never>> {
    try {
      const customer = await this.customersService.findByEmail(email);
      if (!customer) {
        this.logger.error(
          {
            payload: <LoggerPayload>{
              message: `Customer with email ${email} not found`,
              usageDate: DateTime.now(),
              method: 'getCoachingHubspotDetails',
            },
          },
          CONTEXT_ERROR,
        );
        return {};
      }
      const session = await this.sessionModel
        .findOne({
          customer: customer._id,
        })
        .populate(['coach']);
      if (!session) {
        this.logger.error(
          {
            payload: <LoggerPayload>{
              message: `Session with customer ${customer._id} not found`,
              usageDate: DateTime.now(),
              method: 'getCoachingHubspotDetails',
            },
          },
          CONTEXT_ERROR,
        );
        return {};
      }
      const coach = session.coach as CoachDocument;
      const coachingSelection = get(session, 'coachingSelection');
      const scheduleDate = DateTime.fromJSDate(coachingSelection.utcStart)
        .setZone(coachingSelection.selectedTz)
        .setLocale('en-US')
        .toFormat('yyyy-MM-dd');
      return {
        marketing_consultant_owner: coach.hubspotId,
        first_coaching_call_scheduled: scheduleDate,
      };
    } catch (error) {
      this.logger.error(
        {
          payload: <LoggerPayload>{
            error,
            email,
            message: 'Error getting coaching hubspot details',
            usageDate: DateTime.now(),
            method: 'getCoachingHubspotDetails',
          },
        },
        CONTEXT_ERROR,
      );
      return null;
    }
  }

  public async findOfferBySession(
    sessionId: SessionId,
  ): Promise<OfferDocument> {
    const sessionDocument = await this.sessionModel
      .findById(sessionId)
      .populate(['offer']);
    return sessionDocument.offer as OfferDocument;
  }

  public async createOffer(dto: CreateOfferDto): Promise<OfferDocument> {
    const result = await new this.offerModel(dto).save();
    const populatedOffer = await result.populate(['products', 'bookOptions']);
    return populatedOffer;
  }

  public async updateOffer(dto: CreateOfferDto, id: string) {
    const result = await this.offerModel.findOneAndUpdate({ _id: id }, dto);
    const populatedOffer = await result.populate(['products', 'bookOptions']);
    return populatedOffer;
  }

  public async getOffersList(): Promise<Array<OfferDocument>> {
    return this.offerModel.find().populate(['products', 'packages']);
  }

  public async getOffersListAbo(
    page: number,
    perPage: number,
  ): Promise<OfferListReportResponseDto> {
    const totalCount = await this.offerModel.countDocuments();
    const skip = page * perPage;
    const limit = perPage;
    const result = await this.offerModel
      .find()
      .skip(skip)
      .limit(limit)
      .populate(['products', 'packages']);
    return PaginatorSchema.build(totalCount, result, page, perPage);
  }

  public async createBookOption(
    dto: CreateBookOptionDto,
  ): Promise<BookOptionDocument> {
    const result = await new this.bookOptionModel(dto).save();
    return result;
  }

  public async getBookOptionByBookId(
    bookId: string,
  ): Promise<BookOptionDocument> {
    return this.bookOptionModel.findOne({ bookId });
  }

  public async findMainOffer(code: OfferCode): Promise<OfferDocument> {
    const result = await this.offerModel
      .findOne({ code, type: OfferType.MAIN })
      .exec();
    return result;
  }

  public async findAddonOffer(code: OfferCode): Promise<OfferDocument> {
    const result = await this.offerModel
      .findOne({ code, type: { $not: { $eq: OfferType.MAIN } } })
      .exec();
    return result;
  }

  public async createSession(
    offer: OfferDocument,
    marketingParameters?: MarketingParameters,
    salesParameters?: SalesParameters,
  ): Promise<SessionDocument> {
    const steps = isEmpty(offer.steps) ? DefaultSteps : offer.steps;

    const newSession = await this.sessionModel.create({
      offer: offer._id,
      currentStep: Step.PLACE_ORDER,
      steps,
      marketingParameters,
      salesParameters,
    });
    return newSession.populate(['offer']);
  }

  async assignCoachToSession(
    sessionId: string,
    coach: CoachDocument,
  ): Promise<void> {
    await this.sessionModel.findByIdAndUpdate(sessionId, {
      coach: coach?.id as SchemaId,
      hasHubspotOwnerId: true,
    });
  }

  /**
   * This Method assigns a coach to the session by
   * one of two ways:
   * 1- Check whether the customer on hubspot exists, has an owner, and the owner is set as a coach in the DB
   * 2- if 1 fails we get a coach from our round-robin method and assign to session
   */
  async findAndAssignCoachToSession(
    sessionDocument: SessionDocument,
    forceRR = false,
  ): Promise<CoachDocument> {
    let selectedCoach: CoachDocument = null;

    const coachFromOwner = await this.getCoachFromOwner(sessionDocument);
    if (coachFromOwner) {
      selectedCoach = coachFromOwner;
    }

    if (forceRR || isNull(selectedCoach)) {
      const offer = sessionDocument?.offer as OfferDocument;
      const isDentistCoach = offer.accountType === AccountType.DENTIST;
      if (isDentistCoach) {
        selectedCoach = await this.dentistCoachesService.getNextCoachInRR(
          sessionDocument.declinedCoaches,
        );
      } else {
        selectedCoach = await this.coachesService.getNextCoachInRR(
          sessionDocument.declinedCoaches,
        );
      }
    }

    if (isNull(selectedCoach)) {
      throw new NoAvailableCoachesException();
    }

    await this.assignCoachToSession(
      (<SchemaId>sessionDocument._id).toString(),
      selectedCoach,
    );

    return selectedCoach;
  }

  getNextStepFromArray(steps: string[], currentStep: string) {
    const idx: number = steps.indexOf(currentStep);
    return steps[idx + 1];
  }

  getPrevStepFromArray(steps: string[], currentStep: string) {
    if (steps.length) {
      const idx = steps.indexOf(currentStep);
      return steps[idx - 1] as Step;
    }
  }

  async isScheduleCoaching(
    steps: string[],
    currentStep: string,
    sessionDocument: SessionDocument,
  ) {
    let nextStep: string;
    if (steps.length) {
      nextStep = this.getNextStepFromArray(steps, currentStep);
    }
    if (!nextStep || nextStep === Step.SCHEDULE_COACHING) {
      await this.ensureSessionHasCoach(sessionDocument);
      return Step.SCHEDULE_COACHING;
    }
    return nextStep;
  }

  public async updateStepAndPopulateSession(
    currentSession: SessionDocument,
  ): Promise<Session> {
    const sessionDocument = await this.findSession(
      currentSession.id as SessionId,
    );
    const step = sessionDocument.currentStep;
    const stepResult = get(sessionDocument, ['stepResults', step]);
    const update = {};
    const hasSuccessResult = stepResult?.status === StepStatus.SUCCESS;

    if (stepResult && !hasSuccessResult) {
      throw new StepResultException(step, stepResult);
    }

    const sessionCustomer = sessionDocument?.customer as CustomerDocument;
    const country = sessionCustomer?.billing?.country || Countries.USA;

    const hasCountryAddon = country !== Countries.CANADA;

    const offer = sessionDocument.offer as OfferDocument;
    const addons = offer.addons;
    const hasAddons = !isEmpty(addons);
    const offerId = (offer.id as string).toString();

    const payments = get(sessionDocument, ['paymentIntents'], {});
    const steps = sessionDocument.steps || [];
    const guideOrdered = get(sessionDocument, 'guideOrdered');

    switch (step) {
      case Step.ACCOUNT_WAIT:
        await sleep(15000);
        update['currentStep'] = Step.DONE;
        break;
      case Step.PLACE_ORDER_WAIT:
        const hasOfferPayment = Boolean(get(payments, [offerId]));

        if (hasOfferPayment) {
          if (!hasAddons) {
            update['currentStep'] = await this.isScheduleCoaching(
              steps,
              step,
              sessionDocument,
            );
            break;
          }
        }
        if (offer.skipOnboarding) {
          update['currentStep'] = Step.ACCOUNT_WAIT;
          break;
        }
        update['currentStep'] = Step.SCHEDULE_COACHING;
        break;
      case Step.ADDON:
        if (!hasCountryAddon) {
          update['currentStep'] = await this.isScheduleCoaching(
            steps,
            step,
            sessionDocument,
          );
          break;
        }

        let hasMoreAddons = false;
        for (const addon of addons) {
          const addonId = addon.offer.toString();
          const offerAcceptance = get(sessionDocument, [
            'offerAcceptance',
            addonId,
          ]);
          const addonWasOffered = offerAcceptance !== undefined;
          if (!addonWasOffered) {
            hasMoreAddons = true;
            break;
          }
        }
        if (!hasMoreAddons) {
          update['currentStep'] = await this.isScheduleCoaching(
            steps,
            step,
            sessionDocument,
          );
          break;
        }
        update['currentStep'] = Step.ADDON; // current
        break;

      case Step.SCHEDULE_COACHING:
        const coachingSelection = get(sessionDocument, 'coachingSelection');
        const hasCoachingSelection = !isEmpty(coachingSelection);

        if (!hasCoachingSelection) {
          await this.ensureSessionHasCoach(sessionDocument);
        }

        if (hasCoachingSelection) {
          let isRmSub = false;

          try {
            isRmSub = await this.paymentChargifyService.currentSubscriptionIsRM(
              sessionCustomer,
            );
          } catch (error) {
            if (error instanceof Error) {
              this.logger.error(
                {
                  payload: <LoggerPayload>{
                    error,
                    stack: error?.stack,
                    message: 'Error checking if subscription is RM',
                    usageDate: DateTime.now(),
                    subcontext: CONTEXT_CHARGIFY,
                  },
                },
                error?.stack,
                CONTEXT_ERROR,
              );
            }
          }

          const isDentist =
            sessionCustomer.accountType === AccountType.DENTIST ||
            offer.accountType === AccountType.DENTIST;

          if (isRmSub) {
            update['currentStep'] = Step.DONE;

            const { isRm, isAfy } =
              await this.paymentChargifyService.checkCustomerSubscriptionType(
                sessionCustomer,
              );

            await this.hubspotService.updateRmUserProperties({
              email: sessionCustomer.email,
              isAfy,
              isRm,
            });
          } else if (isDentist) {
            update['currentStep'] = Step.DENTIST_GUIDE_DETAILS;
          } else {
            update['currentStep'] =
              this.isTrainingWebinarEnabled() && offer?.webinar
                ? Step.TRAINING_WEBINAR
                : Step.BOOK_DETAILS;
          }
        }
        break;

      case Step.TRAINING_WEBINAR:
        const webinarSelection = get(sessionDocument, 'webinarSelection');
        const hasWebinarSelection = !isEmpty(webinarSelection);

        if (hasWebinarSelection) {
          update['currentStep'] = Step.BOOK_DETAILS;
        }

        break;

      case Step.BOOK_DETAILS:
        const bookSelection = get(sessionDocument, 'bookOption');

        if (bookSelection) {
          update['currentStep'] = Step.BOOK_DETAILS_WAIT;
        }

        break;
      case Step.DENTIST_GUIDE_DETAILS:
        if (guideOrdered) {
          update['currentStep'] = Step.DONE;
        }
        break;

      case Step.BOOK_DETAILS_WAIT:
        const previousStepResult = get(sessionDocument, [
          'stepResults',
          Step.BOOK_DETAILS,
        ]);

        const draftId = previousStepResult?.description;
        update['draftId'] = draftId;

        const bookData = await this.generateBookService.getStatus(draftId);
        const bookIsReady = bookData.status?.book === GenerateBookStatus.READY;
        const pagesAreReady =
          bookData?.status?.pages === GenerateBookStatus.READY;

        if (bookIsReady && pagesAreReady) {
          update['book'] = bookData;
          update['currentStep'] = Step.YOUR_BOOK; // next step
        }

        break;
      case Step.ORDER_CONFIRMATION:
        await this.afyLoggerService.sendLog({
          customer: {
            email: sessionCustomer?.email ?? 'anon@authorify.com',
            name:
              [sessionCustomer?.firstName, sessionCustomer?.lastName].join(
                ' ',
              ) ?? 'Anonymous',
          },
          source: 'digital-services',
          event: {
            name: 'generated-book',
            namespace: 'onboard',
          },
          trace: uuidv4(),
          tags: [`timestamp:${DateTime.now().toMillis()}`],
        });
        break;
      case Step.YOUR_BOOK:
        break;
      case Step.YOUR_GUIDE:
        break;
      case Step.PLACE_ORDER:
      default:
        if (hasSuccessResult) {
          update['currentStep'] = this.getNextStep(steps, step);
        }
    }
    if (!isEmpty(update)) {
      await this.sessionModel
        .findByIdAndUpdate(sessionDocument.id, update)
        .exec();
    }
    const updatedSession = await this.findSession(
      sessionDocument.id as SessionId,
    );

    try {
      const salesParameters = updatedSession?.salesParameters.salesAgent;
      const orderSystem = updatedSession?.salesParameters.orderSystem;
      const coach = (<CoachDocument>updatedSession?.coach)?.email;
      const tags = [`step:${updatedSession.currentStep}`];
      if (salesParameters && orderSystem) {
        tags.push(`sales-agent:${salesParameters}`);
        tags.push(`order-system:${orderSystem}`);
      }
      if (coach) {
        tags.push(`coach:${coach}`);
      }
      await this.afyLoggerService.sendLog({
        customer: {
          email:
            (<CustomerDocument>updatedSession.customer)?.email ||
            'anon@authorify.com',
          name:
            (<CustomerDocument>updatedSession.customer)?.firstName ||
            'Anonymous',
        },
        event: {
          name: 'step_updated',
          namespace: 'onboard',
        },
        source: 'digital-services',
        trace: uuidv4(),
        tags: tags,
      });
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error('error sending log:', err.stack);
      } else {
        this.logger.error(`error sending log: ${err}`);
      }
    }
    return this.populateSession(updatedSession);
  }

  public async registerPaymentSuccess(
    sessionId: string,
    clientSecret: string,
    reference: string,
    customerEmail: string,
  ): Promise<SessionDocument> {
    this.logger.log(
      {
        payload: <LoggerPayload>{
          customerEmail,
          method: 'registerPaymentSuccess',
          usageDate: DateTime.now(),
          sessionId,
          clientSecret,
          reference,
        },
      },
      CONTEXT_CHARGIFY,
    );
    await this.syncSucccessfulPaymentWithHubspot(sessionId, customerEmail);
    return this.registerPaymentOutcome(
      sessionId,
      clientSecret,
      StepStatus.SUCCESS,
      undefined,
      reference,
    );
  }

  public async registerPaymentFailure(
    sessionId: string,
    clientSecret: string,
    description: string,
  ): Promise<SessionDocument> {
    return this.registerPaymentOutcome(
      sessionId,
      clientSecret,
      StepStatus.ERROR,
      description,
    );
  }

  async isRepeatedWebhookRequest(
    key: string,
    objectType: string | null,
  ): Promise<boolean> {
    const alreadyExists = await this.webhookIdempotencyModel.exists({
      key,
      objectType,
    });
    if (alreadyExists) {
      return true;
    }
    await new this.webhookIdempotencyModel({ key, objectType }).save();
    return false;
  }

  async getScheduleCoachingSlots(
    session: SessionDocument,
    start: string,
    outputTimezone = 'UTC',
  ): Promise<CalendarDtoWithCoach> {
    try {
      let populated = await session.populate(['coach']);
      let coach = populated?.coach as CoachDocument;

      if (!coach) {
        const forceRR = true;
        await this.findAndAssignCoachToSession(session, forceRR);
        populated = await this.sessionModel
          .findById(session.id)
          .populate(['coach'])
          .exec();
        coach = populated?.coach as CoachDocument;
      }

      let slotsData = await this.calendarService.getBusySlots(
        coach.email,
        start,
        outputTimezone,
      );

      let tries = 1;
      const maxTries = await this.coachesService.count();

      while (slotsData.freeTimeSlots.length <= 0 && tries <= maxTries) {
        tries++;
        const declinedCoach = <CoachDocument>populated.coach;
        const updatedSession = await this.sessionService.pushDeclinedCoach(
          session,
          declinedCoach,
        );

        const newCoach = await this.findAndAssignCoachToSession(
          updatedSession,
          true,
        );
        slotsData = await this.calendarService.getBusySlots(
          newCoach.email,
          start,
          outputTimezone,
        );

        coach = newCoach;

        populated = await this.sessionModel
          .findById(session.id)
          .populate(['coach'])
          .exec();
      }

      if (slotsData.freeTimeSlots.length <= 0) {
        throw new NoFreeTimeSlotsException();
      }

      const calendarDtoWithCoach: CalendarDtoWithCoach = {
        ...slotsData,
        coach: {
          name: coach.name,
          image: coach.image,
        },
      };

      return calendarDtoWithCoach;
    } catch (err) {
      this.logger.log(
        { payload: { err, session } },
        CONTEXT_ONBOARD_SCHEDULING_COACHING,
      );

      if (err instanceof NoFreeTimeSlotsException) {
        throw new HttpException(
          {
            message: 'No free timeslots',
            err: err?.message,
            stack: err?.stack,
          },
          HttpStatus.FAILED_DEPENDENCY,
        );
      }

      if (err instanceof NoAvailableCoachesException) {
        throw new HttpException(
          {
            exception: NoAvailableCoachesException.name,
            message: 'Could not find a coach for the session',
            err: err?.message,
            stack: err?.stack,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (err instanceof Error) {
        throw new HttpException(
          {
            message: 'error while getting scheduled coach',
            err: err?.message,
            stack: err?.stack,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async scheduleCoaching(
    session: SessionDocument,
    start: string,
    timezone: string,
  ): Promise<void> {
    const startDate = DateTime.fromISO(start);
    const coachingSelection = {
      selectedTz: timezone,
      utcStart: startDate.toJSDate(),
    };
    const populated = await session.populate(['customer', 'coach', 'offer']);
    const contact = populated.customer as CustomerDocument;
    const coach = populated.coach as CoachDocument;
    const { hubspotId: contactId } = contact;
    const { hubspotId: coachId } = coach;

    /**
     * @description non blocker code block
     */
    try {
      await this.emailRemindersService.deleteAllFromFilter({
        session: <SchemaId>session._id,
      });
      await this.emailRemindersService.sendAllRemindersEmail(
        contact,
        coach,
        session,
        startDate,
        timezone,
      );
    } catch (err) {
      if (err instanceof Error) {
        const errorPayload = <LoggerPayload>{
          message: `Unable to create email reminders for customer: ${contact._id}`,
          error: err?.message,
          // trace: err?.trace,
          usageDate: DateTime.now(),
        };
        this.logger.error({ payload: errorPayload }, '', CONTEXT_ERROR);
      }
    }

    await this.hubspotService.setContactOwnerIfNull(contactId, coachId);

    const key = `stepResults.${Step.SCHEDULE_COACHING}`;
    const status = StepStatus.SUCCESS;
    const timestamp = DateTime.now().toJSDate();
    const stepResult = {
      status,
      timestamp,
    };
    await this.sessionModel
      .findByIdAndUpdate(session.id, { coachingSelection, [key]: stepResult })
      .exec();
    await this.updateDealWithCoachDetails(contact.email);
  }

  async webinarRegistration(
    start: string,
    timezone: string,
    wantsSms: boolean,
    session: SessionDocument,
  ): Promise<void> {
    const customer = session.customer as CustomerDocument;
    const offer = session.offer as OfferDocument;
    const webinarCode = offer.webinar.id;
    const name = `${customer.firstName} ${customer.lastName}`;
    const email = customer.email;
    const smsNumber = wantsSms ? `+1${customer.phone}` : '';

    await this.disService.webinarRegistration(
      webinarCode,
      start,
      name,
      email,
      smsNumber,
    );
    const status = StepStatus.SUCCESS;
    const timestamp = DateTime.now().toJSDate();

    const stepResult = {
      status,
      timestamp,
    };
    const webinarSelection = {
      selectedTz: timezone,
      utcStart: DateTime.fromISO(start, { zone: 'UTC' }).toJSDate(),
    };
    const key = `stepResults.${Step.TRAINING_WEBINAR}`;
    await this.sessionModel
      .findByIdAndUpdate(session.id, { webinarSelection, [key]: stepResult })
      .exec();
  }

  async saveBookDetailsAndGenerateBook(
    dto: BookDetailsDto,
    session: SessionDocument,
  ) {
    const offer = session.offer as OfferDocument;
    const customer = session.customer as CustomerDocument;
    let bookOptions = offer.bookOptions as BookOptionDocument[];
    let nonHeadshotBookOptions =
      offer.nonHeadshotBookOptions as BookOptionDocument[];
    if (
      customer?.billing?.country === 'CA' ||
      customer?.billing?.country === 'Canada'
    ) {
      if (!offer.bookOptionsCA || !offer.nonHeadshotBookOptionsCA) {
        throw new Error('Missing book options for Canada');
      }
      bookOptions = offer.bookOptionsCA as BookOptionDocument[];
      nonHeadshotBookOptions =
        offer.nonHeadshotBookOptionsCA as BookOptionDocument[];
    }
    const selectedBook = dto.book;
    const bookIndex = findIndex(bookOptions, { id: selectedBook });

    const bookOption =
      customer.avatar || !nonHeadshotBookOptions[bookIndex]
        ? bookOptions[bookIndex]
        : nonHeadshotBookOptions[bookIndex];

    const generateBookDto: GenerateBookDto = {
      book: {
        bookId: bookOption.bookId,
        templateId: bookOption.templateId,
        email: dto.email,
        name: dto.name,
        phone: dto.phone,
      },
      email: customer.email,
    };

    if (customer?.avatar) {
      generateBookDto.avatarHeadshot = customer.avatar;
    }

    const draftId = await this.generateBookService.generateBook(
      generateBookDto,
    );
    const customerId = customer.id as CustomerId;
    const updateBookPreferences: UpdateBookPreferencesDto = {
      email: dto.email,
      name: dto.name,
      phone: dto.phone,
    };
    await this.customersService.saveOnboardBookPreferences(
      customerId,
      updateBookPreferences,
    );

    const status = StepStatus.SUCCESS;
    const timestamp = DateTime.now().toJSDate();

    const stepResult = {
      status,
      timestamp,
      description: draftId,
    };
    const key = `stepResults.${Step.BOOK_DETAILS}`;
    await this.sessionModel
      .findByIdAndUpdate(session.id, {
        bookOption: dto.book,
        [key]: stepResult,
      })
      .exec();

    return session;
  }

  async syncSucccessfulPaymentWithHubspot(
    sessionId: string,
    customerEmail: string = null,
  ) {
    /* LOG */
    this.logger.log(
      {
        payload: <LoggerPayload>{
          customerEmail,
          method: 'syncSucccessfulPaymentWithHubspot',
          usageDate: DateTime.now(),
          sessionId,
        },
      },
      CONTEXT_HUBSPOT,
    );
    const sessionDocument = await this.findSession(sessionId);
    const hubspotInfo = await this.hubspotService.getContactDetailsByEmail(
      customerEmail,
    );
    /* LOG */
    this.logger.log(
      {
        payload: <LoggerPayload>{
          customerEmail,
          method: 'syncSucccessfulPaymentWithHubspot',
          usageDate: DateTime.now(),
          hubspotInfo,
          sessionDocument,
        },
      },
      CONTEXT_HUBSPOT,
    );
    const customerHubspotId = (
      customerEmail
        ? hubspotInfo.vid
        : +get(sessionDocument, ['customer', 'hubspotId'])
    ).toString();
    const offer = sessionDocument.offer as OfferDocument;
    const sessionCustomer = sessionDocument.customer as CustomerDocument;

    const bookCredits = get(offer, ['credits']);
    let bookPackages = offer?.packages;
    if (
      sessionCustomer?.billing?.country === 'CA' ||
      sessionCustomer?.billing?.country === 'Canada'
    ) {
      bookPackages = offer?.packagesCA;
    }
    const updateCreditsAndPackagesDto = <UpdateCreditsAndPackagesDto>{
      id: customerHubspotId,
      credits: bookCredits,
      packages: bookPackages,
    };
    /* LOG */
    this.logger.log(
      {
        payload: <LoggerPayload>{
          customerEmail,
          method: 'syncSucccessfulPaymentWithHubspot',
          usageDate: DateTime.now(),
          updateCreditsAndPackagesDto,
        },
      },
      CONTEXT_HUBSPOT,
    );
    await this.chargifyWebhookActivity(
      customerEmail,
      { event: Events.BOOK_CREDITS_UPDATE },
      updateCreditsAndPackagesDto,
    );
    await this.hubspotService.updateCreditsAndPackages(
      updateCreditsAndPackagesDto,
      offer.accountType,
    );
  }

  async handleDeleteSubscription(subscription: Subscription) {
    const subscriptionId = get(subscription, ['id']);
    const newDate = new Date();
    const date = newDate.setUTCHours(0, 0, 0, 0);
    const deal = await this.hubspotService.getDealBySubscriptionId(
      subscriptionId,
    );
    const dealId = get(deal, ['id']);
    const customerEmail = get(subscription, ['customer', 'email']);
    const hubspotCustomer = await this.hubspotService.getContactDetailsByEmail(
      customerEmail,
    );
    const vid = hubspotCustomer.vid.toString();
    if (get(deal, 'properties.status') === 'duplicate') {
      return;
    }
    const activeDeals: hubspot.dealsModels.CollectionResponseWithTotalSimplePublicObjectForwardPaging =
      await this.hubspotService.findActiveDealsByEmail(customerEmail);
    const numberOfActiveDeals = activeDeals?.total;
    const lifeCycle = numberOfActiveDeals ? 'customer' : 'subscriber';

    /** lifecyclestage property can only go one way therefore we set it to empty then set the value we need */

    const resetLifecycleStage = {
      properties: {
        lifecyclestage: '',
      },
      json: true,
    };

    const setLifecycleStage = {
      properties: {
        lifecyclestage: lifeCycle,
      },
      json: true,
    };

    /** Update contact lifecycle stage*/
    await this.hubspotService.updateContactById(vid, resetLifecycleStage);
    await this.hubspotService.updateContactById(vid, setLifecycleStage);

    /** Update Deal  */

    const objectInput = {
      properties: {
        cancelled_date: date.toString(),
        status: 'Cancelled',
      },
    };
    const canceledSubscription = {
      properties: {
        cancelled_date: date.toString(),
        status: 'Cancelled',
      },
      dealId,
    };
    await this.chargifyWebhookActivity(
      customerEmail,
      { event: Events.DEAL_UPDATE },
      canceledSubscription,
    );
    await this.hubspotService.updateDeal(dealId, objectInput);
  }

  async addCustomerToWorkFlow(
    customer: CustomerDocument,
    offer: OfferDocument,
    currentStep: string,
  ) {
    const workFlowIds = offer?.workFlow?.[currentStep] as string[] | undefined;
    if (workFlowIds) {
      const promises = workFlowIds.map((workFlowId) => {
        this.disService.addCustomerToWorkFlow(customer.email, workFlowId);
      });
      await Promise.all(promises);
    }
  }

  public getOnboardLeads(Customer: CustomerDocument) {
    const { email: customerEmail } = Customer;
    const filter = {
      isValid: { $eq: true },
      unsubscribed: { $eq: false },
      customerEmail: { $eq: customerEmail },
    };
    return this.leadsService.getAllFromFilter(filter);
  }

  public async handleBookCredit(
    productData: ProductDocument,
    subscription: Subscription,
  ): Promise<void> {
    /* LOG */
    const customerData = subscription.customer;
    const payload = <LoggerPayload>{
      usageDate: DateTime.now(),
      method: 'handleBookCredit',
      productData,
      customerData,
      subscription,
    };
    this.logger.log({
      payload: <LoggerPayload>{
        method: 'handleBookCredit',
        usageDate: DateTime.now(),
        ...payload,
      },
      CONTEXT_BOOK_CREDIT,
    });
    const subscriptionActivatedAt = subscription?.activated_at;
    const subscriptionCurrentPeriodStartedAt =
      subscription?.current_period_started_at;

    this.logger.log(
      {
        payload: <LoggerPayload>{
          method: 'handleBookCredit',
          usageDate: DateTime.now(),
          message: 'compareChargifyDates.',
          subscriptionActivatedAt,
          subscriptionCurrentPeriodStartedAt,
        },
      },
      CONTEXT_BOOK_CREDIT,
    );
    const isValidForCreditsOnce =
      compareChargifyDates(
        subscriptionActivatedAt,
        subscriptionCurrentPeriodStartedAt,
      ) && Number(productData.creditsOnce) > 0;

    if (Number(productData.creditsRecur) > 0 || isValidForCreditsOnce) {
      try {
        const hubspotCustomer =
          await this.hubspotService.getContactDetailsByEmail(
            customerData.email,
          );

        const creditsPropertyName =
          productData.productProperty === HubspotProductProperty.DENTIST_PRODUCT
            ? 'dentist_guide_credits'
            : 'afy_book_credits';

        /* LOG */
        this.logger.log(
          { email: customerData.email, hubspotCustomer },
          CONTEXT_BOOK_CREDIT,
        );

        let existingBookCredit = Number(
          get(hubspotCustomer, ['properties', creditsPropertyName, 'value'], 0),
        );

        if (isValidForCreditsOnce) {
          existingBookCredit =
            existingBookCredit + Number(productData.creditsOnce);
          /* LOG */
          this.logger.log(
            {
              payload: <LoggerPayload>{
                email: customerData.email,
                onceBookCredit: productData.creditsOnce,
                usageDate: DateTime.now(),
              },
            },
            CONTEXT_BOOK_CREDIT,
          );
        }
        /* LOG */
        this.logger.log(
          { email: customerData.email, existingBookCredit },
          CONTEXT_BOOK_CREDIT,
        );
        const recurringBookCredit: number = productData.creditsRecur;
        /* LOG */
        this.logger.log(
          { email: customerData.email, recurringBookCredit },
          CONTEXT_BOOK_CREDIT,
        );

        const newCredits: number = existingBookCredit + recurringBookCredit;
        const reqBody = {
          properties: {
            [creditsPropertyName]: newCredits.toString(),
          },
        };
        const vid = hubspotCustomer.vid.toString();
        /* LOG */
        this.logger.log(
          { email: customerData.email, vid, reqBody },
          CONTEXT_BOOK_CREDIT,
        );
        const webhookBookCredit = {
          recurringBookCredit,
          existingBookCredit,
          reqBody,
        };
        await this.chargifyWebhookActivity(
          customerData.email,
          { event: Events.BOOK_CREDITS_ADD },
          webhookBookCredit,
        );
        /** Update book credit property */
        await this.hubspotService.updateContactById(vid, reqBody);
      } catch (err) {
        if (err instanceof Error) {
          /* LOG */
          const errorPayload = <LoggerPayload>{
            email: customerData.email,
            message: `Unable to update book credit for user`,
            error: err?.message,
            // trace: err?.trace,
            usageDate: DateTime.now(),
          };
          this.logger.error({ payload: errorPayload }, '', CONTEXT_BOOK_CREDIT);
        }
      }
    }
  }

  async updateHubspotDeal(
    eventId: string | number,
    subscription: Subscription,
    component: Component,
    lastPaymentDate?: string,
  ): Promise<SimplePublicObject> {
    console.info({ eventId, subscription });
    const deal = await this.hubspotService.getDealBySubscriptionId(
      subscription.id,
    );

    console.info({ deal });

    if (!deal) {
      // Create a deal
      return this.createHubspotDeal(eventId, subscription, lastPaymentDate);
    }
    const subscriptionDetails =
      await this.paymentChargifyService.findSubscriptionById(
        subscription.id.toString(),
      );

    this.logger.log(
      {
        payload: <LoggerPayload>{
          usageDate: DateTime.now(),
          subscriptionDetails,
        },
      },
      CONTEXT_ON_BOARD_DEAL,
    );

    const chargifyProductId = component.id;

    console.info({ chargifyProductId });

    const productData = await this.productsService.findProductByChargifyId(
      chargifyProductId.toString(),
    );

    console.info({ productData });

    if (!productData) {
      console.info('If not productData');
      const chargifyProductMessage = 'Chargify Product not found';
      const productNotFoundPayload = {
        eventId,
        data: { chargifyProductId },
        message: chargifyProductMessage,
        usageDate: DateTime.now(),
      };
      console.error({ payload: productNotFoundPayload });

      this.logger.log(
        { payload: productNotFoundPayload },
        CONTEXT_ON_BOARD_DEAL,
      );

      // status 200 to avoid stripe to retry the webhook
      throw new HttpException({ message: chargifyProductMessage }, 200);
    }
    const hubspotProduct = await this.hubspotService.findProductByChargifyId(
      chargifyProductId.toString(),
    );
    console.info({ hubspotProduct });

    if (!hubspotProduct) {
      console.info('If not hubspotProduct');
      const hubspotProductMessage = 'Hubspot Product not found';
      const productNotFoundPayload = {
        eventId,
        data: { name: productData.title },
        message: hubspotProductMessage,
        usageDate: DateTime.now(),
      };
      console.error({ payload: productNotFoundPayload });

      this.logger.log(
        { payload: productNotFoundPayload },
        CONTEXT_ON_BOARD_DEAL,
      );

      // status 200 to avoid stripe to retry the webhook
      throw new HttpException({ message: hubspotProductMessage }, 200);
    }

    const updatedDeal = await this.hubspotService.updateNewComponentDeal(
      deal.id,
      subscriptionDetails.subscription,
      productData,
      lastPaymentDate,
    );
    const customerEmail = get(subscription, ['customer', 'email']);
    await this.chargifyWebhookActivity(
      customerEmail,
      { event: Events.DEAL_UPDATE },
      updatedDeal,
    );
    const properties = {
      email: <string>get(subscriptionDetails, 'customer.email'),
      planName: component.name,
    };

    return {
      id: deal.id,
      properties,
      createdAt: deal.createdAt,
      updatedAt: deal.updatedAt,
    };
  }

  getLastUpdatedDate(lastPaymentDate?: string): string {
    return !lastPaymentDate
      ? DateTime.now().toFormat('yyyy-LL-dd')
      : dateStringToHSDate(lastPaymentDate);
  }

  async createHubspotDeal(
    eventId: string | number,
    subscription: Subscription,
    lastPaymentDate?: string,
    componentId?: number,
    sessionId?: string,
  ): Promise<SimplePublicObject> {
    const subscriptionId = subscription.id;

    const deal = await this.hubspotService.getDealBySubscriptionId(
      subscriptionId,
    );
    const customerObject = subscription.customer;
    const customerEmail = customerObject.email;

    const allocatedComponents =
      await this.paymentChargifyService.getAllAllocatedComponentsFromSubscription(
        subscription,
      );
    const componentDetails = first<SubscriptionComponent>(allocatedComponents);

    const chargifyProductId = get(componentDetails, ['component_id']);

    const productData = await this.productsService.findProductByChargifyId(
      chargifyProductId.toString(),
    );

    if (!productData) {
      const chargifyProductMessage = 'Chargify Product not found';
      const productNotFoundPayload: LoggerPayload = {
        usageDate: DateTime.now(),
        subcontext: CONTEXT_ON_BOARD_DEAL,
        eventId,
        email: subscription.customer.email,
        data: { chargifyProductId },
        message: chargifyProductMessage,
        method: 'OnboardService@createHubspotDeal',
      };

      this.logger.error(
        {
          payload: productNotFoundPayload,
        },
        '',
        CONTEXT_ERROR,
      );

      throw new HttpException({ message: chargifyProductMessage }, 200);
    }

    let productForCredits = productData;

    if (componentId) {
      productForCredits = await this.productsService.findProductByChargifyId(
        componentId.toString(),
      );
    }

    if (deal) {
      // update an existing deal with last payment date
      lastPaymentDate = this.getLastUpdatedDate(lastPaymentDate);

      // update an existing deal with next recurring date
      const nextRecurringDate = convertToHSDate(
        subscription.current_period_ends_at,
      );

      return this.hubspotService.updateLastPaymentDateWithNextRecurringDateDeal(
        deal.id,
        lastPaymentDate,
        nextRecurringDate,
      );
    }

    // add a customer to hubspot list
    if (productForCredits?.hubspotListId) {
      const enrollContact =
        await this.hubspotSyncActionsServices.enrollContactToList(
          subscription.customer.email,
          productForCredits.hubspotListId,
        );

      await this.hubspotQueue.add(enrollContact, { delay: 1000 * 60 });
    }

    const hubspotProduct = await this.hubspotService.findProductByChargifyId(
      chargifyProductId.toString(),
    );

    if (!hubspotProduct) {
      const hubspotProductMessage = 'Hubspot Product not found';
      /* LOG */
      const productNotFoundPayload = {
        eventId,
        email: subscription.customer.email,
        method: 'createHubspotDeal',
        data: {
          name: productData.title,
          chargifyProductId: chargifyProductId.toString(),
        },
        message: hubspotProductMessage,
      };
      /* LOG */
      this.logger.error(
        {
          payload: <LoggerPayload>{
            usageDate: DateTime.now(),
            subcontext: CONTEXT_ON_BOARD_DEAL,
            email: subscription.customer.email,
            method: 'createHubspotDeal',
            productNotFoundPayload,
          },
        },
        '',
        CONTEXT_ERROR,
      );

      // status 200 to avoid to retry the webhook
      throw new HttpException({ message: hubspotProductMessage }, 200);
    }

    let offerName = '';
    if (sessionId) {
      const offer = await this.findOfferBySession(sessionId);
      offerName = get(offer, ['title']);
    }

    const createdDeal = await this.hubspotService.createSubscriptionDeal(
      subscription,
      customerObject,
      productData,
      lastPaymentDate,
      offerName,
    );

    const customer = await this.customersService.findByEmail(customerEmail);
    const data = {
      customer: customer,
      event: Events.DEAL_CREATE,
      metadata: { createdDeal },
    };

    await Promise.all([
      this.customerEventsService.createEvent(customer, data),
      this.chargifyWebhookActivity(
        customerEmail,
        { event: Events.DEAL_CREATE },
        createdDeal,
      ),
    ]);

    const lineItemDto: LineItemDto = {
      name: hubspotProduct.properties.name,
      hs_product_id: hubspotProduct.id,
      quantity: '1',
    };

    const findMetadata =
      await this.paymentChargifyService.getMetadataForResource(
        'subscriptions',
        subscription?.id,
      );

    if (findMetadata?.metadata?.length === 0) {
      const user = await this.hubspotService.getContactDetailsByEmail(
        subscription.customer.email,
      );
      const updateCreditsAndPackagesDto = {
        id: user.vid.toString(),
        credits: productData.creditsOnce
          ? productData.creditsOnce
          : productData.creditsRecur,
        packages: [productData.bookPackages],
      };
      await this.hubspotService.updateCreditsAndPackages(
        updateCreditsAndPackagesDto,
        productData.productProperty,
      );
    }
    const createdLineItem = await this.hubspotService.createLineItem(
      lineItemDto,
    );

    await this.hubspotService.associateLineItemToDeal(
      createdLineItem.id,
      createdDeal.id,
    );

    await this.hubspotService.getContactId(customerEmail);
    /* LOG */

    const associateDealSyncAction =
      await this.hubspotSyncActionsServices.associateDeal(
        customerEmail,
        createdDeal.id,
      );

    // try to associate deal to contact after 1 minute
    await this.hubspotQueue.add(associateDealSyncAction, { delay: 1000 * 60 });

    const properties = {
      email: customerEmail,
      planName: componentDetails.name,
    };

    return {
      id: createdDeal.id,
      properties,
      createdAt: createdDeal.createdAt,
      updatedAt: createdDeal.updatedAt,
    };
  }

  async getOnboardMetrics(startDate: string, endDate: string) {
    let filterQuery = {};
    let salesCountFilter = {};
    let bookGeneratedFilter = {};
    if (startDate && endDate) {
      filterQuery = {
        createdAt: {
          $gte: DateTime.fromISO(startDate, {
            zone: DEFAULT_TIMEZONE,
          }).startOf('day'),
          $lte: DateTime.fromISO(endDate, {
            zone: DEFAULT_TIMEZONE,
          }).endOf('day'),
        },
      };
      salesCountFilter = {
        $and: [
          filterQuery,
          {
            currentStep: {
              $nin: [
                Step.PLACE_ORDER_WAIT,
                Step.PLACE_ORDER,
                Step.SCHEDULE_COACHING,
              ],
            },
          },
        ],
      };
      bookGeneratedFilter = {
        $and: [
          filterQuery,
          {
            currentStep: { $eq: Step.YOUR_BOOK },
          },
        ],
      };
    }

    const [
      visitsCount,
      paidSalesCount,
      bookGeneratedCount,
      cancellationCount,
      autoLoginCount,
    ] = await Promise.all([
      this.sessionModel.countDocuments(filterQuery).exec(),
      this.sessionModel.countDocuments(salesCountFilter).exec(),
      this.sessionModel.countDocuments(bookGeneratedFilter).exec(),
      this.sessionModel
        .aggregate([
          {
            $match: {
              ...filterQuery,
              currentStep: { $ne: Step.PLACE_ORDER },
            },
          },
          {
            $lookup: {
              from: 'ds__customers_subscriptions',
              localField: 'customer',
              foreignField: 'customer',
              as: 'customerStatus',
            },
          },
          {
            $unwind: {
              path: '$customerStatus',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              'customerStatus.status': { $eq: 'canceled' },
            },
          },
          {
            $project: {
              customerStatus: { status: 1, updatedAt: 1 },
            },
          },
        ])
        .read('secondaryPreferred', [{ nodeType: NODE_TYPES.ANALYTICS }]),
      this.sessionModel
        .aggregate([
          {
            $match: {
              ...filterQuery,
              currentStep: { $ne: Step.PLACE_ORDER },
            },
          },
          {
            $lookup: {
              from: 'ds__customer_events',
              localField: 'customer',
              foreignField: 'customer',
              as: 'customerEvents',
            },
          },
          {
            $addFields: {
              customerEvents: {
                $first: '$customerEvents',
              },
            },
          },
          {
            $match: {
              'customerEvents.event': { $eq: 'auto-login-success' },
            },
          },
          {
            $project: {
              customerEvents: { event: 1 },
            },
          },
        ])
        .read('secondaryPreferred', [{ nodeType: NODE_TYPES.ANALYTICS }]),
    ]);

    return {
      VisitsCount: visitsCount,
      PaidSalesCount: paidSalesCount,
      BookGeneratedCount: bookGeneratedCount,
      CancellationCount: cancellationCount.length,
      AutoLoginCount: autoLoginCount.length,
    };
  }

  //TODO: don't use this function until we refactor hubspot/chargify calls
  async getHubspotDealDetailsBySubscription(onBoardSales) {
    for (const session of onBoardSales as SessionOnboardSales[]) {
      try {
        const subscriptions =
          session?.customerInfo?.email &&
          (await this.paymentChargifyService.getAllActiveSubscriptionsFromCustomerEmail(
            session?.customerInfo?.email,
          ));

        if (!isEmpty(subscriptions)) {
          const subscription = first<Subscription>(subscriptions);
          const deal = await this.hubspotService.getDealBySubscriptionId(
            Number(subscription?.id),
          );
          session.dealDetails = {
            dealId: deal?.id,
            dealExists: !!deal,
            email: session?.customerInfo?.email,
          };
        }
      } catch (error) {
        if (error instanceof Error) {
          throw new HttpException(
            { message: error.message },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
      // runs with 3 seconds delay to avoid hubspot rate limit
      await sleep(3000);
    }
    return onBoardSales as SessionOnboardSales[];
  }

  async getOnboardMetricsByPaidSales(
    page: number,
    perPage: number,
    startDate: string,
    endDate: string,
  ): Promise<SalesReportResponseDto> {
    let filterQuery = {};
    if (startDate && endDate) {
      filterQuery = {
        createdAt: {
          $gte: DateTime.fromISO(startDate, {
            zone: DEFAULT_TIMEZONE,
          }).startOf('day'),
          $lte: DateTime.fromISO(endDate, {
            zone: DEFAULT_TIMEZONE,
          }).endOf('day'),
        },
        currentStep: { $ne: Step.PLACE_ORDER },
      };
    }
    const skip = page * perPage;

    const [paidSalesCount, onBoardSalesReport] = await Promise.all([
      this.sessionService.onboardSalesReportCount(filterQuery),
      this.sessionService.onboardSalesReport(filterQuery, skip, perPage),
    ]);

    return {
      SalesDetails: PaginatorSchema.build(
        paidSalesCount,
        onBoardSalesReport,
        page,
        perPage,
      ),
    };
  }

  async getOnboardMetricsByUniqueVisits(
    page: number,
    perPage: number,
    startDate: string,
    endDate: string,
  ): Promise<SalesReportResponseDto> {
    let filterQuery = {};
    if (startDate && endDate) {
      filterQuery = {
        createdAt: {
          $gte: DateTime.fromISO(startDate, {
            zone: DEFAULT_TIMEZONE,
          }).startOf('day'),
          $lte: DateTime.fromISO(endDate, {
            zone: DEFAULT_TIMEZONE,
          }).endOf('day'),
        },
      };
    }
    const skip = page * perPage;
    const [visitsCount, onBoardSalesReport] = await Promise.all([
      this.sessionModel.countDocuments(filterQuery).exec(),
      this.sessionModel
        .aggregate([
          {
            $match: {
              ...filterQuery,
            },
          },
          {
            $lookup: {
              from: 'ds__customers',
              localField: 'customer',
              foreignField: '_id',
              as: 'customerInfo',
            },
          },
          {
            $unwind: {
              path: '$customerInfo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'ds__onboard__offers',
              localField: 'offer',
              foreignField: '_id',
              as: 'offerDetails',
            },
          },
          {
            $unwind: {
              path: '$offerDetails',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'ds__customers_subscriptions',
              localField: 'customer',
              foreignField: 'customer',
              as: 'customerStatus',
            },
          },
          {
            $unwind: {
              path: '$customerStatus',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'ds__customer_events',
              localField: 'customer',
              foreignField: 'customer',
              as: 'customerEvents',
            },
          },
          {
            $addFields: {
              customerEvents: {
                $first: '$customerEvents',
              },
            },
          },
          {
            $lookup: {
              from: 'ds__coaches',
              localField: 'coach',
              foreignField: '_id',
              as: 'coachInfo',
            },
          },
          {
            $unwind: {
              path: '$coachInfo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $sort: { createdAt: -1 },
          },
          {
            $project: {
              createdAt: 1,
              updatedAt: 1,
              customerInfo: {
                firstName: 1,
                lastName: 1,
                email: 1,
                stripeId: 1,
                billing: 1,
              },
              offerDetails: { title: 1, trial: 1, code: 1 },
              customerStatus: { status: 1, updatedAt: 1, subscriptionId: 1 },
              customerEvents: { event: 1 },
              marketingParameters: 1,
              salesParameters: 1,
              currentStep: 1,
              coachingSelection: 1,
              customer: 1,
              coachInfo: { name: 1, email: 1 },
            },
          },
        ])
        .read('secondaryPreferred', [{ nodeType: NODE_TYPES.ANALYTICS }])
        .skip(skip)
        .limit(perPage)
        .exec(),
    ]);

    const onBoardReportWithPagination = PaginatorSchema.build(
      visitsCount,
      onBoardSalesReport,
      page,
      perPage,
    );
    return {
      SalesDetails: onBoardReportWithPagination,
    };
  }

  async getOnboardMetricsByBooks(
    page: number,
    perPage: number,
    startDate: string,
    endDate: string,
  ): Promise<SalesReportResponseDto> {
    let filterQuery = {};
    if (startDate && endDate) {
      filterQuery = {
        createdAt: {
          $gte: DateTime.fromISO(startDate, {
            zone: DEFAULT_TIMEZONE,
          }).startOf('day'),
          $lte: DateTime.fromISO(endDate, {
            zone: DEFAULT_TIMEZONE,
          }).endOf('day'),
        },
        currentStep: { $eq: Step.YOUR_BOOK },
      };
    }
    const skip = page * perPage;

    const [booksCount, onBoardSalesReport] = await Promise.all([
      this.sessionModel.countDocuments(filterQuery).exec(),
      this.sessionModel
        .aggregate([
          {
            $match: {
              ...filterQuery,
            },
          },
          {
            $lookup: {
              from: 'ds__customers',
              localField: 'customer',
              foreignField: '_id',
              as: 'customerInfo',
            },
          },
          {
            $unwind: {
              path: '$customerInfo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'ds__onboard__offers',
              localField: 'offer',
              foreignField: '_id',
              as: 'offerDetails',
            },
          },
          {
            $unwind: {
              path: '$offerDetails',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'ds__customers_subscriptions',
              localField: 'customer',
              foreignField: 'customer',
              as: 'customerStatus',
            },
          },
          {
            $unwind: {
              path: '$customerStatus',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'ds__customer_events',
              localField: 'customer',
              foreignField: 'customer',
              as: 'customerEvents',
            },
          },
          {
            $addFields: {
              customerEvents: {
                $first: '$customerEvents',
              },
            },
          },
          {
            $lookup: {
              from: 'ds__coaches',
              localField: 'coach',
              foreignField: '_id',
              as: 'coachInfo',
            },
          },
          {
            $unwind: {
              path: '$coachInfo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $sort: { createdAt: -1 },
          },
          {
            $project: {
              createdAt: 1,
              updatedAt: 1,
              customerInfo: {
                firstName: 1,
                lastName: 1,
                email: 1,
                stripeId: 1,
                billing: 1,
              },
              offerDetails: { title: 1, trial: 1, code: 1 },
              customerStatus: { status: 1, updatedAt: 1 },
              customerEvents: { event: 1 },
              marketingParameters: 1,
              salesParameters: 1,
              currentStep: 1,
              coachingSelection: 1,
              customer: 1,
              coachInfo: { name: 1, email: 1 },
            },
          },
        ])
        .read('secondaryPreferred', [{ nodeType: NODE_TYPES.ANALYTICS }])
        .skip(skip)
        .limit(perPage),
    ]);

    const onBoardReportWithPagination = PaginatorSchema.build(
      booksCount,
      onBoardSalesReport,
      page,
      perPage,
    );
    return {
      SalesDetails: onBoardReportWithPagination,
    };
  }

  async getOnboardMetricsByAutoLogin(
    page: number,
    perPage: number,
    startDate: string,
    endDate: string,
  ): Promise<SalesReportResponseDto> {
    let filterQuery = {};
    if (startDate && endDate) {
      filterQuery = {
        createdAt: {
          $gte: DateTime.fromISO(startDate, {
            zone: DEFAULT_TIMEZONE,
          }).startOf('day'),
          $lte: DateTime.fromISO(endDate, {
            zone: DEFAULT_TIMEZONE,
          }).endOf('day'),
        },
      };
    }
    const skip = page * perPage;

    const [onBoardSalesReport, autoLoginCount] = await Promise.all([
      this.sessionModel
        .aggregate([
          {
            $match: {
              ...filterQuery,
            },
          },
          {
            $lookup: {
              from: 'ds__customers',
              localField: 'customer',
              foreignField: '_id',
              as: 'customerInfo',
            },
          },
          {
            $unwind: {
              path: '$customerInfo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'ds__onboard__offers',
              localField: 'offer',
              foreignField: '_id',
              as: 'offerDetails',
            },
          },
          {
            $unwind: {
              path: '$offerDetails',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'ds__customers_subscriptions',
              localField: 'customer',
              foreignField: 'customer',
              as: 'customerStatus',
            },
          },
          {
            $unwind: {
              path: '$customerStatus',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'ds__customer_events',
              localField: 'customer',
              foreignField: 'customer',
              as: 'customerEvents',
            },
          },
          {
            $addFields: {
              customerEvents: {
                $first: '$customerEvents',
              },
            },
          },
          {
            $lookup: {
              from: 'ds__coaches',
              localField: 'coach',
              foreignField: '_id',
              as: 'coachInfo',
            },
          },
          {
            $unwind: {
              path: '$coachInfo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $sort: { createdAt: -1 },
          },
          {
            $project: {
              createdAt: 1,
              updatedAt: 1,
              customerInfo: {
                firstName: 1,
                lastName: 1,
                email: 1,
                stripeId: 1,
                billing: 1,
              },
              offerDetails: { title: 1, trial: 1, code: 1 },
              customerStatus: { status: 1, updatedAt: 1 },
              customerEvents: { event: 1 },
              marketingParameters: 1,
              salesParameters: 1,
              currentStep: 1,
              coachingSelection: 1,
              customer: 1,
              coachInfo: { name: 1, email: 1 },
            },
          },
        ])
        .read('secondaryPreferred', [{ nodeType: NODE_TYPES.ANALYTICS }])
        .skip(skip)
        .limit(perPage),
      this.sessionModel
        .aggregate([
          {
            $match: {
              ...filterQuery,
              currentStep: { $ne: Step.PLACE_ORDER },
            },
          },
          {
            $lookup: {
              from: 'ds__customer_events',
              localField: 'customer',
              foreignField: 'customer',
              as: 'customerEvents',
            },
          },
          {
            $addFields: {
              customerEvents: {
                $first: '$customerEvents',
              },
            },
          },
          {
            $match: {
              'customerEvents.event': { $eq: 'auto-login-success' },
            },
          },
          {
            $project: {
              customerEvents: { event: 1 },
            },
          },
        ])
        .read('secondaryPreferred', [{ nodeType: NODE_TYPES.ANALYTICS }]),
    ]);

    const onBoardReportWithPagination = PaginatorSchema.build(
      autoLoginCount.length,
      onBoardSalesReport,
      page,
      perPage,
    );
    return {
      SalesDetails: onBoardReportWithPagination,
    };
  }

  async getOnboardMetricsByCancellations(
    page: number,
    perPage: number,
    startDate: string,
    endDate: string,
  ): Promise<SalesReportResponseDto> {
    let filterQuery = {};
    if (startDate && endDate) {
      filterQuery = {
        createdAt: {
          $gte: DateTime.fromISO(startDate, {
            zone: DEFAULT_TIMEZONE,
          }).startOf('day'),
          $lte: DateTime.fromISO(endDate, {
            zone: DEFAULT_TIMEZONE,
          }).endOf('day'),
        },
        currentStep: { $ne: Step.PLACE_ORDER },
      };
    }
    const skip = page * perPage;

    const [onBoardSalesReport, cancellationCount] = await Promise.all([
      this.sessionModel
        .aggregate([
          {
            $match: {
              ...filterQuery,
            },
          },
          {
            $lookup: {
              from: 'ds__customers',
              localField: 'customer',
              foreignField: '_id',
              as: 'customerInfo',
            },
          },
          {
            $unwind: {
              path: '$customerInfo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'ds__onboard__offers',
              localField: 'offer',
              foreignField: '_id',
              as: 'offerDetails',
            },
          },
          {
            $unwind: {
              path: '$offerDetails',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'ds__customers_subscriptions',
              localField: 'customer',
              foreignField: 'customer',
              as: 'customerStatus',
            },
          },
          {
            $unwind: {
              path: '$customerStatus',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'ds__customer_events',
              localField: 'customer',
              foreignField: 'customer',
              as: 'customerEvents',
            },
          },
          {
            $addFields: {
              customerEvents: {
                $first: '$customerEvents',
              },
            },
          },
          {
            $lookup: {
              from: 'ds__coaches',
              localField: 'coach',
              foreignField: '_id',
              as: 'coachInfo',
            },
          },
          {
            $unwind: {
              path: '$coachInfo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $sort: { createdAt: -1 },
          },
          {
            $project: {
              createdAt: 1,
              updatedAt: 1,
              customerInfo: {
                firstName: 1,
                lastName: 1,
                email: 1,
                stripeId: 1,
                billing: 1,
              },
              offerDetails: { title: 1, trial: 1, code: 1 },
              customerStatus: { status: 1, updatedAt: 1 },
              customerEvents: { event: 1 },
              marketingParameters: 1,
              salesParameters: 1,
              currentStep: 1,
              coachingSelection: 1,
              customer: 1,
              coachInfo: { name: 1, email: 1 },
            },
          },
        ])
        .read('secondaryPreferred', [{ nodeType: NODE_TYPES.ANALYTICS }])
        .skip(skip)
        .limit(perPage),
      this.sessionModel
        .aggregate([
          {
            $match: {
              ...filterQuery,
              currentStep: { $ne: Step.PLACE_ORDER },
            },
          },
          {
            $lookup: {
              from: 'ds__customers',
              localField: 'customer',
              foreignField: '_id',
              as: 'customerInfo',
            },
          },
          {
            $unwind: {
              path: '$customerInfo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'ds__onboard__offers',
              localField: 'offer',
              foreignField: '_id',
              as: 'offerDetails',
            },
          },
          {
            $unwind: {
              path: '$offerDetails',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'ds__customers_subscriptions',
              localField: 'customer',
              foreignField: 'customer',
              as: 'customerStatus',
            },
          },
          {
            $unwind: {
              path: '$customerStatus',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              'customerStatus.status': { $eq: 'canceled' },
            },
          },
          {
            $project: {
              customerStatus: { status: 1, updatedAt: 1 },
            },
          },
        ])
        .read('secondaryPreferred', [{ nodeType: NODE_TYPES.ANALYTICS }]),
    ]);

    const onBoardReportWithPagination = PaginatorSchema.build(
      cancellationCount.length,
      onBoardSalesReport,
      page,
      perPage,
    );
    return {
      SalesDetails: onBoardReportWithPagination,
    };
  }

  async getSearchSuggestions(filter: SearchSuggestionsDto): Promise<string[]> {
    const [[nestedField, keyword]] = <[string, string][]>Object.entries(filter);
    const field = nestedField.split('.')[1];
    if (!field) {
      this.logger.log(
        {
          payload: <LoggerPayload>{
            filter,
            method: 'getSearchSuggestions',
            usageDate: DateTime.now(),
          },
        },
        CONTEXT_ONBOARD_METRICS,
      );
      throw new HttpException('Field is required.', HttpStatus.BAD_REQUEST);
    }
    const limit = 100;
    if (nestedField.startsWith('customerInfo')) {
      return this.customersService.searchUniqueField(keyword, field, limit);
    }

    if (nestedField.startsWith('coachInfo')) {
      return this.coachesService.searchUniqueField(keyword, field, limit);
    }

    if (nestedField.startsWith('offerDetails')) {
      return this.offersService.searchUniqueField(keyword, field, limit);
    }

    if (nestedField.startsWith('marketingParameters')) {
      return this.sessionService.searchUniqueField(keyword, nestedField, limit);
    }

    return [];
  }

  // TODO: increasing complexity to improve performance for now... need refactor
  async getOnboardMetricsByFilter(
    page: number,
    perPage: number,
    filter: OnboardMetricsDto,
    startDate: string,
    endDate: string,
  ) {
    const props: Partial<keyof OnboardMetricsDto>[] = [
      'marketingParameters.channel',
      'marketingParameters.utmSource',
      'marketingParameters.utmMedium',
      'marketingParameters.utmContent',
      'marketingParameters.utmTerm',
      'marketingParameters.affiliateId',
      'salesParameters.orderSystem',
      'salesParameters.salesAgent',
    ];

    const escapeString = (str: string) => {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const match: FilterQuery<SessionDocument> = {
      customer: {
        $ne: null,
      },
    };

    props.forEach((prop) => {
      if (filter[prop]) {
        match[prop] = {
          $in: filter[prop].map(
            (keyword) => new RegExp(escapeString(keyword), 'i'),
          ),
        };
      }
    });

    if (filter['coachInfo.email'] || filter['coachInfo.name']) {
      const or: FilterQuery<CoachDocument>[] = [];

      if (filter['coachInfo.email']?.length > 0) {
        filter['coachInfo.email'].forEach((email) => {
          or.push({ email: new RegExp(escapeString(email), 'i') });
        });
      }

      if (filter['coachInfo.name']?.length > 0) {
        filter['coachInfo.name'].forEach((name) => {
          or.push({ name: new RegExp(escapeString(name), 'i') });
        });
      }

      const coach = await this.coachesService.filter({
        $or: or,
      });
      if (coach.length == 0) {
        return {
          SalesDetails: PaginatorSchema.build(0, [], page, perPage),
        };
      }
      match['coach'] = {
        $in: coach.map(({ _id }) => _id),
      };
    }

    if (
      filter['customerInfo.email'] ||
      filter['customerInfo.firstName'] ||
      filter['customerInfo.lastName']
    ) {
      const or: FilterQuery<CustomerDocument>[] = [];

      if (filter['customerInfo.email']?.length > 0) {
        filter['customerInfo.email'].forEach((email) => {
          or.push({
            email: new RegExp(escapeString(email), 'i'),
          });
        });
      }
      if (filter['customerInfo.firstName']?.length > 0) {
        filter['customerInfo.firstName'].forEach((firstName) => {
          or.push({ firstName: new RegExp(escapeString(firstName), 'i') });
        });
      }
      if (filter['customerInfo.lastName']?.length > 0) {
        filter['customerInfo.lastName'].forEach((lastName) => {
          or.push({ lastName: new RegExp(escapeString(lastName), 'i') });
        });
      }

      const customer = await this.customersService.findAll({
        $or: or,
      });
      if (customer.length == 0) {
        return {
          SalesDetails: PaginatorSchema.build(0, [], page, perPage),
        };
      }
      match['customer'] = {
        $in: customer.map(({ _id }) => _id),
      };
    }

    if (filter['offerDetails.title']?.length > 0) {
      const offer = await this.offersService.findAll({
        title: {
          $in: filter['offerDetails.title'].map(
            (keyword) => new RegExp(escapeString(keyword), 'i'),
          ),
        },
      });
      if (offer.length == 0) {
        return {
          SalesDetails: PaginatorSchema.build(0, [], page, perPage),
        };
      }
      match['offer'] = {
        $in: offer.map(({ _id }) => _id),
      };
    }

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: DateTime.fromISO(startDate, {
            zone: DEFAULT_TIMEZONE,
          }).startOf('day'),
          $lte: DateTime.fromISO(endDate, {
            zone: DEFAULT_TIMEZONE,
          }).endOf('day'),
        },
      };
    }

    const skip = page * perPage;

    const [onBoardSalesReport, onBoardSalesReportCount] = await Promise.all([
      this.sessionService.onboardSalesReport(
        { ...dateFilter, ...match },
        skip,
        perPage,
      ),
      this.sessionService.onboardSalesReportCount({ ...dateFilter, ...match }),
    ]);

    const onBoardSalesReportPagination = PaginatorSchema.build(
      onBoardSalesReportCount,
      onBoardSalesReport,
      page,
      perPage,
    );

    return { SalesDetails: onBoardSalesReportPagination };
  }

  async getOnboardMetricsBySearch(
    page: number,
    perPage: number,
    searchQuery: string,
  ): Promise<SalesReportResponseDto> {
    const match = searchQuery
      ? {
          $or: [
            { 'customerInfo.email': searchQuery },
            { 'marketingParameters.utmSource': searchQuery },
            { 'marketingParameters.utmMedium': searchQuery },
            { 'marketingParameters.utmContent': searchQuery },
            { 'marketingParameters.utmTerm': searchQuery },
            { 'marketingParameters.channel': searchQuery },
            { 'salesParameters.orderSystem': searchQuery },
            { 'salesParameters.salesAgent': searchQuery },
          ],
        }
      : {};

    const skip = page * perPage;

    const [onBoardSalesReport, onBoardSalesReportCount] = await Promise.all([
      this.sessionModel
        .aggregate([
          {
            $lookup: {
              from: 'ds__customers',
              localField: 'customer',
              foreignField: '_id',
              as: 'customerInfo',
            },
          },
          {
            $unwind: {
              path: '$customerInfo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: match,
          },
          {
            $lookup: {
              from: 'ds__onboard__offers',
              localField: 'offer',
              foreignField: '_id',
              as: 'offerDetails',
            },
          },
          {
            $unwind: {
              path: '$offerDetails',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'ds__customers_subscriptions',
              localField: 'customer',
              foreignField: 'customer',
              as: 'customerStatus',
            },
          },
          {
            $unwind: {
              path: '$customerStatus',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'ds__customer_events',
              localField: 'customer',
              foreignField: 'customer',
              as: 'customerEvents',
            },
          },
          {
            $addFields: {
              customerEvents: {
                $first: '$customerEvents',
              },
            },
          },
          {
            $lookup: {
              from: 'ds__coaches',
              localField: 'coach',
              foreignField: '_id',
              as: 'coachInfo',
            },
          },
          {
            $unwind: {
              path: '$coachInfo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $sort: { createdAt: -1 },
          },
          {
            $project: {
              createdAt: 1,
              updatedAt: 1,
              customerInfo: {
                firstName: 1,
                lastName: 1,
                email: 1,
                stripeId: 1,
                billing: 1,
              },
              offerDetails: { title: 1, trial: 1, code: 1 },
              customerStatus: { status: 1, updatedAt: 1 },
              customerEvents: { event: 1 },
              marketingParameters: 1,
              salesParameters: 1,
              currentStep: 1,
              coachInfo: { name: 1, email: 1 },
              customer: 1,
              coachingSelection: 1,
            },
          },
        ])
        .read('secondaryPreferred', [{ nodeType: NODE_TYPES.ANALYTICS }])
        .skip(skip)
        .limit(perPage),
      this.sessionModel
        .aggregate([
          {
            $lookup: {
              from: 'ds__customers',
              localField: 'customer',
              foreignField: '_id',
              as: 'customerInfo',
            },
          },
          {
            $unwind: {
              path: '$customerInfo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: match,
          },
        ])
        .read('secondaryPreferred', [{ nodeType: NODE_TYPES.ANALYTICS }]),
    ]);

    const onBoardSalesReportPagination = PaginatorSchema.build(
      onBoardSalesReportCount.length,
      onBoardSalesReport,
      page,
      perPage,
    );

    return { SalesDetails: onBoardSalesReportPagination };
  }

  async getSessionByDateRange(
    fromDate: string,
    toDate: string,
  ): Promise<SessionDocument[]> {
    return this.sessionModel
      .find({ createdAt: { $gte: fromDate, $lt: toDate } })
      .populate(['offer', 'customer']);
  }

  async getSalesWithDeals(
    fromDate: string,
    toDate: string,
  ): Promise<SalesReportWithDealsResponseDto> {
    const SessionDocument = await this.getSessionByDateRange(fromDate, toDate);

    const inheritListPromise = SessionDocument.map(
      async (session: SessionDocument) => {
        const stripeId = get(session, ['customer', 'stripeId'], 0) as number;
        const saleDate = get(session, 'createdAt');
        const customerEmail = get(session, ['customer', 'email'], '') as string;
        const offerCode = get(session, ['offer', 'code'], '') as string;
        const deal =
          stripeId &&
          (await this.hubspotService.getDealBySubscriptionId(stripeId));

        return <SalesReportWithDealsLineItem>{
          stripeId: stripeId ?? '',
          saleDate: saleDate ?? '',
          customerEmail: customerEmail ?? '',
          offerCode: offerCode ?? '',
          dealExists: !!deal,
        };
      },
    );

    const salesList = await Promise.all(inheritListPromise);

    const res: SalesReportWithDealsResponseDto = {
      sales: salesList,
    };
    return res;
  }

  async getSessionWithCoachByDateRange(
    fromDate: string,
    toDate: string,
  ): Promise<SessionDocument[]> {
    return this.sessionModel
      .find({
        createdAt: { $gte: fromDate, $lt: toDate },
        coachingSelection: { $exists: true, $ne: null },
      })
      .populate(['customer', 'coach', 'offer']);
  }

  /**
   * @deprecated
   */
  async getCoachEmailReminders(
    fromDate: string,
    toDate: string,
  ): Promise<CoachEmailReminderResponseDto> {
    const sessionDocument = await this.getSessionWithCoachByDateRange(
      fromDate,
      toDate,
    );

    const emailReminderList = sessionDocument.map(
      (session: SessionDocument) => {
        const customerEmail = get(session, ['customer', 'email'], '') as string;
        const coachName = get(session, ['coach', 'name'], '') as string;
        const coachEmail = get(session, ['coach', 'email'], '') as string;
        const meetingDateTIme = get(
          session,
          ['coachingSelection', 'utcStart'],
          '',
        )?.toLocaleString();
        // TODO:
        //after discussion with @Srini, leaving below values empty for this ticket, as this information is not yet being saved
        const reminderEmailTime = '';
        const meetingSubject = '';
        const meetingMessage = '';

        return {
          customerEmail: customerEmail,
          coachName: coachName,
          coachEmail: coachEmail,
          meetingDateTIme: meetingDateTIme,
          reminderEmailTime: reminderEmailTime,
          meetingSubject: meetingSubject,
          meetingMessage: meetingMessage,
        };
      },
    );

    const result: CoachEmailReminderResponseDto = {
      emailReminders: emailReminderList,
    };
    return result;
  }

  async createCustomerUnsubscriptionFromWebhook(
    event: any,
  ): Promise<CustomerSubscriptionDocument> {
    const subscriptionId = get(
      event,
      ['payload', 'subscription', 'id'],
      '',
    ) as string;
    const subObj = await this.paymentChargifyService.getSubscriptionBySubId(
      subscriptionId.toString(),
    );
    const status = get(subObj, ['subscription', 'state']);
    const email = get(subObj, ['subscription', 'customer', 'email']);
    const previousStatus = get(subObj, ['subscription', 'previous_state']);
    return this.customersService.createSubscriptionorUnsubscription(
      email,
      subscriptionId,
      status,
      previousStatus,
    );
  }

  async customerUnsubscriptionReport(
    dto: UnsubscriptionReportDto,
  ): Promise<Array<CustomerSubscriptionDocument>> {
    return this.customersService.unsubscriptionReport(dto);
  }

  private async bindCustomer(
    dto: CreateCustomerDto,
  ): Promise<CustomerDocument> {
    const existingCustomer = await this.customersService.findByEmail(dto.email);
    let customer: CustomerDocument;

    if (existingCustomer) {
      if (existingCustomer.status === CustomerStatus.ACTIVE) {
        const authenticatesSuccessfully =
          await this.customersService.authenticate(dto.email, dto.password);
        if (!authenticatesSuccessfully) {
          throw new UnauthorizedException();
        }
      }
      customer = await this.customersService.syncCustomer(
        dto,
        existingCustomer.status,
        existingCustomer,
      );
    }
    if (!customer) {
      customer = await this.customersService.syncCustomer(
        dto,
        CustomerStatus.PENDING,
      );
    }
    return customer;
  }

  private async getOfferProducts(offerId: SchemaId): Promise<Product[]> {
    const result = await this.offerModel
      .findById(offerId)
      .populate(['products'])
      .select('products')
      .exec();
    const products = result.products as ProductDocument[];
    return products.map((product) => product.castTo(Product));
  }

  private getPreviousStep(steps: string[], currentStep: string): Step {
    switch (currentStep) {
      case Step.ADDON:
        return Step.PLACE_ORDER_WAIT;
      case Step.ADDON_WAIT:
        return Step.ADDON;
      case Step.SCHEDULE_COACHING:
        return this.getPrevStepFromArray(steps, currentStep);
      case Step.SCHEDULE_COACHING_WAIT:
      case Step.TRAINING_WEBINAR:
      case Step.BOOK_DETAILS:
        return Step.SCHEDULE_COACHING;
      case Step.BOOK_DETAILS_WAIT:
        return Step.BOOK_DETAILS;
      case Step.YOUR_BOOK:
        return Step.BOOK_DETAILS_WAIT;
      case Step.PLACE_ORDER:
        return undefined;
      case Step.PLACE_ORDER_WAIT:
      default:
        return Step.PLACE_ORDER;
    }
  }

  private getNextStep(steps: string[], currentStep: Step): Step {
    let nextStepFromArray: string;
    switch (currentStep) {
      case Step.PLACE_ORDER:
        return Step.PLACE_ORDER_WAIT;
      case Step.PLACE_ORDER_WAIT:
        // this should never happen, it is here just for documentation
        throw new Error('Invalid session query for order');
      case Step.ADDON:
        return Step.ADDON_WAIT;
      case Step.ADDON_WAIT:
        // this should also never happen and is here for the same reason
        throw new Error('Invalid session query for addon');
      case Step.SCHEDULE_COACHING:
        return Step.SCHEDULE_COACHING_WAIT;
      case Step.SCHEDULE_COACHING_WAIT:
        nextStepFromArray = this.getNextStepFromArray(steps, currentStep);
        return (nextStepFromArray as Step) || Step.BOOK_DETAILS;
      case Step.TRAINING_WEBINAR:
        return Step.BOOK_DETAILS;
      case Step.BOOK_DETAILS:
        return Step.BOOK_DETAILS_WAIT;
      case Step.BOOK_DETAILS_WAIT:
        return Step.YOUR_BOOK;
      case Step.YOUR_BOOK:
        return Step.ORDER_CONFIRMATION;
      case Step.ORDER_CONFIRMATION:
        return Step.DONE;
      default:
        return Step.PLACE_ORDER;
    }
  }

  private async getCoachFromOwner(
    sessionDocument: SessionDocument,
  ): Promise<CoachDocument | null> {
    let coach, contactOwnerId;

    const contactHubspotId = get(
      sessionDocument,
      ['customer', 'hubspotId'],
      null,
    ) as string;
    try {
      if (contactHubspotId) {
        contactOwnerId = await this.hubspotService.getContactOwnerId(
          contactHubspotId,
        );
      }

      if (contactOwnerId) {
        coach = await this.coachesService.findByOwnerId(
          contactOwnerId as string,
        );
      }
      return (coach as CoachDocument) || null;
    } catch (e) {
      return null;
    }
  }

  private async ensureSessionHasCoach(
    sessionDocument: SessionDocument,
  ): Promise<void> {
    if (!sessionDocument.coach) {
      await this.findAndAssignCoachToSession(sessionDocument, true);
    }
  }

  private formatOrderNumber(orderNumber: number): string {
    const order = padStart(orderNumber.toString(), 7, '0');
    return `AFY${order}`;
  }

  private async populateSession(
    sessionDocument: SessionDocument,
  ): Promise<Session> {
    const session = sessionDocument.castTo(Session);
    // session.draftId =
    let offerDocument = sessionDocument.offer as OfferDocument;
    const customer = sessionDocument.customer as CustomerDocument;
    session.offer.paymentOptions = offerDocument.paymentOptions;
    session.offer = this.updateOfferDescriptions(session.offer);
    if (
      customer?.billing?.country === 'CA' ||
      customer?.billing?.country === 'Canada'
    ) {
      const bookDetails = offerDocument.bookOptionsCA as CanadianBooks[];
      const canadianBookPackage: CanadianBookOption[] = bookDetails.map(
        (book) => {
          const data = {
            id: book._id.toString(),
            image: book.image.toString(),
          };
          return data;
        },
      );
      session.offer.bookOptionsCA = canadianBookPackage;
    }
    const payments = get(sessionDocument, ['payments'], {});
    const addons = offerDocument.addons.map((addon) => addon.offer.toString());
    const paymentIds = get(sessionDocument, ['paymentIntents']);
    const steps = sessionDocument.steps;
    const step = sessionDocument.currentStep;
    const previousStep = this.getPreviousStep(steps, step);
    const previousStepInfo = get(sessionDocument, [
      'stepResults',
      previousStep,
    ]) as unknown as StepResult;
    const allProducts = [];
    session.step = step;
    const isAddonRelatedStep = [Step.ADDON, Step.ADDON_WAIT].includes(step);
    session.currentOffer = session.offer;
    const paymentId = get(paymentIds, [
      (offerDocument?.id as string)?.toString(),
    ]);
    session.currentOffer.paymentId = paymentId;
    session.order = this.formatOrderNumber(sessionDocument.order);

    if (
      sessionDocument.guideOrdered ||
      offerDocument.accountType === AccountType.DENTIST
    ) {
      session.guideOrdered = sessionDocument.guideOrdered;
      session.guideOrder = sessionDocument.guideOrder;
    }

    const coachingSelection = sessionDocument.coachingSelection;
    if (!isEmpty(coachingSelection)) {
      session.coachingSelection = coachingSelection;
      const scheduleDate = DateTime.fromJSDate(coachingSelection.utcStart)
        .setZone(coachingSelection.selectedTz)
        .setLocale('en-US');

      const scheduleData = [
        scheduleDate.toFormat('LLLL d'),
        `(${capitalizeFirstLetter(scheduleDate.toRelativeCalendar())}),`,
        scheduleDate.toFormat('t'),
      ];

      session.scheduleDate = scheduleData.join(' ');
    }

    if (isAddonRelatedStep) {
      for (const addon of addons) {
        const payment = get(payments, [addon]) as object;
        const addonAcceptance = get(sessionDocument, [
          'offerAcceptance',
          addon,
        ]);
        const addonWasRefused = addonAcceptance === false;
        if (!payment && !addonWasRefused) {
          const paymentId = get(paymentIds, addon);
          const addonOfferDocument = await this.offerModel
            .findById(addon)
            .exec();
          session.currentOffer = addonOfferDocument.castTo(Offer);
          session.currentOffer = this.updateOfferDescriptions(
            session.currentOffer,
          );
          session.currentOffer.paymentId = paymentId;
          break;
        }
      }
    }

    if (step === Step.TRAINING_WEBINAR) {
      const webinarCode = offerDocument?.webinar?.id;
      if (webinarCode) {
        const webinarData = await this.disService.getWebinarInfo(webinarCode);
        session.webinar = {
          title: webinarData.title,
          caption: offerDocument.webinar.caption,
          description: offerDocument.webinar.description,
          image: offerDocument.webinar.image,
          slots: webinarData.upcomingTimes,
        };
      } else {
        this.logger.error('could not find webinar code in offer document');
      }
    }

    if (previousStep) {
      session.previousStep = {
        step: previousStep,
        status: previousStepInfo?.status,
        description: previousStepInfo?.description,
      };
    }

    if (customer?.hubspotId) {
      const autoLoginToken = await this.disService.getAutoLoginToken(
        customer.hubspotId,
      );

      // @ts-ignore
      session.autoLoginToken = autoLoginToken;
    }

    for (const addon of addons) {
      const addonAcceptance = get(sessionDocument, ['offerAcceptance', addon]);

      if (addonAcceptance) {
        const addonOfferDocument = (await this.offerModel
          .findById(addon)
          .populate('products')
          .exec()) as OfferDocument;

        const hasProducts = get(addonOfferDocument, ['products', 'length']);
        if (hasProducts) {
          addonOfferDocument.products.forEach(
            (product: ProductDocument | ProductId) => {
              allProducts.push(product);
            },
          );
        }
        break;
      }
    }

    const metricsSent = sessionDocument.metrics?.[step];

    if (!metricsSent) {
      offerDocument = await offerDocument.populate('products');
      const hasProducts = get(offerDocument, 'products.length');
      if (hasProducts) {
        offerDocument.products.forEach((product) => {
          allProducts.push(product);
        });
      }
      const logPayload = this.buildLoggingPayload(
        session,
        allProducts as ProductDocument[],
        sessionDocument,
      );
      this.logger.log({ payload: logPayload }, CONTEXT_ONBOARD_METRICS);
      await this.sessionModel
        .updateOne(
          { _id: sessionDocument._id as SessionId },
          {
            $set: {
              [`metrics.${step}`]: true,
            },
          },
        )
        .exec();
    }

    return session;
  }

  private buildLoggingPayload(
    session: Session,
    products: ProductDocument[],
    sessionDocument: SessionDocument,
  ): Record<string, any> {
    const coach = session.coach;
    const offer = session.offer;
    const webinar = session.webinar;
    const result = {};

    result['channel'] = get(sessionDocument, 'marketingParameters.channel');
    result['utm_source'] = get(
      sessionDocument,
      'marketingParameters.utmSource',
    );
    result['utm_medium'] = get(
      sessionDocument,
      'marketingParameters.utmMedium',
    );
    result['utm_content'] = get(
      sessionDocument,
      'marketingParameters.utmContent',
    );
    result['utm_term'] = get(sessionDocument, 'marketingParameters.utmTerm');
    result['affiliate_id'] = get(
      sessionDocument,
      'marketingParameters.affiliateId',
    );
    result['sessionId'] = session.id;
    result['step'] = session.step;
    result['customer'] = session.customer;
    result['offerCode'] = offer.code;
    result['offerTitle'] = offer.title;
    result['outcome'] = session.previousStep;
    result['coachName'] = get(coach, 'name');
    result['coachMeetingDate'] = get(sessionDocument, 'coachingSelection');
    result['webinarTitle'] = get(webinar, 'title');
    result['webinarDate'] = get(sessionDocument, 'webinarSelection');
    result['value'] = products.map((product) => {
      let title = product.title ?? '';
      if (!title.length) {
        title = product.stripeId;
      }
      const value = product.value ?? 0;
      return { [title]: value };
    });
    return result;
  }

  private updateOfferDescriptions(offer: Offer): Offer {
    const usDateFormat = this.calculateTrialDateForOffer(offer);
    offer.description1 = get(offer, ['description1'], '').replace(
      '{{date}}',
      usDateFormat,
    );
    offer.description2 = get(offer, ['description2'], '').replace(
      '{{date}}',
      usDateFormat,
    );
    return offer;
  }

  private calculateTrialDateForOffer(offer: Offer) {
    const trialPeriod = get(offer, ['trial'], 0);
    const d = new Date();
    const trialDate = DateTime.fromJSDate(d, { zone: 'UTC' }).plus({
      days: trialPeriod,
    });
    const usDateFormat = this.toUsDateFormat(trialDate);

    return usDateFormat;
  }

  private toUsDateFormat(dateTime: DateTime) {
    return dateTime.toFormat('LL/dd/yyyy');
  }

  private async registerPaymentOutcome(
    sessionId: string,
    clientSecret: string,
    outcome: StepStatus,
    description?: string,
    reference?: string,
  ): Promise<SessionDocument> {
    const session = await this.findSession(sessionId);
    if (!session) {
      return;
    }
    const offerId = clientSecret;
    if (!offerId) {
      return;
    }
    const isMainOffer = await this.offerModel.exists({
      _id: offerId,
      type: OfferType.MAIN,
    });
    const step = isMainOffer ? Step.PLACE_ORDER_WAIT : Step.ADDON;
    const status = outcome;
    const timestamp = DateTime.now().toJSDate();
    const stepResult = {
      status,
      description,
      timestamp,
    };
    const updateData: {
      [p: string]: {
        description?: string;
        status?: StepStatus;
        timestamp?: Date;
        reference?: string;
      };
    } = { [`stepResults.${step}`]: stepResult };

    if (outcome == StepStatus.SUCCESS) {
      updateData[`payments.${offerId}`] = {
        reference,
        timestamp,
      };
    }

    await this.sessionModel.updateOne({ _id: sessionId }, updateData).exec();
    return session;
  }

  async updateCustomerSocialMediaTraining({
    email,
    planName,
  }: SocialMediaDto): Promise<void> {
    /* LOG */
    this.logger.log(
      {
        payload: <LoggerPayload>{
          email,
          method: 'updateCustomerSocialMediaTraining',
          usageDate: DateTime.now(),
          planName,
        },
      },
      CONTEXT_SOCIAL_MEDIA_TRAINING,
    );
    const hubspotCustomer = await this.hubspotService.getContactDetailsByEmail(
      email,
    );
    /* LOG */
    this.logger.log(
      {
        payload: <LoggerPayload>{
          email,
          method: 'updateCustomerSocialMediaTraining',
          usageDate: DateTime.now(),
          hubspotCustomer,
        },
      },
      CONTEXT_SOCIAL_MEDIA_TRAINING,
    );

    const vid = hubspotCustomer.vid.toString();
    console.info({ vid });

    const socialMediaPlans =
      await this.cmsServices.getSocialMediaTrainingConfig();
    /* LOG */
    this.logger.log(
      {
        payload: <LoggerPayload>{
          email,
          method: 'updateCustomerSocialMediaTraining',
          usageDate: DateTime.now(),
          socialMediaPlans,
        },
      },
      CONTEXT_SOCIAL_MEDIA_TRAINING,
    );
    let isPremiumUser = false;
    Object.values(socialMediaPlans).forEach((planValue) => {
      if (planName?.includes(planValue)) {
        isPremiumUser = true;
      }
    });

    const hubspotPayload = {
      properties: {
        afy_social_media_training: isPremiumUser ? 'Yes' : 'No',
      },
    };
    /* LOG */
    this.logger.log(
      {
        payload: <LoggerPayload>{
          email,
          method: 'updateCustomerSocialMediaTraining',
          usageDate: DateTime.now(),
          hubspotPayload,
        },
      },
      CONTEXT_SOCIAL_MEDIA_TRAINING,
    );
    await this.hubspotService.updateContactById(vid, hubspotPayload);
  }

  async getSessionToSyncDeals(since?: DateTime): Promise<SessionDocument> {
    if (!since) {
      since = DateTime.fromISO('2022-09-01');
    }
    const filter: FilterQuery<SessionDocument> = {
      $and: [
        {
          currentStep: {
            $not: { $in: [Step.PLACE_ORDER, Step.PLACE_ORDER_WAIT] },
          },
        },
        { createdAt: { $gte: DateTime.fromISO(since.toISODate()) } },
        {
          $or: [{ deals: { $exists: false } }, { deals: { $eq: null } }],
        },
      ],
    };

    const options: QueryOptions = {
      sort: { createdAt: 'asc' },
      populate: 'customer',
    };
    return this.sessionModel.findOne(filter, {}, options).exec();
  }

  // do not erase this method
  async syncSessionWithDeal(
    session: SessionDocument,
    subscription: Subscription,
    deal: SimplePublicObject,
  ) {
    const dealRef = <Deal>{
      dealId: deal.id,
      subscriptionId: subscription.id.toString(10),
    };
    return this.sessionModel
      .findByIdAndUpdate(
        session._id,
        { $push: { deals: dealRef } },
        { new: true },
      )
      .exec();
  }

  async chargifyWebhookActivity(
    customerEmail: string,
    dto: CreateCustomerEventDto,
    body: { [key: string]: any },
  ) {
    const { event } = dto;
    const customer = await this.customersService.findByEmail(customerEmail);
    const data = {
      customer: customer,
      event: event,
      metadata: { body },
    };
    /* LOG */
    this.logger.log(
      {
        payload: <LoggerPayload>{
          method: 'chargifyWebhookActivity',
          usageDate: DateTime.now(),
          payload: data,
        },
      },
      CONTEXT_ONBOARD_METRICS,
    );
    return this.customerEventsService.createEvent(customer, data);
  }

  async getPaymentDetails({ sessionId, offerId }: CheckSessionPaymentDto) {
    return this.sessionModel
      .findOne({ _id: sessionId, [`payments.${offerId}`]: { $exists: true } })
      .exec();
  }

  async reCreateHubspotDeal(
    dto: HubspotCreateDealRequestDto,
  ): Promise<SimplePublicObject> {
    const eventId = new ObjectId();
    const subscriptions =
      await this.paymentChargifyService.getAllActiveSubscriptionsFromCustomerEmail(
        dto.email,
      );
    if (!isEmpty(subscriptions)) {
      const subscription = first<Subscription>(subscriptions);
      return this.createHubspotDeal(
        eventId.toString(),
        subscription,
        subscription?.created_at,
        undefined,
        undefined,
      );
    }
  }

  async orderBookAndUpdateSession(
    { sessionId, draftId, quantity, isDigital }: OrderBookAndUpdateSessionDto,
    jwt: string,
  ) {
    const session = await this.findSession(sessionId);

    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }

    try {
      const customer = session.customer as CustomerDocument;
      const customerAddress = customer.billing;

      if (!customerAddress) {
        throw new Error('could not find shipping address');
      }

      const shippingAddressRequest = await this.http.post<{
        statusCode: number;
        status: string;
        message: string;
        data: { _id: string };
      }>(
        'user/address',
        {
          firstName: customer.firstName,
          lastName: customer.lastName,
          country: customerAddress.country,
          city: customerAddress.city,
          state: customerAddress.state,
          pincode: customerAddress.zip,
          addressLine1: customerAddress.address1,
        },
        {
          headers: {
            Authorization: jwt,
          },
        },
      );

      if (shippingAddressRequest?.data?.statusCode !== 0) {
        throw new Error('could not create shipping address');
      }

      const order = await this.http.post<{
        statusCode: number;
        status: string;
        message: string;
        data: any;
      }>(
        'order',
        {
          sessionId,
          draft_id: draftId,
          shippingAddressId: shippingAddressRequest?.data.data._id,
          quantity,
          isDigital,
        },
        {
          headers: {
            Authorization: jwt,
          },
        },
      );
      if (order.data.statusCode !== 0) {
        throw new Error(order.data.message);
      }

      session['currentStep'] = this.getNextStep(
        session.steps || [],
        session.currentStep,
      );

      await this.sessionModel.findByIdAndUpdate(session.id, session).exec();

      const updatedSession = await this.findSession(<string>session.id);
      const populatedSession = await this.populateSession(updatedSession);

      return { session: populatedSession, order: order.data?.data as object };
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(<LoggerPayload>{
          usageDate: DateTime.now(),
          error: err.message,
          method: 'OnboardService@orderBookAndUpdateSession',
        });
      }
      throw new HttpException(
        'error while ordering book',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOfferById(offerId: SchemaId): Promise<OfferDocument> {
    return this.offerModel.findById(offerId).exec();
  }

  async summary(
    session: SessionDocument,
  ): Promise<SummaryDTO | SummaryGuideDTO> {
    const { coachingSelection } = session;
    const offer = <OfferDocument>session.offer;
    const customer = <CustomerDocument>session.customer;

    const scheduleDate = DateTime.fromJSDate(coachingSelection.utcStart)
      .setZone(coachingSelection.selectedTz)
      .setLocale('en-US');

    const scheduleData = [
      scheduleDate.toFormat('LLLL d'),
      `(${capitalizeFirstLetter(scheduleDate.toRelativeCalendar())}),`,
      scheduleDate.toFormat('t'),
    ];

    if (offer.accountType === AccountType.DENTIST && session.guideOrdered) {
      const guideOrder = session.guideOrder;
      const address = guideOrder?.shippingAddress?.addressLine1;
      const city = guideOrder?.shippingAddress?.city;
      const state = guideOrder?.shippingAddress?.state;
      const zip = guideOrder?.shippingAddress?.pincode;
      const country = guideOrder?.shippingAddress?.country;
      return <SummaryGuideDTO>{
        scheduleData: scheduleData.join(' '),
        guideOrder: guideOrder,
        shipTo: {
          address: address,
          street: `${city}, ${state} ${zip}`,
          country: country,
        },
      };
    }

    const draft = await this.generateBookService.getStatus(session.draftId);

    return <SummaryDTO>{
      scheduleData: scheduleData.join(' '),
      printedBooks: offer.credits,
      yourBook: {
        title: draft.title,
        bookWebsite: draft.links.pages.landing,
        digitalBook: draft.links.pages.read,
      },
      shipTo: {
        address: `${customer.billing.address1} ${customer.billing.address2}`,
        street: `${customer.billing.city}, ${customer.billing.state} ${customer.billing.zip}`,
        country: customer.billing.country,
      },
    };
  }

  public async logBookOrderWhileTrial(
    customer: CustomerDocument,
    dto: OrderBookAndUpdateSessionDto,
  ) {
    const subscriptions =
      await this.paymentChargifyService.getOnlySubscriptionsFromCustomerEmail(
        customer.email,
      );
    let currentTrialSubscription: Subscription = null;

    if (subscriptions.length > 0) {
      for (const subscription of subscriptions) {
        const metadata =
          await this.paymentChargifyService.getMetadataForResource(
            'subscriptions',
            subscription.id,
          );
        const sessionMetadata = metadata?.metadata?.find(
          (meta) => meta?.name === 'sessionId',
        );

        if (sessionMetadata) {
          const sessionId = sessionMetadata.value;
          if (
            subscription.state === State.TRIALING &&
            dto.sessionId === sessionId
          ) {
            currentTrialSubscription = subscription;
          }
        }
      }
    }

    if (currentTrialSubscription) {
      const logInput: LogInput = {
        customer: {
          email: customer.email,
          name: `${customer.firstName} ${customer.lastName}`,
        },
        event: {
          name: 'book-generated-while-trial',
          namespace: 'book-generation',
        },
        source: 'digital-services',
        trace: uuidv4(),
        tags: [
          `quantity:${dto.quantity}`,
          `subscription-id:${currentTrialSubscription.id}`,
        ],
      };
      await this.afyLoggerService.sendLog(logInput);
    }
  }

  async syncCustomerLastStepHubspot(): Promise<void> {
    const startOfDay = DateTime.now().startOf('day');
    const endOfDay = DateTime.now().endOf('day');
    const filter: FilterQuery<SessionDocument> = {
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      customer: { $exists: true },
    };

    const sessions =
      await this.sessionService.getSessionsToUpdateCustomerLastStepHubspot(
        filter,
      );

    if (sessions.length) {
      for (const session of sessions) {
        const hubspotId = session.customer?.hubspotId;
        const { currentStep: onboarding_last_step } = session;
        if (hubspotId) {
          const update: SimplePublicObjectInput = {
            properties: {
              onboarding_last_step,
            },
          };
          try {
            await this.hubspotService.updateContactById(hubspotId, update);
          } catch (error) {
            if (error instanceof Error) {
              const payload: LoggerPayload = {
                usageDate: DateTime.now(),
                error: error?.message,
                stack: error?.stack,
                message: `Unable to update hubspot contact last step - ${hubspotId}`,
              };
              this.logger.error(
                { payload },
                '',
                CONTEXT_ONBOARD_CRON_LAST_STEP_ERROR,
              );
            }
          }
        }
        // runs with 5 seconds delay to avoid hubspot rate limit
        await sleep(5000);
      }
    }
  }
}
