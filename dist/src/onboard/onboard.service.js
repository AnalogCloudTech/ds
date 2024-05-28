"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardService = void 0;
const common_1 = require("@nestjs/common");
const luxon_1 = require("luxon");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const lodash_1 = require("lodash");
const types_1 = require("./domain/types");
const session_schema_1 = require("./schemas/session.schema");
const offer_schema_1 = require("./schemas/offer.schema");
const customers_service_1 = require("../customers/customers/customers.service");
const dis_service_1 = require("../legacy/dis/dis.service");
const session_1 = require("./domain/session");
const product_1 = require("./products/domain/product");
const webhook_idempotency_schema_1 = require("./schemas/webhook-idempotency.schema");
const offer_1 = require("./domain/offer");
const coaches_service_1 = require("./coaches/coaches.service");
const book_option_schema_1 = require("./schemas/book-option.schema");
const generate_book_service_1 = require("./generate-book/generate-book.service");
const types_2 = require("./generate-book/domain/types");
const types_3 = require("../customers/customers/domain/types");
const types_4 = require("./products/domain/types");
const hubspot_service_1 = require("../legacy/dis/legacy/hubspot/hubspot.service");
const contexts_1 = require("../internal/common/contexts");
const bull_1 = require("@nestjs/bull");
const constants_1 = require("./constants");
const leads_service_1 = require("../campaigns/email-campaigns/leads/leads.service");
const cms_service_1 = require("../cms/cms/cms.service");
const types_5 = require("./domain/types");
const config_1 = require("@nestjs/config");
const products_service_1 = require("./products/products.service");
const paginator_1 = require("../internal/utils/paginator");
const payments_service_1 = require("../payments/payment_chargify/payments.service");
const email_reminders_service_1 = require("./email-reminders/email-reminders.service");
const types_6 = require("../payments/chargify/domain/types");
const dateFormatters_1 = require("../internal/common/utils/dateFormatters");
const calendar_service_1 = require("../legacy/dis/legacy/calendar/calendar.service");
const customer_events_service_1 = require("../customers/customer-events/customer-events.service");
const types_7 = require("../customers/customer-events/domain/types");
const customer_properties_service_1 = require("../customers/customer-properties/customer-properties.service");
const session_service_1 = require("./services/session.service");
const no_free_time_slots_exception_1 = require("./exceptions/no-free-time-slots.exception");
const mongodb_1 = require("mongodb");
const functions_1 = require("../internal/utils/functions");
const no_available_coaches_exception_1 = require("./exceptions/no-available-coaches.exception");
const mongodb_type_1 = require("../internal/common/types/mongodb.type");
const axios_1 = require("axios");
const hubspot_sync_actions_services_1 = require("../legacy/dis/legacy/hubspot/hubspot-sync-actions.services");
const string_1 = require("../internal/utils/string");
const afy_logger_service_1 = require("../integrations/afy-logger/afy-logger.service");
const uuid_1 = require("uuid");
const dentist_coaches_service_1 = require("./dentist-coaches/dentist-coaches.service");
const offers_service_1 = require("./services/offers.service");
let OnboardService = class OnboardService {
    constructor(queue, offerModel, sessionModel, webhookIdempotencyModel, bookOptionModel, disService, configService, customersService, coachesService, dentistCoachesService, generateBookService, hubspotService, hubspotSyncActionsServices, leadsService, cmsServices, content, productsService, logger, paymentChargifyService, emailRemindersService, customerEventsService, scheduleCoachDuration, calendarService, customerPropertiesService, sessionService, http, afyLoggerService, offersService, coachingDetailsQueue) {
        this.queue = queue;
        this.offerModel = offerModel;
        this.sessionModel = sessionModel;
        this.webhookIdempotencyModel = webhookIdempotencyModel;
        this.bookOptionModel = bookOptionModel;
        this.disService = disService;
        this.configService = configService;
        this.customersService = customersService;
        this.coachesService = coachesService;
        this.dentistCoachesService = dentistCoachesService;
        this.generateBookService = generateBookService;
        this.hubspotService = hubspotService;
        this.hubspotSyncActionsServices = hubspotSyncActionsServices;
        this.leadsService = leadsService;
        this.cmsServices = cmsServices;
        this.content = content;
        this.productsService = productsService;
        this.logger = logger;
        this.paymentChargifyService = paymentChargifyService;
        this.emailRemindersService = emailRemindersService;
        this.customerEventsService = customerEventsService;
        this.scheduleCoachDuration = scheduleCoachDuration;
        this.calendarService = calendarService;
        this.customerPropertiesService = customerPropertiesService;
        this.sessionService = sessionService;
        this.http = http;
        this.afyLoggerService = afyLoggerService;
        this.offersService = offersService;
        this.coachingDetailsQueue = coachingDetailsQueue;
    }
    async getAllOnboardMetrics(start, end) {
        const startDate = start
            ? luxon_1.DateTime.fromISO(start, {
                zone: constants_1.DEFAULT_TIMEZONE,
            }).startOf('day')
            : luxon_1.DateTime.now().minus({ days: 30 }).startOf('day');
        const endDate = end
            ? luxon_1.DateTime.fromISO(end, {
                zone: constants_1.DEFAULT_TIMEZONE,
            }).endOf('day')
            : luxon_1.DateTime.now().endOf('day');
        if (startDate.diff(endDate, 'days').days > 360) {
            throw new common_1.HttpException({ message: 'The maximum range is 360 days' }, common_1.HttpStatus.PRECONDITION_FAILED);
        }
        const filterQuery = {
            createdAt: {
                $gte: startDate,
                $lte: endDate,
            },
        };
        const sessions = await this.sessionModel
            .aggregate([
            {
                $match: Object.assign({}, filterQuery),
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
        ], {
            readPreference: 'secondaryPreferred',
            batchSize: 1000,
        })
            .exec();
        return sessions;
    }
    async updateSessionWithCoach({ coachEmail, sessionId, }) {
        const coach = await this.coachesService.findByEmail(coachEmail);
        if (!coach) {
            throw new Error(`Coach with email ${coachEmail} not found`);
        }
        const session = await this.sessionService.findById(sessionId);
        if (!session) {
            throw new Error(`Session with id ${sessionId} not found`);
        }
        return this.sessionService.update(session._id, {
            coach: coach._id,
        });
    }
    async resumeSession(offerId, email, password) {
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
        const authenticatesSuccessfully = await this.customersService.authenticate(email, password);
        if (!authenticatesSuccessfully) {
            return false;
        }
        return session;
    }
    async offerCodeToOfferId(code) {
        const offer = await this.offerModel
            .findOne({ code, type: types_1.OfferType.MAIN })
            .select('_id')
            .lean();
        return offer === null || offer === void 0 ? void 0 : offer._id;
    }
    async saveAddonAnswer(sessionId, offerId, accepted) {
        const keyAcceptance = `offerAcceptance.${offerId}`;
        const keyResult = `stepResults.${types_1.Step.ADDON}`;
        const status = types_1.StepStatus.SUCCESS;
        const timestamp = luxon_1.DateTime.now().toJSDate();
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
    async bindCustomerAndStartPaymentIntent(dto, offer, session) {
        const customer = await this.bindCustomer(dto, session);
        await this.startPaymentIntent(customer, offer, session, dto.chargifyToken);
        return session;
    }
    async startPaymentIntent(customer, offer, session, chargifyToken) {
        var _a;
        const offerId = offer._id;
        const sessionId = session._id;
        const currentPaymentIntent = (0, lodash_1.get)(session, [
            'paymentIntents',
            offerId.toString(),
        ]);
        if (currentPaymentIntent) {
            return currentPaymentIntent;
        }
        const { firstName, lastName, email } = customer;
        const products = await this.getOfferProducts(offerId);
        const hasProducts = !(0, lodash_1.isEmpty)(products);
        if (!hasProducts) {
            throw new common_1.InternalServerErrorException(`Offer ${offerId} doesn't have products`);
        }
        const productDetails = products.find((product) => product.type === types_4.Type.SUBSCRIPTION);
        const { chargifyProductHandle, chargifyComponentId, chargifyProductPriceHandle, productWithoutTrial, } = productDetails || {};
        const subscriptionDetails = {
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
            subscriptionDetails.subscription['product_price_point_handle'] =
                chargifyProductPriceHandle;
        }
        else {
            subscriptionDetails.subscription.components[0]['price_point_id'] =
                chargifyProductPriceHandle;
        }
        try {
            const createSubResponse = await this.paymentChargifyService.createSubscription(subscriptionDetails);
            const { subscription, errors } = createSubResponse;
            if (!subscription) {
                const errorMessages = errors === null || errors === void 0 ? void 0 : errors.join(' ');
                this.logger.error({
                    payload: {
                        usageDate: luxon_1.DateTime.now(),
                        error: 'subscription is undefined',
                        subscriptionDetails,
                        subcontext: contexts_1.CONTEXT_CHARGIFY,
                    },
                }, '', contexts_1.CONTEXT_ERROR);
                throw new common_1.HttpException({
                    message: errorMessages,
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            const paymentIntentKey = `paymentIntents.${offer.id}`;
            const sessionValuesToUpdate = {
                [paymentIntentKey]: subscription.id,
            };
            const chargifyId = (0, lodash_1.get)(subscription, 'customer.id');
            if (chargifyId) {
                await this.customersService.update(customer, { chargifyId });
            }
            await session.updateOne(sessionValuesToUpdate, { new: true }).exec();
            return (_a = subscription === null || subscription === void 0 ? void 0 : subscription.id) === null || _a === void 0 ? void 0 : _a.toString();
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    isTrainingWebinarEnabled() {
        return this.configService.get('features.trainingWebinar');
    }
    async offerExists(code) {
        const exists = await this.offerModel.exists({ code });
        return !!exists;
    }
    offerContractedExists(code) {
        const exists = code.includes('plus') ? true : false;
        return exists;
    }
    async sessionExists(sessionId, offerCode) {
        const offerId = await this.offerCodeToOfferId(offerCode);
        if (!offerId) {
            return false;
        }
        return !!this.sessionModel.exists({
            _id: sessionId,
            offer: offerId,
        });
    }
    async findSession(sessionId) {
        const sessionDocument = await this.sessionModel
            .findById(sessionId)
            .populate(['offer', 'customer', 'coach']);
        const offerDocument = sessionDocument.offer;
        sessionDocument.offer = await offerDocument.populate([
            'bookOptions',
            'nonHeadshotBookOptions',
        ]);
        return sessionDocument;
    }
    async addCoachingDetailsQueue(email) {
        const opts = {
            removeOnComplete: true,
            removeOnFail: true,
            delay: constants_1.TEN_MINUTES_BULL_DELAY,
        };
        await this.coachingDetailsQueue.add({ email }, opts);
    }
    async updateDealWithCoachDetails(email) {
        try {
            const subscription = await this.paymentChargifyService.getSubscriptionsFromEmail(email);
            const deal = await this.hubspotService.getDealBySubscriptionId(subscription.id);
            const coachingDetails = await this.getCoachingHubspotDetails(email);
            const updateDeal = {
                properties: Object.assign({}, coachingDetails),
            };
            await this.hubspotService.updateDeal(deal.id, updateDeal);
            return true;
        }
        catch (error) {
            this.logger.error({
                payload: {
                    error,
                    message: 'Error updating deal with coaching details',
                    usageDate: luxon_1.DateTime.now(),
                    subcontext: contexts_1.CONTEXT_HUBSPOT,
                },
            }, contexts_1.CONTEXT_ERROR);
        }
    }
    async getCoachingHubspotDetails(email) {
        try {
            const customer = await this.customersService.findByEmail(email);
            if (!customer) {
                this.logger.error({
                    payload: {
                        message: `Customer with email ${email} not found`,
                        usageDate: luxon_1.DateTime.now(),
                        method: 'getCoachingHubspotDetails',
                    },
                }, contexts_1.CONTEXT_ERROR);
                return {};
            }
            const session = await this.sessionModel
                .findOne({
                customer: customer._id,
            })
                .populate(['coach']);
            if (!session) {
                this.logger.error({
                    payload: {
                        message: `Session with customer ${customer._id} not found`,
                        usageDate: luxon_1.DateTime.now(),
                        method: 'getCoachingHubspotDetails',
                    },
                }, contexts_1.CONTEXT_ERROR);
                return {};
            }
            const coach = session.coach;
            const coachingSelection = (0, lodash_1.get)(session, 'coachingSelection');
            const scheduleDate = luxon_1.DateTime.fromJSDate(coachingSelection.utcStart)
                .setZone(coachingSelection.selectedTz)
                .setLocale('en-US')
                .toFormat('yyyy-MM-dd');
            return {
                marketing_consultant_owner: coach.hubspotId,
                first_coaching_call_scheduled: scheduleDate,
            };
        }
        catch (error) {
            this.logger.error({
                payload: {
                    error,
                    message: 'Error getting coaching hubspot details',
                    usageDate: luxon_1.DateTime.now(),
                    method: 'getCoachingHubspotDetails',
                },
            }, contexts_1.CONTEXT_ERROR);
            return null;
        }
    }
    async findOfferBySession(sessionId) {
        const sessionDocument = await this.sessionModel
            .findById(sessionId)
            .populate(['offer']);
        return sessionDocument.offer;
    }
    async createOffer(dto) {
        const result = await new this.offerModel(dto).save();
        const populatedOffer = await result.populate(['products', 'bookOptions']);
        return populatedOffer;
    }
    async updateOffer(dto, id) {
        const result = await this.offerModel.findOneAndUpdate({ _id: id }, dto);
        const populatedOffer = await result.populate(['products', 'bookOptions']);
        return populatedOffer;
    }
    async getOffersList() {
        return this.offerModel.find().populate(['products', 'packages']);
    }
    async createBookOption(dto) {
        const result = await new this.bookOptionModel(dto).save();
        return result;
    }
    async getBookOptionByBookId(bookId) {
        return this.bookOptionModel.findOne({ bookId });
    }
    async findMainOffer(code) {
        const result = await this.offerModel
            .findOne({ code, type: types_1.OfferType.MAIN })
            .exec();
        return result;
    }
    calculateAnnualPrice(offerData) {
        const price = offerData[0].value * 12 - offerData[1].value;
        return price;
    }
    calculateMonthlyPrice(offerData) {
        return offerData[1].value / 12;
    }
    async findContractedOfferByCode(code) {
        const result = await this.offerModel
            .find({ accountType: types_3.AccountType.CONTRACTED })
            .exec();
        const offerData = result.filter((offer) => offer.code.includes(code));
        const price = this.calculateAnnualPrice(offerData);
        const monthlyPrice = this.calculateMonthlyPrice(offerData);
        return offerData.map((offer) => {
            const data = {
                code: offer.code,
                title: offer.title,
                id: offer._id,
                amount: offer === null || offer === void 0 ? void 0 : offer.value,
                monthlyPrice: offer.code.includes('annual')
                    ? Math.floor(monthlyPrice)
                    : offer.value,
                save: offer.code.includes('annual') ? price : undefined,
                name: offer.productInfo[0].title,
                recurrance: offer.code.includes('annual') ? 'yearly' : 'monthly',
            };
            return data;
        });
    }
    async findAddonOffer(code) {
        const result = await this.offerModel
            .findOne({ code, type: { $not: { $eq: types_1.OfferType.MAIN } } })
            .exec();
        return result;
    }
    async createSession(offer, marketingParameters, salesParameters) {
        const steps = (0, lodash_1.isEmpty)(offer.steps) ? types_1.DefaultSteps : offer.steps;
        const newSession = await this.sessionModel.create({
            offer: offer._id,
            currentStep: types_1.Step.PLACE_ORDER,
            steps,
            marketingParameters,
            salesParameters,
        });
        return newSession.populate(['offer']);
    }
    async assignCoachToSession(sessionId, coach) {
        await this.sessionModel.findByIdAndUpdate(sessionId, {
            coach: coach === null || coach === void 0 ? void 0 : coach.id,
            hasHubspotOwnerId: true,
        });
    }
    async findAndAssignCoachToSession(sessionDocument, forceRR = false) {
        let selectedCoach = null;
        const coachFromOwner = await this.getCoachFromOwner(sessionDocument);
        if (coachFromOwner) {
            selectedCoach = coachFromOwner;
        }
        if (forceRR || (0, lodash_1.isNull)(selectedCoach)) {
            const offer = sessionDocument === null || sessionDocument === void 0 ? void 0 : sessionDocument.offer;
            const isDentistCoach = offer.accountType === types_3.AccountType.DENTIST;
            if (isDentistCoach) {
                selectedCoach = await this.dentistCoachesService.getNextCoachInRR(sessionDocument.declinedCoaches);
            }
            else {
                selectedCoach = await this.coachesService.getNextCoachInRR(sessionDocument.declinedCoaches);
            }
        }
        if ((0, lodash_1.isNull)(selectedCoach)) {
            throw new no_available_coaches_exception_1.NoAvailableCoachesException();
        }
        await this.assignCoachToSession(sessionDocument._id.toString(), selectedCoach);
        return selectedCoach;
    }
    getNextStepFromArray(steps, currentStep) {
        const idx = steps.indexOf(currentStep);
        return steps[idx + 1];
    }
    getPrevStepFromArray(steps, currentStep) {
        if (steps.length) {
            const idx = steps.indexOf(currentStep);
            return steps[idx - 1];
        }
    }
    async isScheduleCoaching(steps, currentStep, sessionDocument) {
        let nextStep;
        if (steps.length) {
            nextStep = this.getNextStepFromArray(steps, currentStep);
        }
        if (!nextStep || nextStep === types_1.Step.SCHEDULE_COACHING) {
            await this.ensureSessionHasCoach(sessionDocument);
            return types_1.Step.SCHEDULE_COACHING;
        }
        return nextStep;
    }
    async updateStepAndPopulateSession(currentSession) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const sessionDocument = await this.findSession(currentSession.id);
        const step = sessionDocument.currentStep;
        const stepResult = (0, lodash_1.get)(sessionDocument, ['stepResults', step]);
        const update = {};
        const hasSuccessResult = (stepResult === null || stepResult === void 0 ? void 0 : stepResult.status) === types_1.StepStatus.SUCCESS;
        const sessionCustomer = sessionDocument === null || sessionDocument === void 0 ? void 0 : sessionDocument.customer;
        const country = ((_a = sessionCustomer === null || sessionCustomer === void 0 ? void 0 : sessionCustomer.billing) === null || _a === void 0 ? void 0 : _a.country) || types_5.Countries.USA;
        const hasCountryAddon = country !== types_5.Countries.CANADA;
        const offer = sessionDocument.offer;
        const addons = offer.addons;
        const hasAddons = !(0, lodash_1.isEmpty)(addons);
        const offerId = offer.id.toString();
        const payments = (0, lodash_1.get)(sessionDocument, ['paymentIntents'], {});
        const steps = sessionDocument.steps || [];
        const guideOrdered = (0, lodash_1.get)(sessionDocument, 'guideOrdered');
        switch (step) {
            case types_1.Step.ACCOUNT_WAIT:
                await (0, functions_1.sleep)(15000);
                update['currentStep'] = types_1.Step.DONE;
                break;
            case types_1.Step.PLACE_ORDER_WAIT:
                const hasOfferPayment = Boolean((0, lodash_1.get)(payments, [offerId]));
                if (hasOfferPayment) {
                    if (!hasAddons) {
                        update['currentStep'] = await this.isScheduleCoaching(steps, step, sessionDocument);
                        break;
                    }
                }
                if (offer.skipOnboarding) {
                    update['currentStep'] = types_1.Step.ACCOUNT_WAIT;
                    break;
                }
                update['currentStep'] = types_1.Step.SCHEDULE_COACHING;
                break;
            case types_1.Step.ADDON:
                if (!hasCountryAddon) {
                    update['currentStep'] = await this.isScheduleCoaching(steps, step, sessionDocument);
                    break;
                }
                let hasMoreAddons = false;
                for (const addon of addons) {
                    const addonId = addon.offer.toString();
                    const offerAcceptance = (0, lodash_1.get)(sessionDocument, [
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
                    update['currentStep'] = await this.isScheduleCoaching(steps, step, sessionDocument);
                    break;
                }
                update['currentStep'] = types_1.Step.ADDON;
                break;
            case types_1.Step.SCHEDULE_COACHING:
                const coachingSelection = (0, lodash_1.get)(sessionDocument, 'coachingSelection');
                const hasCoachingSelection = !(0, lodash_1.isEmpty)(coachingSelection);
                if (!hasCoachingSelection) {
                    await this.ensureSessionHasCoach(sessionDocument);
                }
                if (hasCoachingSelection) {
                    let isRmSub = false;
                    try {
                        isRmSub = await this.paymentChargifyService.currentSubscriptionIsRM(sessionCustomer);
                    }
                    catch (error) {
                        if (error instanceof Error) {
                            this.logger.error({
                                payload: {
                                    error,
                                    stack: error === null || error === void 0 ? void 0 : error.stack,
                                    message: 'Error checking if subscription is RM',
                                    usageDate: luxon_1.DateTime.now(),
                                    subcontext: contexts_1.CONTEXT_CHARGIFY,
                                },
                            }, error === null || error === void 0 ? void 0 : error.stack, contexts_1.CONTEXT_ERROR);
                        }
                    }
                    const isDentist = sessionCustomer.accountType === types_3.AccountType.DENTIST ||
                        offer.accountType === types_3.AccountType.DENTIST;
                    if (isRmSub) {
                        update['currentStep'] = types_1.Step.DONE;
                        await this.hubspotService.updateRmUserProperties({
                            email: sessionCustomer.email,
                        });
                    }
                    else if (isDentist) {
                        update['currentStep'] = types_1.Step.DENTIST_GUIDE_DETAILS;
                    }
                    else {
                        update['currentStep'] =
                            this.isTrainingWebinarEnabled() && (offer === null || offer === void 0 ? void 0 : offer.webinar)
                                ? types_1.Step.TRAINING_WEBINAR
                                : types_1.Step.BOOK_DETAILS;
                    }
                }
                await this.addCoachingDetailsQueue(sessionCustomer.email);
                break;
            case types_1.Step.TRAINING_WEBINAR:
                const webinarSelection = (0, lodash_1.get)(sessionDocument, 'webinarSelection');
                const hasWebinarSelection = !(0, lodash_1.isEmpty)(webinarSelection);
                if (hasWebinarSelection) {
                    update['currentStep'] = types_1.Step.BOOK_DETAILS;
                }
                break;
            case types_1.Step.BOOK_DETAILS:
                const bookSelection = (0, lodash_1.get)(sessionDocument, 'bookOption');
                if (bookSelection) {
                    update['currentStep'] = types_1.Step.BOOK_DETAILS_WAIT;
                }
                break;
            case types_1.Step.DENTIST_GUIDE_DETAILS:
                if (guideOrdered) {
                    update['currentStep'] = types_1.Step.DONE;
                }
                break;
            case types_1.Step.BOOK_DETAILS_WAIT:
                const previousStepResult = (0, lodash_1.get)(sessionDocument, [
                    'stepResults',
                    types_1.Step.BOOK_DETAILS,
                ]);
                const draftId = previousStepResult === null || previousStepResult === void 0 ? void 0 : previousStepResult.description;
                update['draftId'] = draftId;
                const bookData = await this.generateBookService.getStatus(draftId);
                const bookIsReady = ((_b = bookData.status) === null || _b === void 0 ? void 0 : _b.book) === types_2.Status.READY;
                const pagesAreReady = ((_c = bookData === null || bookData === void 0 ? void 0 : bookData.status) === null || _c === void 0 ? void 0 : _c.pages) === types_2.Status.READY;
                if (bookIsReady && pagesAreReady) {
                    update['book'] = bookData;
                    update['currentStep'] = types_1.Step.YOUR_BOOK;
                }
                break;
            case types_1.Step.ORDER_CONFIRMATION:
                await this.afyLoggerService.sendLog({
                    customer: {
                        email: (_d = sessionCustomer === null || sessionCustomer === void 0 ? void 0 : sessionCustomer.email) !== null && _d !== void 0 ? _d : 'anon@authorify.com',
                        name: (_e = [sessionCustomer === null || sessionCustomer === void 0 ? void 0 : sessionCustomer.firstName, sessionCustomer === null || sessionCustomer === void 0 ? void 0 : sessionCustomer.lastName].join(' ')) !== null && _e !== void 0 ? _e : 'Anonymous',
                    },
                    source: 'digital-services',
                    event: {
                        name: 'generated-book',
                        namespace: 'onboard',
                    },
                    trace: (0, uuid_1.v4)(),
                    tags: [`timestamp:${luxon_1.DateTime.now().toMillis()}`],
                });
                break;
            case types_1.Step.YOUR_BOOK:
                break;
            case types_1.Step.YOUR_GUIDE:
                break;
            case types_1.Step.PLACE_ORDER:
            default:
                if (hasSuccessResult) {
                    update['currentStep'] = this.getNextStep(steps, step);
                }
        }
        if (!(0, lodash_1.isEmpty)(update)) {
            await this.sessionModel
                .findByIdAndUpdate(sessionDocument.id, update)
                .exec();
        }
        const updatedSession = await this.findSession(sessionDocument.id);
        try {
            const salesParameters = updatedSession === null || updatedSession === void 0 ? void 0 : updatedSession.salesParameters.salesAgent;
            const orderSystem = updatedSession === null || updatedSession === void 0 ? void 0 : updatedSession.salesParameters.orderSystem;
            const coach = (_f = updatedSession === null || updatedSession === void 0 ? void 0 : updatedSession.coach) === null || _f === void 0 ? void 0 : _f.email;
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
                    email: ((_g = updatedSession.customer) === null || _g === void 0 ? void 0 : _g.email) ||
                        'anon@authorify.com',
                    name: ((_h = updatedSession.customer) === null || _h === void 0 ? void 0 : _h.firstName) ||
                        'Anonymous',
                },
                event: {
                    name: 'step_updated',
                    namespace: 'onboard',
                },
                source: 'digital-services',
                trace: (0, uuid_1.v4)(),
                tags: tags,
            });
        }
        catch (err) {
            if (err instanceof Error) {
                this.logger.error('error sending log:', err.stack);
            }
            else {
                this.logger.error(`error sending log: ${err}`);
            }
        }
        return this.populateSession(updatedSession);
    }
    async registerPaymentSuccess(sessionId, clientSecret, reference, customerEmail) {
        this.logger.log({
            payload: {
                customerEmail,
                method: 'registerPaymentSuccess',
                usageDate: luxon_1.DateTime.now(),
                sessionId,
                clientSecret,
                reference,
            },
        }, contexts_1.CONTEXT_CHARGIFY);
        await this.syncSucccessfulPaymentWithHubspot(sessionId, customerEmail);
        return this.registerPaymentOutcome(sessionId, clientSecret, types_1.StepStatus.SUCCESS, undefined, reference);
    }
    async registerPaymentFailure(sessionId, clientSecret, description) {
        return this.registerPaymentOutcome(sessionId, clientSecret, types_1.StepStatus.ERROR, description);
    }
    async isRepeatedWebhookRequest(key, objectType) {
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
    async getScheduleCoachingSlots(session, start, outputTimezone = 'UTC') {
        try {
            let populated = await session.populate(['coach']);
            let coach = populated === null || populated === void 0 ? void 0 : populated.coach;
            if (!coach) {
                const forceRR = true;
                await this.findAndAssignCoachToSession(session, forceRR);
                populated = await this.sessionModel
                    .findById(session.id)
                    .populate(['coach'])
                    .exec();
                coach = populated === null || populated === void 0 ? void 0 : populated.coach;
            }
            let slotsData = await this.calendarService.getBusySlots(coach.email, start, outputTimezone);
            let tries = 1;
            const maxTries = await this.coachesService.count();
            while (slotsData.freeTimeSlots.length <= 0 && tries <= maxTries) {
                tries++;
                const declinedCoach = populated.coach;
                const updatedSession = await this.sessionService.pushDeclinedCoach(session, declinedCoach);
                const newCoach = await this.findAndAssignCoachToSession(updatedSession, true);
                slotsData = await this.calendarService.getBusySlots(newCoach.email, start, outputTimezone);
                coach = newCoach;
                populated = await this.sessionModel
                    .findById(session.id)
                    .populate(['coach'])
                    .exec();
            }
            if (slotsData.freeTimeSlots.length <= 0) {
                throw new no_free_time_slots_exception_1.NoFreeTimeSlotsException();
            }
            const calendarDtoWithCoach = Object.assign(Object.assign({}, slotsData), { coach: {
                    name: coach.name,
                    image: coach.image,
                } });
            return calendarDtoWithCoach;
        }
        catch (err) {
            this.logger.log({ payload: { err, session } }, contexts_1.CONTEXT_ONBOARD_SCHEDULING_COACHING);
            if (err instanceof no_free_time_slots_exception_1.NoFreeTimeSlotsException) {
                throw new common_1.HttpException({
                    message: 'No free timeslots',
                    err: err === null || err === void 0 ? void 0 : err.message,
                    stack: err === null || err === void 0 ? void 0 : err.stack,
                }, common_1.HttpStatus.FAILED_DEPENDENCY);
            }
            if (err instanceof no_available_coaches_exception_1.NoAvailableCoachesException) {
                throw new common_1.HttpException({
                    exception: no_available_coaches_exception_1.NoAvailableCoachesException.name,
                    message: 'Could not find a coach for the session',
                    err: err === null || err === void 0 ? void 0 : err.message,
                    stack: err === null || err === void 0 ? void 0 : err.stack,
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            if (err instanceof Error) {
                throw new common_1.HttpException({
                    message: 'error while getting scheduled coach',
                    err: err === null || err === void 0 ? void 0 : err.message,
                    stack: err === null || err === void 0 ? void 0 : err.stack,
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async scheduleCoaching(session, start, timezone) {
        const startDate = luxon_1.DateTime.fromISO(start);
        const endDate = luxon_1.DateTime.fromISO(start).plus({
            minutes: this.scheduleCoachDuration,
        });
        const coachingSelection = {
            selectedTz: timezone,
            utcStart: startDate.toJSDate(),
        };
        const populated = await session.populate(['customer', 'coach', 'offer']);
        const contact = populated.customer;
        const coach = populated.coach;
        const offer = populated.offer;
        const { hubspotId: contactId, email: contactEmail } = contact;
        const contactName = `${contact.firstName} ${contact.lastName}`;
        const { hubspotId: coachId, calendarId, email: coachEmail, name: coachName, meetingLink: location, } = coach;
        const title = this.content.calendar.createEvent.title.replace('{{FIRST_NAME}}', contact.firstName);
        const description = this.content.calendar.createEvent.description;
        const createMeetingDto = {
            contactId,
            contactEmail,
            contactName,
            coachId,
            calendarId,
            coachName,
            coachEmail,
            startTime: startDate.toISO(),
            endTime: endDate.toISO(),
            title,
            body: description,
            location,
        };
        await this.calendarService.createMeeting(createMeetingDto);
        try {
            await this.emailRemindersService.deleteAllFromFilter({
                session: session._id,
            });
            await this.emailRemindersService.sendAllRemindersEmail(contact, coach, session, startDate, timezone);
        }
        catch (err) {
            if (err instanceof Error) {
                const errorPayload = {
                    message: `Unable to create email reminders for customer: ${contact._id}`,
                    error: err === null || err === void 0 ? void 0 : err.message,
                    usageDate: luxon_1.DateTime.now(),
                };
                this.logger.error({ payload: errorPayload }, '', contexts_1.CONTEXT_ERROR);
            }
        }
        try {
            if (offer.accountType === types_3.AccountType.DENTIST) {
                await this.dentistCoachesService.incrementScheduling(coach._id);
            }
            else {
                await this.coachesService.incrementScheduling(coach._id);
            }
            await this.hubspotService.setContactOwnerIfNull(contactId, coachId);
        }
        catch (err) {
            if (err instanceof Error) {
                throw new common_1.HttpException({
                    message: 'Error while updating hubspot with contact owner',
                    err: err === null || err === void 0 ? void 0 : err.message,
                    stack: err === null || err === void 0 ? void 0 : err.stack,
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        const key = `stepResults.${types_1.Step.SCHEDULE_COACHING}`;
        const status = types_1.StepStatus.SUCCESS;
        const timestamp = luxon_1.DateTime.now().toJSDate();
        const stepResult = {
            status,
            timestamp,
        };
        await this.sessionModel
            .findByIdAndUpdate(session.id, { coachingSelection, [key]: stepResult })
            .exec();
    }
    async webinarRegistration(start, timezone, wantsSms, session) {
        const customer = session.customer;
        const offer = session.offer;
        const webinarCode = offer.webinar.id;
        const name = `${customer.firstName} ${customer.lastName}`;
        const email = customer.email;
        const smsNumber = wantsSms ? `+1${customer.phone}` : '';
        await this.disService.webinarRegistration(webinarCode, start, name, email, smsNumber);
        const status = types_1.StepStatus.SUCCESS;
        const timestamp = luxon_1.DateTime.now().toJSDate();
        const stepResult = {
            status,
            timestamp,
        };
        const webinarSelection = {
            selectedTz: timezone,
            utcStart: luxon_1.DateTime.fromISO(start, { zone: 'UTC' }).toJSDate(),
        };
        const key = `stepResults.${types_1.Step.TRAINING_WEBINAR}`;
        await this.sessionModel
            .findByIdAndUpdate(session.id, { webinarSelection, [key]: stepResult })
            .exec();
    }
    async saveBookDetailsAndGenerateBook(dto, session) {
        const offer = session.offer;
        const customer = session.customer;
        const bookOptions = offer.bookOptions;
        const nonHeadshotBookOptions = offer.nonHeadshotBookOptions;
        const selectedBook = dto.book;
        const bookIndex = (0, lodash_1.findIndex)(bookOptions, { id: selectedBook });
        const bookOption = customer.avatar || !nonHeadshotBookOptions[bookIndex]
            ? bookOptions[bookIndex]
            : nonHeadshotBookOptions[bookIndex];
        const generateBookDto = {
            book: {
                bookId: bookOption.bookId,
                templateId: bookOption.templateId,
                email: dto.email,
                name: dto.name,
                phone: dto.phone,
            },
            email: customer.email,
        };
        if (customer === null || customer === void 0 ? void 0 : customer.avatar) {
            generateBookDto.avatarHeadshot = customer.avatar;
        }
        const draftId = await this.generateBookService.generateBook(generateBookDto);
        const customerId = customer.id;
        const updateBookPreferences = {
            email: dto.email,
            name: dto.name,
            phone: dto.phone,
        };
        await this.customersService.saveOnboardBookPreferences(customerId, updateBookPreferences);
        const status = types_1.StepStatus.SUCCESS;
        const timestamp = luxon_1.DateTime.now().toJSDate();
        const stepResult = {
            status,
            timestamp,
            description: draftId,
        };
        const key = `stepResults.${types_1.Step.BOOK_DETAILS}`;
        await this.sessionModel
            .findByIdAndUpdate(session.id, {
            bookOption: dto.book,
            [key]: stepResult,
        })
            .exec();
        return session;
    }
    async syncSucccessfulPaymentWithHubspot(sessionId, customerEmail = null) {
        var _a, _b;
        this.logger.log({
            payload: {
                customerEmail,
                method: 'syncSucccessfulPaymentWithHubspot',
                usageDate: luxon_1.DateTime.now(),
                sessionId,
            },
        }, contexts_1.CONTEXT_HUBSPOT);
        const sessionDocument = await this.findSession(sessionId);
        const hubspotInfo = await this.hubspotService.getContactDetailsByEmail(customerEmail);
        this.logger.log({
            payload: {
                customerEmail,
                method: 'syncSucccessfulPaymentWithHubspot',
                usageDate: luxon_1.DateTime.now(),
                hubspotInfo,
                sessionDocument,
            },
        }, contexts_1.CONTEXT_HUBSPOT);
        const customerHubspotId = (customerEmail
            ? hubspotInfo.vid
            : +(0, lodash_1.get)(sessionDocument, ['customer', 'hubspotId'])).toString();
        const offer = sessionDocument.offer;
        const sessionCustomer = sessionDocument.customer;
        const bookCredits = (0, lodash_1.get)(offer, ['credits']);
        let bookPackages = offer === null || offer === void 0 ? void 0 : offer.packages;
        if (((_a = sessionCustomer === null || sessionCustomer === void 0 ? void 0 : sessionCustomer.billing) === null || _a === void 0 ? void 0 : _a.country) === 'CA' ||
            ((_b = sessionCustomer === null || sessionCustomer === void 0 ? void 0 : sessionCustomer.billing) === null || _b === void 0 ? void 0 : _b.country) === 'Canada') {
            bookPackages = offer === null || offer === void 0 ? void 0 : offer.packagesCA;
        }
        const updateCreditsAndPackagesDto = {
            id: customerHubspotId,
            credits: bookCredits,
            packages: bookPackages,
        };
        this.logger.log({
            payload: {
                customerEmail,
                method: 'syncSucccessfulPaymentWithHubspot',
                usageDate: luxon_1.DateTime.now(),
                updateCreditsAndPackagesDto,
            },
        }, contexts_1.CONTEXT_HUBSPOT);
        await this.chargifyWebhookActivity(customerEmail, { event: types_7.Events.BOOK_CREDITS_UPDATE }, updateCreditsAndPackagesDto);
        await this.hubspotService.updateCreditsAndPackages(updateCreditsAndPackagesDto);
    }
    async handleDeleteSubscription(subscription) {
        const subscriptionId = (0, lodash_1.get)(subscription, ['id']);
        const newDate = new Date();
        const date = newDate.setUTCHours(0, 0, 0, 0);
        const deal = await this.hubspotService.getDealBySubscriptionId(subscriptionId);
        const dealId = (0, lodash_1.get)(deal, ['id']);
        const customerEmail = (0, lodash_1.get)(subscription, ['customer', 'email']);
        const hubspotCustomer = await this.hubspotService.getContactDetailsByEmail(customerEmail);
        const vid = hubspotCustomer.vid.toString();
        if ((0, lodash_1.get)(deal, 'properties.status') === 'duplicate') {
            return;
        }
        const activeDeals = await this.hubspotService.findActiveDealsByEmail(customerEmail);
        const numberOfActiveDeals = activeDeals === null || activeDeals === void 0 ? void 0 : activeDeals.total;
        const lifeCycle = numberOfActiveDeals ? 'customer' : 'subscriber';
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
        await this.hubspotService.updateContactById(vid, resetLifecycleStage);
        await this.hubspotService.updateContactById(vid, setLifecycleStage);
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
        await this.chargifyWebhookActivity(customerEmail, { event: types_7.Events.DEAL_UPDATE }, canceledSubscription);
        await this.hubspotService.updateDeal(dealId, objectInput);
    }
    async addCustomerToWorkFlow(customer, offer, currentStep) {
        var _a;
        const workFlowIds = (_a = offer === null || offer === void 0 ? void 0 : offer.workFlow) === null || _a === void 0 ? void 0 : _a[currentStep];
        if (workFlowIds) {
            const promises = workFlowIds.map((workFlowId) => {
                this.disService.addCustomerToWorkFlow(customer.email, workFlowId);
            });
            await Promise.all(promises);
        }
    }
    getOnboardLeads(Customer) {
        const { email: customerEmail } = Customer;
        const filter = {
            isValid: { $eq: true },
            unsubscribed: { $eq: false },
            customerEmail: { $eq: customerEmail },
        };
        return this.leadsService.getAllFromFilter(filter);
    }
    async handleBookCredit(productData, subscription) {
        const customerData = subscription.customer;
        const payload = {
            usageDate: luxon_1.DateTime.now(),
            method: 'handleBookCredit',
            productData,
            customerData,
            subscription,
        };
        this.logger.log({
            payload: Object.assign({ method: 'handleBookCredit', usageDate: luxon_1.DateTime.now() }, payload),
            CONTEXT_BOOK_CREDIT: contexts_1.CONTEXT_BOOK_CREDIT,
        });
        const subscriptionActivatedAt = subscription === null || subscription === void 0 ? void 0 : subscription.activated_at;
        const subscriptionCurrentPeriodStartedAt = subscription === null || subscription === void 0 ? void 0 : subscription.current_period_started_at;
        this.logger.log({
            payload: {
                method: 'handleBookCredit',
                usageDate: luxon_1.DateTime.now(),
                message: 'compareChargifyDates.',
                subscriptionActivatedAt,
                subscriptionCurrentPeriodStartedAt,
            },
        }, contexts_1.CONTEXT_BOOK_CREDIT);
        const isValidForCreditsOnce = (0, dateFormatters_1.compareChargifyDates)(subscriptionActivatedAt, subscriptionCurrentPeriodStartedAt) && Number(productData.creditsOnce) > 0;
        if (Number(productData.creditsRecur) > 0 || isValidForCreditsOnce) {
            try {
                const hubspotCustomer = await this.hubspotService.getContactDetailsByEmail(customerData.email);
                this.logger.log({ email: customerData.email, hubspotCustomer }, contexts_1.CONTEXT_BOOK_CREDIT);
                let existingBookCredit = Number((0, lodash_1.get)(hubspotCustomer, ['properties', 'afy_book_credits', 'value'], 0));
                if (isValidForCreditsOnce) {
                    existingBookCredit =
                        existingBookCredit + Number(productData.creditsOnce);
                    this.logger.log({
                        payload: {
                            email: customerData.email,
                            onceBookCredit: productData.creditsOnce,
                            usageDate: luxon_1.DateTime.now(),
                        },
                    }, contexts_1.CONTEXT_BOOK_CREDIT);
                }
                this.logger.log({ email: customerData.email, existingBookCredit }, contexts_1.CONTEXT_BOOK_CREDIT);
                const recurringBookCredit = productData.creditsRecur;
                this.logger.log({ email: customerData.email, recurringBookCredit }, contexts_1.CONTEXT_BOOK_CREDIT);
                const newCredits = existingBookCredit + recurringBookCredit;
                const reqBody = {
                    properties: {
                        afy_book_credits: newCredits.toString(),
                    },
                };
                const vid = hubspotCustomer.vid.toString();
                this.logger.log({ email: customerData.email, vid, reqBody }, contexts_1.CONTEXT_BOOK_CREDIT);
                const webhookBookCredit = {
                    recurringBookCredit,
                    existingBookCredit,
                    reqBody,
                };
                await this.chargifyWebhookActivity(customerData.email, { event: types_7.Events.BOOK_CREDITS_ADD }, webhookBookCredit);
                await this.hubspotService.updateContactById(vid, reqBody);
            }
            catch (err) {
                if (err instanceof Error) {
                    const errorPayload = {
                        email: customerData.email,
                        message: `Unable to update book credit for user`,
                        error: err === null || err === void 0 ? void 0 : err.message,
                        usageDate: luxon_1.DateTime.now(),
                    };
                    this.logger.error({ payload: errorPayload }, '', contexts_1.CONTEXT_BOOK_CREDIT);
                }
            }
        }
    }
    async updateHubspotDeal(eventId, subscription, component, lastPaymentDate) {
        console.info({ eventId, subscription });
        const deal = await this.hubspotService.getDealBySubscriptionId(subscription.id);
        console.info({ deal });
        if (!deal) {
            return this.createHubspotDeal(eventId, subscription, lastPaymentDate);
        }
        const subscriptionDetails = await this.paymentChargifyService.findSubscriptionById(subscription.id.toString());
        this.logger.log({
            payload: {
                usageDate: luxon_1.DateTime.now(),
                subscriptionDetails,
            },
        }, contexts_1.CONTEXT_ON_BOARD_DEAL);
        const chargifyProductId = component.id;
        console.info({ chargifyProductId });
        const productData = await this.productsService.findProductByChargifyId(chargifyProductId.toString());
        console.info({ productData });
        if (!productData) {
            console.info('If not productData');
            const chargifyProductMessage = 'Chargify Product not found';
            const productNotFoundPayload = {
                eventId,
                data: { chargifyProductId },
                message: chargifyProductMessage,
                usageDate: luxon_1.DateTime.now(),
            };
            console.error({ payload: productNotFoundPayload });
            this.logger.log({ payload: productNotFoundPayload }, contexts_1.CONTEXT_ON_BOARD_DEAL);
            throw new common_1.HttpException({ message: chargifyProductMessage }, 200);
        }
        const hubspotProduct = await this.hubspotService.findProductByChargifyId(chargifyProductId.toString());
        console.info({ hubspotProduct });
        if (!hubspotProduct) {
            console.info('If not hubspotProduct');
            const hubspotProductMessage = 'Hubspot Product not found';
            const productNotFoundPayload = {
                eventId,
                data: { name: productData.title },
                message: hubspotProductMessage,
                usageDate: luxon_1.DateTime.now(),
            };
            console.error({ payload: productNotFoundPayload });
            this.logger.log({ payload: productNotFoundPayload }, contexts_1.CONTEXT_ON_BOARD_DEAL);
            throw new common_1.HttpException({ message: hubspotProductMessage }, 200);
        }
        const updatedDeal = await this.hubspotService.updateNewComponentDeal(deal.id, subscriptionDetails.subscription, productData, lastPaymentDate);
        const customerEmail = (0, lodash_1.get)(subscription, ['customer', 'email']);
        await this.chargifyWebhookActivity(customerEmail, { event: types_7.Events.DEAL_UPDATE }, updatedDeal);
        const properties = {
            email: (0, lodash_1.get)(subscriptionDetails, 'customer.email'),
            planName: component.name,
        };
        return {
            id: deal.id,
            properties,
            createdAt: deal.createdAt,
            updatedAt: deal.updatedAt,
        };
    }
    getLastUpdatedDate(lastPaymentDate) {
        return !lastPaymentDate
            ? luxon_1.DateTime.now().toFormat('yyyy-LL-dd')
            : (0, dateFormatters_1.dateStringToHSDate)(lastPaymentDate);
    }
    async createHubspotDeal(eventId, subscription, lastPaymentDate, componentId, sessionId, manualFlag) {
        var _a;
        this.logger.log({
            payload: {
                email: subscription.customer.email,
                method: 'createHubspotDeal',
                usageDate: luxon_1.DateTime.now(),
                eventId,
                subscription,
                lastPaymentDate,
            },
        }, contexts_1.CONTEXT_ON_BOARD_DEAL);
        const subscriptionId = subscription.id;
        const deal = await this.hubspotService.getDealBySubscriptionId(subscriptionId);
        const customerObject = subscription.customer;
        const customerEmail = customerObject.email;
        this.logger.log({
            payload: {
                email: subscription.customer.email,
                method: 'createHubspotDeal',
                usageDate: luxon_1.DateTime.now(),
                deal,
            },
        }, contexts_1.CONTEXT_ON_BOARD_DEAL);
        const allocatedComponents = await this.paymentChargifyService.getAllAllocatedComponentsFromSubscription(subscription);
        const componentDetails = (0, lodash_1.first)(allocatedComponents);
        this.logger.log({
            payload: {
                email: subscription.customer.email,
                method: 'createHubspotDeal',
                usageDate: luxon_1.DateTime.now(),
                allocatedComponents,
                componentDetails,
            },
        }, contexts_1.CONTEXT_ON_BOARD_DEAL);
        const chargifyProductId = (0, lodash_1.get)(componentDetails, ['component_id']);
        this.logger.log({
            payload: {
                email: subscription.customer.email,
                method: 'createHubspotDeal',
                usageDate: luxon_1.DateTime.now(),
                chargifyProductId,
            },
        }, contexts_1.CONTEXT_ON_BOARD_DEAL);
        const productData = await this.productsService.findProductByChargifyId(chargifyProductId.toString());
        this.logger.log({
            payload: {
                email: subscription.customer.email,
                method: 'createHubspotDeal',
                usageDate: luxon_1.DateTime.now(),
                productData,
            },
        }, contexts_1.CONTEXT_ON_BOARD_DEAL);
        if (!productData) {
            console.info('If not productData');
            const chargifyProductMessage = 'Chargify Product not found';
            const productNotFoundPayload = {
                eventId,
                email: subscription.customer.email,
                data: { chargifyProductId },
                message: chargifyProductMessage,
                usageDate: luxon_1.DateTime.now(),
            };
            this.logger.log({
                payload: {
                    email: subscription.customer.email,
                    method: 'createHubspotDeal',
                    usageDate: luxon_1.DateTime.now(),
                    productNotFoundPayload,
                },
            }, contexts_1.CONTEXT_ON_BOARD_DEAL);
            throw new common_1.HttpException({ message: chargifyProductMessage }, 200);
        }
        let productForCredits = productData;
        if (componentId) {
            productForCredits = await this.productsService.findProductByChargifyId(componentId.toString());
            if (!productForCredits.chargifyComponentId) {
                this.logger.error({
                    payload: {
                        email: subscription.customer.email,
                        method: 'createHubspotDeal',
                        usageDate: luxon_1.DateTime.now(),
                        productForCredits,
                        componentId,
                        message: 'product not found, using componentId from transaction.',
                    },
                }, contexts_1.CONTEXT_ON_BOARD_DEAL);
            }
            if (productForCredits.hubspotListId) {
                const enrollContact = await this.hubspotSyncActionsServices.enrollContactToList(subscription.customer.email, productForCredits.hubspotListId);
                await this.queue.add(enrollContact, { delay: 1000 * 60 });
            }
        }
        if (deal) {
            lastPaymentDate = this.getLastUpdatedDate(lastPaymentDate);
            const nextRecurringDate = (0, dateFormatters_1.convertToHSDate)(subscription.current_period_ends_at);
            this.logger.log({
                payload: {
                    email: subscription.customer.email,
                    method: 'createHubspotDeal',
                    usageDate: luxon_1.DateTime.now(),
                    deal_id: deal.id,
                    lastPaymentDate,
                    message: 'Updating last payment date and next recurring date in deal',
                },
            }, contexts_1.CONTEXT_ON_BOARD_DEAL);
            return this.hubspotService.updateLastPaymentDateWithNextRecurringDateDeal(deal.id, lastPaymentDate, nextRecurringDate);
        }
        const hubspotProduct = await this.hubspotService.findProductByChargifyId(chargifyProductId.toString());
        this.logger.log({
            payload: {
                email: subscription.customer.email,
                method: 'createHubspotDeal',
                usageDate: luxon_1.DateTime.now(),
                hubspotProduct,
            },
        }, contexts_1.CONTEXT_ON_BOARD_DEAL);
        if (!hubspotProduct) {
            console.info('If not hubspotProduct');
            const hubspotProductMessage = 'Hubspot Product not found';
            const productNotFoundPayload = {
                eventId,
                email: subscription.customer.email,
                method: 'createHubspotDeal',
                data: {
                    name: productData.title,
                    chargifyProductId: chargifyProductId.toString(),
                },
                message: hubspotProductMessage,
                usageDate: luxon_1.DateTime.now(),
            };
            this.logger.log({
                payload: {
                    email: subscription.customer.email,
                    method: 'createHubspotDeal',
                    usageDate: luxon_1.DateTime.now(),
                    productNotFoundPayload,
                },
            }, contexts_1.CONTEXT_ON_BOARD_DEAL);
            throw new common_1.HttpException({ message: hubspotProductMessage }, 200);
        }
        this.logger.log({
            payload: {
                email: customerEmail,
                method: 'createHubspotDeal',
                usageDate: luxon_1.DateTime.now(),
            },
        }, contexts_1.CONTEXT_ON_BOARD_DEAL);
        let offerName = '';
        if (sessionId) {
            const offer = await this.findOfferBySession(sessionId);
            offerName = (0, lodash_1.get)(offer, ['title']);
        }
        const createdDeal = await this.hubspotService.createSubscriptionDeal(subscription, customerObject, productData, lastPaymentDate, offerName);
        if (manualFlag) {
            const customer = await this.customersService.findByEmail(customerEmail);
            const data = {
                customer: customer,
                event: types_7.Events.DEAL_CREATE,
                metadata: { createdDeal },
            };
            this.logger.log({
                payload: {
                    method: 'chargifyManualActivity',
                    usageDate: luxon_1.DateTime.now(),
                    payload: data,
                },
            }, contexts_1.CONTEXT_ONBOARD_METRICS);
            await this.customerEventsService.createEvent(customer, data);
        }
        else {
            await this.chargifyWebhookActivity(customerEmail, { event: types_7.Events.DEAL_CREATE }, createdDeal);
        }
        this.logger.log({
            payload: {
                email: subscription.customer.email,
                method: 'createHubspotDeal',
                usageDate: luxon_1.DateTime.now(),
                createdDeal,
            },
        }, contexts_1.CONTEXT_ON_BOARD_DEAL);
        const lineItemDto = {
            name: hubspotProduct.properties.name,
            hs_product_id: hubspotProduct.id,
            quantity: '1',
        };
        this.logger.log({
            payload: {
                email: subscription.customer.email,
                method: 'createHubspotDeal',
                usageDate: luxon_1.DateTime.now(),
                lineItemDto,
                message: 'Creating line item',
            },
        }, contexts_1.CONTEXT_ON_BOARD_DEAL);
        const findMetatData = await this.paymentChargifyService.getMetadataForResource('subscriptions', subscription === null || subscription === void 0 ? void 0 : subscription.id);
        if (((_a = findMetatData === null || findMetatData === void 0 ? void 0 : findMetatData.metadata) === null || _a === void 0 ? void 0 : _a.length) === 0) {
            const user = await this.hubspotService.getContactDetailsByEmail(subscription.customer.email);
            const updateCreditsAndPackagesDto = {
                id: user.vid.toString(),
                credits: productData.creditsOnce
                    ? productData.creditsOnce
                    : productData.creditsRecur,
                packages: [productData.bookPackages],
            };
            await this.hubspotService.updateCreditsAndPackages(updateCreditsAndPackagesDto);
        }
        const createdLineItem = await this.hubspotService.createLineItem(lineItemDto);
        this.logger.log({
            payload: {
                email: subscription.customer.email,
                method: 'createHubspotDeal',
                usageDate: luxon_1.DateTime.now(),
                createdLineItem,
                message: 'Creating line item',
            },
        }, contexts_1.CONTEXT_ON_BOARD_DEAL);
        await this.hubspotService.associateLineItemToDeal(createdLineItem.id, createdDeal.id);
        const hubspotContactId = await this.hubspotService.getContactId(customerEmail);
        this.logger.log({
            payload: {
                email: subscription.customer.email,
                method: 'createHubspotDeal',
                usageDate: luxon_1.DateTime.now(),
                hubspotContactId,
                message: 'Associating deal with contact using contact id',
            },
        }, contexts_1.CONTEXT_ON_BOARD_DEAL);
        if (hubspotContactId) {
            await this.hubspotService.associateDealToContact(hubspotContactId, createdDeal.id);
            this.logger.log({
                payload: {
                    email: subscription.customer.email,
                    method: 'createHubspotDeal',
                    usageDate: luxon_1.DateTime.now(),
                    hubspotContactId,
                    message: 'Associated deal with contact using contact id Successfully',
                },
            }, contexts_1.CONTEXT_ON_BOARD_DEAL);
        }
        else {
            this.logger.log({
                payload: {
                    email: subscription.customer.email,
                    method: 'createHubspotDeal',
                    usageDate: luxon_1.DateTime.now(),
                    hubspotContactId,
                    message: 'Issue associating deal with contact id, contact id not found.',
                },
            }, contexts_1.CONTEXT_ON_BOARD_DEAL);
            const customerDetails = await this.customersService.findByEmail(customerEmail);
            if (!(customerDetails === null || customerDetails === void 0 ? void 0 : customerDetails._id)) {
                const customerNotFound = 'customer details not found';
                this.logger.log({
                    payload: {
                        eventId,
                        email: subscription.customer.email,
                        method: 'createHubspotDeal',
                        usageDate: luxon_1.DateTime.now(),
                        data: {
                            customerEmail,
                        },
                    },
                }, contexts_1.CONTEXT_ON_BOARD_DEAL);
                throw new common_1.HttpException({ message: customerNotFound }, 200);
            }
            const createPropertyPayload = {
                customer: customerDetails === null || customerDetails === void 0 ? void 0 : customerDetails._id,
                customerEmail,
                module: 'onboard',
                value: 'association',
                name: 'Missing Association',
                metadata: { dealId: createdDeal.id },
            };
            this.logger.log({
                payload: {
                    email: subscription.customer.email,
                    method: 'createHubspotDeal',
                    usageDate: luxon_1.DateTime.now(),
                    createPropertyPayload,
                    message: 'Creating Customer Property for cronjob, hubspotContactId not found.',
                },
            }, contexts_1.CONTEXT_CRONJOB_HANDLE_FAILED_EVENTS);
            await this.customerPropertiesService.create(createPropertyPayload, customerDetails);
        }
        const dealCreatedSuccessfullyPayload = {
            eventId,
            email: subscription.customer.email,
            data: createdDeal,
            message: 'Deal created successfully',
            usageDate: luxon_1.DateTime.now(),
        };
        this.logger.log({
            payload: {
                email: subscription.customer.email,
                method: 'createHubspotDeal',
                usageDate: luxon_1.DateTime.now(),
                dealCreatedSuccessfullyPayload,
            },
        }, contexts_1.CONTEXT_ON_BOARD_DEAL);
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
    async getOnboardMetrics(startDate, endDate) {
        let filterQuery = {};
        let salesCountFilter = {};
        let bookGeneratedFilter = {};
        if (startDate && endDate) {
            filterQuery = {
                createdAt: {
                    $gte: luxon_1.DateTime.fromISO(startDate, {
                        zone: constants_1.DEFAULT_TIMEZONE,
                    }).startOf('day'),
                    $lte: luxon_1.DateTime.fromISO(endDate, {
                        zone: constants_1.DEFAULT_TIMEZONE,
                    }).endOf('day'),
                },
            };
            salesCountFilter = {
                $and: [
                    filterQuery,
                    {
                        currentStep: {
                            $nin: [
                                types_1.Step.PLACE_ORDER_WAIT,
                                types_1.Step.PLACE_ORDER,
                                types_1.Step.SCHEDULE_COACHING,
                            ],
                        },
                    },
                ],
            };
            bookGeneratedFilter = {
                $and: [
                    filterQuery,
                    {
                        currentStep: { $eq: types_1.Step.YOUR_BOOK },
                    },
                ],
            };
        }
        const [visitsCount, paidSalesCount, bookGeneratedCount, cancellationCount, autoLoginCount,] = await Promise.all([
            this.sessionModel.countDocuments(filterQuery).exec(),
            this.sessionModel.countDocuments(salesCountFilter).exec(),
            this.sessionModel.countDocuments(bookGeneratedFilter).exec(),
            this.sessionModel
                .aggregate([
                {
                    $match: Object.assign(Object.assign({}, filterQuery), { currentStep: { $ne: types_1.Step.PLACE_ORDER } }),
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
                .read('secondaryPreferred', [{ nodeType: mongodb_type_1.NODE_TYPES.ANALYTICS }]),
            this.sessionModel
                .aggregate([
                {
                    $match: Object.assign(Object.assign({}, filterQuery), { currentStep: { $ne: types_1.Step.PLACE_ORDER } }),
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
                .read('secondaryPreferred', [{ nodeType: mongodb_type_1.NODE_TYPES.ANALYTICS }]),
        ]);
        return {
            VisitsCount: visitsCount,
            PaidSalesCount: paidSalesCount,
            BookGeneratedCount: bookGeneratedCount,
            CancellationCount: cancellationCount.length,
            AutoLoginCount: autoLoginCount.length,
        };
    }
    async getHubspotDealDetailsBySubscription(onBoardSales) {
        var _a, _b, _c;
        for (const session of onBoardSales) {
            try {
                const subscriptions = ((_a = session === null || session === void 0 ? void 0 : session.customerInfo) === null || _a === void 0 ? void 0 : _a.email) &&
                    (await this.paymentChargifyService.getAllActiveSubscriptionsFromCustomerEmail((_b = session === null || session === void 0 ? void 0 : session.customerInfo) === null || _b === void 0 ? void 0 : _b.email));
                if (!(0, lodash_1.isEmpty)(subscriptions)) {
                    const subscription = (0, lodash_1.first)(subscriptions);
                    const deal = await this.hubspotService.getDealBySubscriptionId(Number(subscription === null || subscription === void 0 ? void 0 : subscription.id));
                    session.dealDetails = {
                        dealId: deal === null || deal === void 0 ? void 0 : deal.id,
                        dealExists: !!deal,
                        email: (_c = session === null || session === void 0 ? void 0 : session.customerInfo) === null || _c === void 0 ? void 0 : _c.email,
                    };
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new common_1.HttpException({ message: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
            await (0, functions_1.sleep)(3000);
        }
        return onBoardSales;
    }
    async getOnboardMetricsByPaidSales(page, perPage, startDate, endDate) {
        let filterQuery = {};
        if (startDate && endDate) {
            filterQuery = {
                createdAt: {
                    $gte: luxon_1.DateTime.fromISO(startDate, {
                        zone: constants_1.DEFAULT_TIMEZONE,
                    }).startOf('day'),
                    $lte: luxon_1.DateTime.fromISO(endDate, {
                        zone: constants_1.DEFAULT_TIMEZONE,
                    }).endOf('day'),
                },
                currentStep: { $ne: types_1.Step.PLACE_ORDER },
            };
        }
        const skip = page * perPage;
        const [paidSalesCount, onBoardSalesReport] = await Promise.all([
            this.sessionService.onboardSalesReportCount(filterQuery),
            this.sessionService.onboardSalesReport(filterQuery, skip, perPage),
        ]);
        return {
            SalesDetails: paginator_1.PaginatorSchema.build(paidSalesCount, onBoardSalesReport, page, perPage),
        };
    }
    async getOnboardMetricsByUniqueVisits(page, perPage, startDate, endDate) {
        let filterQuery = {};
        if (startDate && endDate) {
            filterQuery = {
                createdAt: {
                    $gte: luxon_1.DateTime.fromISO(startDate, {
                        zone: constants_1.DEFAULT_TIMEZONE,
                    }).startOf('day'),
                    $lte: luxon_1.DateTime.fromISO(endDate, {
                        zone: constants_1.DEFAULT_TIMEZONE,
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
                    $match: Object.assign({}, filterQuery),
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
                .read('secondaryPreferred', [{ nodeType: mongodb_type_1.NODE_TYPES.ANALYTICS }])
                .skip(skip)
                .limit(perPage)
                .exec(),
        ]);
        const onBoardReportWithPagination = paginator_1.PaginatorSchema.build(visitsCount, onBoardSalesReport, page, perPage);
        return {
            SalesDetails: onBoardReportWithPagination,
        };
    }
    async getOnboardMetricsByBooks(page, perPage, startDate, endDate) {
        let filterQuery = {};
        if (startDate && endDate) {
            filterQuery = {
                createdAt: {
                    $gte: luxon_1.DateTime.fromISO(startDate, {
                        zone: constants_1.DEFAULT_TIMEZONE,
                    }).startOf('day'),
                    $lte: luxon_1.DateTime.fromISO(endDate, {
                        zone: constants_1.DEFAULT_TIMEZONE,
                    }).endOf('day'),
                },
                currentStep: { $eq: types_1.Step.YOUR_BOOK },
            };
        }
        const skip = page * perPage;
        const [booksCount, onBoardSalesReport] = await Promise.all([
            this.sessionModel.countDocuments(filterQuery).exec(),
            this.sessionModel
                .aggregate([
                {
                    $match: Object.assign({}, filterQuery),
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
                .read('secondaryPreferred', [{ nodeType: mongodb_type_1.NODE_TYPES.ANALYTICS }])
                .skip(skip)
                .limit(perPage),
        ]);
        const onBoardReportWithPagination = paginator_1.PaginatorSchema.build(booksCount, onBoardSalesReport, page, perPage);
        return {
            SalesDetails: onBoardReportWithPagination,
        };
    }
    async getOnboardMetricsByAutoLogin(page, perPage, startDate, endDate) {
        let filterQuery = {};
        if (startDate && endDate) {
            filterQuery = {
                createdAt: {
                    $gte: luxon_1.DateTime.fromISO(startDate, {
                        zone: constants_1.DEFAULT_TIMEZONE,
                    }).startOf('day'),
                    $lte: luxon_1.DateTime.fromISO(endDate, {
                        zone: constants_1.DEFAULT_TIMEZONE,
                    }).endOf('day'),
                },
            };
        }
        const skip = page * perPage;
        const [onBoardSalesReport, autoLoginCount] = await Promise.all([
            this.sessionModel
                .aggregate([
                {
                    $match: Object.assign({}, filterQuery),
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
                .read('secondaryPreferred', [{ nodeType: mongodb_type_1.NODE_TYPES.ANALYTICS }])
                .skip(skip)
                .limit(perPage),
            this.sessionModel
                .aggregate([
                {
                    $match: Object.assign(Object.assign({}, filterQuery), { currentStep: { $ne: types_1.Step.PLACE_ORDER } }),
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
                .read('secondaryPreferred', [{ nodeType: mongodb_type_1.NODE_TYPES.ANALYTICS }]),
        ]);
        const onBoardReportWithPagination = paginator_1.PaginatorSchema.build(autoLoginCount.length, onBoardSalesReport, page, perPage);
        return {
            SalesDetails: onBoardReportWithPagination,
        };
    }
    async getOnboardMetricsByCancellations(page, perPage, startDate, endDate) {
        let filterQuery = {};
        if (startDate && endDate) {
            filterQuery = {
                createdAt: {
                    $gte: luxon_1.DateTime.fromISO(startDate, {
                        zone: constants_1.DEFAULT_TIMEZONE,
                    }).startOf('day'),
                    $lte: luxon_1.DateTime.fromISO(endDate, {
                        zone: constants_1.DEFAULT_TIMEZONE,
                    }).endOf('day'),
                },
                currentStep: { $ne: types_1.Step.PLACE_ORDER },
            };
        }
        const skip = page * perPage;
        const [onBoardSalesReport, cancellationCount] = await Promise.all([
            this.sessionModel
                .aggregate([
                {
                    $match: Object.assign({}, filterQuery),
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
                .read('secondaryPreferred', [{ nodeType: mongodb_type_1.NODE_TYPES.ANALYTICS }])
                .skip(skip)
                .limit(perPage),
            this.sessionModel
                .aggregate([
                {
                    $match: Object.assign(Object.assign({}, filterQuery), { currentStep: { $ne: types_1.Step.PLACE_ORDER } }),
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
                .read('secondaryPreferred', [{ nodeType: mongodb_type_1.NODE_TYPES.ANALYTICS }]),
        ]);
        const onBoardReportWithPagination = paginator_1.PaginatorSchema.build(cancellationCount.length, onBoardSalesReport, page, perPage);
        return {
            SalesDetails: onBoardReportWithPagination,
        };
    }
    async getOnboardMetricsByFilter(page, perPage, filter, startDate, endDate) {
        const props = [
            'marketingParameters.channel',
            'marketingParameters.utmSource',
            'marketingParameters.utmMedium',
            'marketingParameters.utmContent',
            'marketingParameters.utmTerm',
            'marketingParameters.affiliateId',
            'salesParameters.orderSystem',
            'salesParameters.salesAgent',
        ];
        const match = {
            customer: {
                $ne: null,
            },
        };
        props.forEach((prop) => {
            if (filter[prop]) {
                match[prop] = filter[prop];
            }
        });
        if (filter['coachInfo.email'] || filter['coachInfo.name']) {
            const or = [];
            if (filter['coachInfo.email']) {
                or.push({ email: new RegExp(filter['coachInfo.email'], 'i') });
            }
            if (filter['coachInfo.name']) {
                or.push({ name: new RegExp(filter['coachInfo.name'], 'i') });
            }
            const coach = await this.coachesService.filter({
                $or: or,
            });
            if (coach.length == 0) {
                return {
                    SalesDetails: paginator_1.PaginatorSchema.build(0, [], page, perPage),
                };
            }
            match['coach'] = {
                $in: coach.map(({ _id }) => _id),
            };
        }
        if (filter['customerInfo.email'] ||
            filter['customerInfo.firstName'] ||
            filter['customerInfo.lastName']) {
            const or = [];
            if (filter['customerInfo.email']) {
                or.push({
                    email: new RegExp(filter['customerInfo.email'], 'i'),
                });
            }
            if (filter['customerInfo.firstName']) {
                or.push({
                    firstName: new RegExp(filter['customerInfo.firstName'], 'i'),
                });
            }
            if (filter['customerInfo.lastName']) {
                or.push({ lastName: new RegExp(filter['customerInfo.lastName'], 'i') });
            }
            const customer = await this.customersService.findAll({
                $or: or,
            });
            if (customer.length == 0) {
                return {
                    SalesDetails: paginator_1.PaginatorSchema.build(0, [], page, perPage),
                };
            }
            match['customer'] = {
                $in: customer.map(({ _id }) => _id),
            };
        }
        if (filter['offerDetails.title']) {
            const offer = await this.offersService.findAll({
                title: new RegExp(filter['offerDetails.title'], 'i'),
            });
            if (offer.length == 0) {
                return {
                    SalesDetails: paginator_1.PaginatorSchema.build(0, [], page, perPage),
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
                    $gte: luxon_1.DateTime.fromISO(startDate, {
                        zone: constants_1.DEFAULT_TIMEZONE,
                    }).startOf('day'),
                    $lte: luxon_1.DateTime.fromISO(endDate, {
                        zone: constants_1.DEFAULT_TIMEZONE,
                    }).endOf('day'),
                },
            };
        }
        const skip = page * perPage;
        const [onBoardSalesReport, onBoardSalesReportCount] = await Promise.all([
            this.sessionService.onboardSalesReport(Object.assign(Object.assign({}, dateFilter), match), skip, perPage),
            this.sessionService.onboardSalesReportCount(Object.assign(Object.assign({}, dateFilter), match)),
        ]);
        const onBoardSalesReportPagination = paginator_1.PaginatorSchema.build(onBoardSalesReportCount, onBoardSalesReport, page, perPage);
        return { SalesDetails: onBoardSalesReportPagination };
    }
    async getOnboardMetricsBySearch(page, perPage, searchQuery) {
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
                .read('secondaryPreferred', [{ nodeType: mongodb_type_1.NODE_TYPES.ANALYTICS }])
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
                .read('secondaryPreferred', [{ nodeType: mongodb_type_1.NODE_TYPES.ANALYTICS }]),
        ]);
        const onBoardSalesReportPagination = paginator_1.PaginatorSchema.build(onBoardSalesReportCount.length, onBoardSalesReport, page, perPage);
        return { SalesDetails: onBoardSalesReportPagination };
    }
    async getSessionByDateRange(fromDate, toDate) {
        return this.sessionModel
            .find({ createdAt: { $gte: fromDate, $lt: toDate } })
            .populate(['offer', 'customer']);
    }
    async getSalesWithDeals(fromDate, toDate) {
        const SessionDocument = await this.getSessionByDateRange(fromDate, toDate);
        const inheritListPromise = SessionDocument.map(async (session) => {
            const stripeId = (0, lodash_1.get)(session, ['customer', 'stripeId'], 0);
            const saleDate = (0, lodash_1.get)(session, 'createdAt');
            const customerEmail = (0, lodash_1.get)(session, ['customer', 'email'], '');
            const offerCode = (0, lodash_1.get)(session, ['offer', 'code'], '');
            const deal = stripeId &&
                (await this.hubspotService.getDealBySubscriptionId(stripeId));
            return {
                stripeId: stripeId !== null && stripeId !== void 0 ? stripeId : '',
                saleDate: saleDate !== null && saleDate !== void 0 ? saleDate : '',
                customerEmail: customerEmail !== null && customerEmail !== void 0 ? customerEmail : '',
                offerCode: offerCode !== null && offerCode !== void 0 ? offerCode : '',
                dealExists: !!deal,
            };
        });
        const salesList = await Promise.all(inheritListPromise);
        const res = {
            sales: salesList,
        };
        return res;
    }
    async getSessionWithCoachByDateRange(fromDate, toDate) {
        return this.sessionModel
            .find({
            createdAt: { $gte: fromDate, $lt: toDate },
            coachingSelection: { $exists: true, $ne: null },
        })
            .populate(['customer', 'coach', 'offer']);
    }
    async getCoachEmailReminders(fromDate, toDate) {
        const sessionDocument = await this.getSessionWithCoachByDateRange(fromDate, toDate);
        const emailReminderList = sessionDocument.map((session) => {
            var _a;
            const customerEmail = (0, lodash_1.get)(session, ['customer', 'email'], '');
            const coachName = (0, lodash_1.get)(session, ['coach', 'name'], '');
            const coachEmail = (0, lodash_1.get)(session, ['coach', 'email'], '');
            const meetingDateTIme = (_a = (0, lodash_1.get)(session, ['coachingSelection', 'utcStart'], '')) === null || _a === void 0 ? void 0 : _a.toLocaleString();
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
        });
        const result = {
            emailReminders: emailReminderList,
        };
        return result;
    }
    async createCustomerUnsubscriptionFromWebhook(event) {
        const subscriptionId = (0, lodash_1.get)(event, ['payload', 'subscription', 'id'], '');
        const customerId = (0, lodash_1.get)(event, ['payload', 'subscription', 'customer', 'id'], '');
        const subObj = await this.paymentChargifyService.getSubscriptionBySubId(subscriptionId.toString());
        const status = (0, lodash_1.get)(subObj, ['subscription', 'state']);
        const previousStatus = (0, lodash_1.get)(subObj, ['subscription', 'previous_state']);
        return this.customersService.createSubscriptionorUnsubscription(customerId, subscriptionId, status, previousStatus);
    }
    async customerUnsubscriptionReport(dto) {
        return this.customersService.unsubscriptionReport(dto);
    }
    async bindCustomer(dto, session) {
        const existingCustomer = await this.customersService.findByEmail(dto.email);
        let customer;
        if (existingCustomer) {
            if (existingCustomer.status === types_3.Status.ACTIVE) {
                const authenticatesSuccessfully = await this.customersService.authenticate(dto.email, dto.password);
                if (!authenticatesSuccessfully) {
                    throw new common_1.UnauthorizedException();
                }
            }
            customer = await this.customersService.syncCustomer(dto, existingCustomer.status, existingCustomer);
        }
        if (!customer) {
            customer = await this.customersService.syncCustomer(dto, types_3.Status.PENDING);
        }
        const stepResultIndex = `stepResults.${types_1.Step.PLACE_ORDER}`;
        const stepResult = {
            status: types_1.StepStatus.SUCCESS,
            timestamp: luxon_1.DateTime.now().toJSDate(),
        };
        const updated = await this.sessionModel
            .updateOne({ _id: session._id }, { customer: customer.id, [stepResultIndex]: stepResult })
            .exec();
        if (!updated.acknowledged) {
            throw new common_1.InternalServerErrorException();
        }
        return customer;
    }
    async getOfferProducts(offerId) {
        const result = await this.offerModel
            .findById(offerId)
            .populate(['products'])
            .select('products')
            .exec();
        const products = result.products;
        return products.map((product) => product.castTo(product_1.Product));
    }
    getPreviousStep(steps, currentStep) {
        switch (currentStep) {
            case types_1.Step.ADDON:
                return types_1.Step.PLACE_ORDER_WAIT;
            case types_1.Step.ADDON_WAIT:
                return types_1.Step.ADDON;
            case types_1.Step.SCHEDULE_COACHING:
                return this.getPrevStepFromArray(steps, currentStep);
            case types_1.Step.SCHEDULE_COACHING_WAIT:
            case types_1.Step.TRAINING_WEBINAR:
            case types_1.Step.BOOK_DETAILS:
                return types_1.Step.SCHEDULE_COACHING;
            case types_1.Step.BOOK_DETAILS_WAIT:
                return types_1.Step.BOOK_DETAILS;
            case types_1.Step.YOUR_BOOK:
                return types_1.Step.BOOK_DETAILS_WAIT;
            case types_1.Step.PLACE_ORDER:
                return undefined;
            case types_1.Step.PLACE_ORDER_WAIT:
            default:
                return types_1.Step.PLACE_ORDER;
        }
    }
    getNextStep(steps, currentStep) {
        let nextStepFromArray;
        switch (currentStep) {
            case types_1.Step.PLACE_ORDER:
                return types_1.Step.PLACE_ORDER_WAIT;
            case types_1.Step.PLACE_ORDER_WAIT:
                throw new Error('Invalid session query for order');
            case types_1.Step.ADDON:
                return types_1.Step.ADDON_WAIT;
            case types_1.Step.ADDON_WAIT:
                throw new Error('Invalid session query for addon');
            case types_1.Step.SCHEDULE_COACHING:
                return types_1.Step.SCHEDULE_COACHING_WAIT;
            case types_1.Step.SCHEDULE_COACHING_WAIT:
                nextStepFromArray = this.getNextStepFromArray(steps, currentStep);
                return nextStepFromArray || types_1.Step.BOOK_DETAILS;
            case types_1.Step.TRAINING_WEBINAR:
                return types_1.Step.BOOK_DETAILS;
            case types_1.Step.BOOK_DETAILS:
                return types_1.Step.BOOK_DETAILS_WAIT;
            case types_1.Step.BOOK_DETAILS_WAIT:
                return types_1.Step.YOUR_BOOK;
            case types_1.Step.YOUR_BOOK:
                return types_1.Step.ORDER_CONFIRMATION;
            case types_1.Step.ORDER_CONFIRMATION:
                return types_1.Step.DONE;
            default:
                return types_1.Step.PLACE_ORDER;
        }
    }
    async getCoachFromOwner(sessionDocument) {
        let coach, contactOwnerId;
        const contactHubspotId = (0, lodash_1.get)(sessionDocument, ['customer', 'hubspotId'], null);
        try {
            if (contactHubspotId) {
                contactOwnerId = await this.hubspotService.getContactOwnerId(contactHubspotId);
            }
            if (contactOwnerId) {
                coach = await this.coachesService.findByOwnerId(contactOwnerId);
            }
            return coach || null;
        }
        catch (e) {
            return null;
        }
    }
    async ensureSessionHasCoach(sessionDocument) {
        if (!sessionDocument.coach) {
            await this.findAndAssignCoachToSession(sessionDocument, true);
        }
    }
    formatOrderNumber(orderNumber) {
        const order = (0, lodash_1.padStart)(orderNumber.toString(), 7, '0');
        return `AFY${order}`;
    }
    async populateSession(sessionDocument) {
        var _a, _b, _c;
        const session = sessionDocument.castTo(session_1.Session);
        let offerDocument = sessionDocument.offer;
        const customer = sessionDocument.customer;
        session.offer = this.updateOfferDescriptions(session.offer);
        const payments = (0, lodash_1.get)(sessionDocument, ['payments'], {});
        const addons = offerDocument.addons.map((addon) => addon.offer.toString());
        const paymentIds = (0, lodash_1.get)(sessionDocument, ['paymentIntents']);
        const steps = sessionDocument.steps;
        const step = sessionDocument.currentStep;
        const previousStep = this.getPreviousStep(steps, step);
        const previousStepInfo = (0, lodash_1.get)(sessionDocument, [
            'stepResults',
            previousStep,
        ]);
        const allProducts = [];
        session.step = step;
        const isAddonRelatedStep = [types_1.Step.ADDON, types_1.Step.ADDON_WAIT].includes(step);
        session.currentOffer = session.offer;
        const paymentId = (0, lodash_1.get)(paymentIds, [
            (_a = offerDocument === null || offerDocument === void 0 ? void 0 : offerDocument.id) === null || _a === void 0 ? void 0 : _a.toString(),
        ]);
        session.currentOffer.paymentId = paymentId;
        session.order = this.formatOrderNumber(sessionDocument.order);
        if (sessionDocument.guideOrdered ||
            offerDocument.accountType === types_3.AccountType.DENTIST) {
            session.guideOrdered = sessionDocument.guideOrdered;
            session.guideOrder = sessionDocument.guideOrder;
        }
        const coachingSelection = sessionDocument.coachingSelection;
        if (!(0, lodash_1.isEmpty)(coachingSelection)) {
            session.coachingSelection = coachingSelection;
            const scheduleDate = luxon_1.DateTime.fromJSDate(coachingSelection.utcStart)
                .setZone(coachingSelection.selectedTz)
                .setLocale('en-US');
            const scheduleData = [
                scheduleDate.toFormat('LLLL d'),
                `(${(0, string_1.capitalizeFirstLetter)(scheduleDate.toRelativeCalendar())}),`,
                scheduleDate.toFormat('t'),
            ];
            session.scheduleDate = scheduleData.join(' ');
        }
        if (isAddonRelatedStep) {
            for (const addon of addons) {
                const payment = (0, lodash_1.get)(payments, [addon]);
                const addonAcceptance = (0, lodash_1.get)(sessionDocument, [
                    'offerAcceptance',
                    addon,
                ]);
                const addonWasRefused = addonAcceptance === false;
                if (!payment && !addonWasRefused) {
                    const paymentId = (0, lodash_1.get)(paymentIds, addon);
                    const addonOfferDocument = await this.offerModel
                        .findById(addon)
                        .exec();
                    session.currentOffer = addonOfferDocument.castTo(offer_1.Offer);
                    session.currentOffer = this.updateOfferDescriptions(session.currentOffer);
                    session.currentOffer.paymentId = paymentId;
                    break;
                }
            }
        }
        if (step === types_1.Step.TRAINING_WEBINAR) {
            const webinarCode = (_b = offerDocument === null || offerDocument === void 0 ? void 0 : offerDocument.webinar) === null || _b === void 0 ? void 0 : _b.id;
            if (webinarCode) {
                const webinarData = await this.disService.getWebinarInfo(webinarCode);
                session.webinar = {
                    title: webinarData.title,
                    caption: offerDocument.webinar.caption,
                    description: offerDocument.webinar.description,
                    image: offerDocument.webinar.image,
                    slots: webinarData.upcomingTimes,
                };
            }
            else {
                this.logger.error('could not find webinar code in offer document');
            }
        }
        if (previousStep) {
            session.previousStep = {
                step: previousStep,
                status: previousStepInfo === null || previousStepInfo === void 0 ? void 0 : previousStepInfo.status,
                description: previousStepInfo === null || previousStepInfo === void 0 ? void 0 : previousStepInfo.description,
            };
        }
        if (customer === null || customer === void 0 ? void 0 : customer.hubspotId) {
            const autoLoginToken = await this.disService.getAutoLoginToken(customer.hubspotId);
            session.autoLoginToken = autoLoginToken;
        }
        for (const addon of addons) {
            const addonAcceptance = (0, lodash_1.get)(sessionDocument, ['offerAcceptance', addon]);
            if (addonAcceptance) {
                const addonOfferDocument = (await this.offerModel
                    .findById(addon)
                    .populate('products')
                    .exec());
                const hasProducts = (0, lodash_1.get)(addonOfferDocument, ['products', 'length']);
                if (hasProducts) {
                    addonOfferDocument.products.forEach((product) => {
                        allProducts.push(product);
                    });
                }
                break;
            }
        }
        const metricsSent = (_c = sessionDocument.metrics) === null || _c === void 0 ? void 0 : _c[step];
        if (!metricsSent) {
            offerDocument = await offerDocument.populate('products');
            const hasProducts = (0, lodash_1.get)(offerDocument, 'products.length');
            if (hasProducts) {
                offerDocument.products.forEach((product) => {
                    allProducts.push(product);
                });
            }
            const logPayload = this.buildLoggingPayload(session, allProducts, sessionDocument);
            this.logger.log({ payload: logPayload }, contexts_1.CONTEXT_ONBOARD_METRICS);
            await this.sessionModel
                .updateOne({ _id: sessionDocument._id }, {
                $set: {
                    [`metrics.${step}`]: true,
                },
            })
                .exec();
        }
        return session;
    }
    buildLoggingPayload(session, products, sessionDocument) {
        const coach = session.coach;
        const offer = session.offer;
        const webinar = session.webinar;
        const result = {};
        result['channel'] = (0, lodash_1.get)(sessionDocument, 'marketingParameters.channel');
        result['utm_source'] = (0, lodash_1.get)(sessionDocument, 'marketingParameters.utmSource');
        result['utm_medium'] = (0, lodash_1.get)(sessionDocument, 'marketingParameters.utmMedium');
        result['utm_content'] = (0, lodash_1.get)(sessionDocument, 'marketingParameters.utmContent');
        result['utm_term'] = (0, lodash_1.get)(sessionDocument, 'marketingParameters.utmTerm');
        result['affiliate_id'] = (0, lodash_1.get)(sessionDocument, 'marketingParameters.affiliateId');
        result['sessionId'] = session.id;
        result['step'] = session.step;
        result['customer'] = session.customer;
        result['offerCode'] = offer.code;
        result['offerTitle'] = offer.title;
        result['outcome'] = session.previousStep;
        result['coachName'] = (0, lodash_1.get)(coach, 'name');
        result['coachMeetingDate'] = (0, lodash_1.get)(sessionDocument, 'coachingSelection');
        result['webinarTitle'] = (0, lodash_1.get)(webinar, 'title');
        result['webinarDate'] = (0, lodash_1.get)(sessionDocument, 'webinarSelection');
        result['value'] = products.map((product) => {
            var _a, _b;
            let title = (_a = product.title) !== null && _a !== void 0 ? _a : '';
            if (!title.length) {
                title = product.stripeId;
            }
            const value = (_b = product.value) !== null && _b !== void 0 ? _b : 0;
            return { [title]: value };
        });
        return result;
    }
    updateOfferDescriptions(offer) {
        const usDateFormat = this.calculateTrialDateForOffer(offer);
        offer.description1 = (0, lodash_1.get)(offer, ['description1'], '').replace('{{date}}', usDateFormat);
        offer.description2 = (0, lodash_1.get)(offer, ['description2'], '').replace('{{date}}', usDateFormat);
        return offer;
    }
    calculateTrialDateForOffer(offer) {
        const trialPeriod = (0, lodash_1.get)(offer, ['trial'], 0);
        const d = new Date();
        const trialDate = luxon_1.DateTime.fromJSDate(d, { zone: 'UTC' }).plus({
            days: trialPeriod,
        });
        const usDateFormat = this.toUsDateFormat(trialDate);
        return usDateFormat;
    }
    toUsDateFormat(dateTime) {
        return dateTime.toFormat('LL/dd/yyyy');
    }
    async registerPaymentOutcome(sessionId, clientSecret, outcome, description, reference) {
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
            type: types_1.OfferType.MAIN,
        });
        const step = isMainOffer ? types_1.Step.PLACE_ORDER_WAIT : types_1.Step.ADDON;
        const status = outcome;
        const timestamp = luxon_1.DateTime.now().toJSDate();
        const stepResult = {
            status,
            description,
            timestamp,
        };
        const updateData = { [`stepResults.${step}`]: stepResult };
        if (outcome == types_1.StepStatus.SUCCESS) {
            updateData[`payments.${offerId}`] = {
                reference,
                timestamp,
            };
        }
        await this.sessionModel.updateOne({ _id: sessionId }, updateData).exec();
        return session;
    }
    async updateCustomerSocialMediaTraining({ email, planName, }) {
        this.logger.log({
            payload: {
                email,
                method: 'updateCustomerSocialMediaTraining',
                usageDate: luxon_1.DateTime.now(),
                planName,
            },
        }, contexts_1.CONTEXT_SOCIAL_MEDIA_TRAINING);
        const hubspotCustomer = await this.hubspotService.getContactDetailsByEmail(email);
        this.logger.log({
            payload: {
                email,
                method: 'updateCustomerSocialMediaTraining',
                usageDate: luxon_1.DateTime.now(),
                hubspotCustomer,
            },
        }, contexts_1.CONTEXT_SOCIAL_MEDIA_TRAINING);
        const vid = hubspotCustomer.vid.toString();
        console.info({ vid });
        const socialMediaPlans = await this.cmsServices.getSocialMediaTrainingConfig();
        this.logger.log({
            payload: {
                email,
                method: 'updateCustomerSocialMediaTraining',
                usageDate: luxon_1.DateTime.now(),
                socialMediaPlans,
            },
        }, contexts_1.CONTEXT_SOCIAL_MEDIA_TRAINING);
        let isPremiumUser = false;
        Object.values(socialMediaPlans).forEach((planValue) => {
            if (planName === null || planName === void 0 ? void 0 : planName.includes(planValue)) {
                isPremiumUser = true;
            }
        });
        const hubspotPayload = {
            properties: {
                afy_social_media_training: isPremiumUser ? 'Yes' : 'No',
            },
        };
        this.logger.log({
            payload: {
                email,
                method: 'updateCustomerSocialMediaTraining',
                usageDate: luxon_1.DateTime.now(),
                hubspotPayload,
            },
        }, contexts_1.CONTEXT_SOCIAL_MEDIA_TRAINING);
        await this.hubspotService.updateContactById(vid, hubspotPayload);
    }
    async getSessionToSyncDeals(since) {
        if (!since) {
            since = luxon_1.DateTime.fromISO('2022-09-01');
        }
        const filter = {
            $and: [
                {
                    currentStep: {
                        $not: { $in: [types_1.Step.PLACE_ORDER, types_1.Step.PLACE_ORDER_WAIT] },
                    },
                },
                { createdAt: { $gte: luxon_1.DateTime.fromISO(since.toISODate()) } },
                {
                    $or: [{ deals: { $exists: false } }, { deals: { $eq: null } }],
                },
            ],
        };
        const options = {
            sort: { createdAt: 'asc' },
            populate: 'customer',
        };
        return this.sessionModel.findOne(filter, {}, options).exec();
    }
    async syncSessionWithDeal(session, subscription, deal) {
        const dealRef = {
            dealId: deal.id,
            subscriptionId: subscription.id.toString(10),
        };
        return this.sessionModel
            .findByIdAndUpdate(session._id, { $push: { deals: dealRef } }, { new: true })
            .exec();
    }
    async chargifyWebhookActivity(customerEmail, dto, body) {
        const { event } = dto;
        const customer = await this.customersService.findByEmail(customerEmail);
        const data = {
            customer: customer,
            event: event,
            metadata: { body },
        };
        this.logger.log({
            payload: {
                method: 'chargifyWebhookActivity',
                usageDate: luxon_1.DateTime.now(),
                payload: data,
            },
        }, contexts_1.CONTEXT_ONBOARD_METRICS);
        return this.customerEventsService.createEvent(customer, data);
    }
    async getPaymentDetails({ sessionId, offerId }) {
        return this.sessionModel
            .findOne({ _id: sessionId, [`payments.${offerId}`]: { $exists: true } })
            .exec();
    }
    async reCreateHubspotDeal(dto) {
        const eventId = new mongodb_1.ObjectId();
        const subscriptions = await this.paymentChargifyService.getAllActiveSubscriptionsFromCustomerEmail(dto.email);
        if (!(0, lodash_1.isEmpty)(subscriptions)) {
            const subscription = (0, lodash_1.first)(subscriptions);
            const manualFlag = true;
            return this.createHubspotDeal(eventId.toString(), subscription, subscription === null || subscription === void 0 ? void 0 : subscription.created_at, undefined, undefined, manualFlag);
        }
    }
    async orderBookAndUpdateSession({ sessionId, draftId, quantity, isDigital }, jwt) {
        var _a, _b;
        const session = await this.findSession(sessionId);
        if (!session) {
            throw new common_1.HttpException('Session not found', common_1.HttpStatus.NOT_FOUND);
        }
        try {
            const customer = session.customer;
            const customerAddress = customer.billing;
            if (!customerAddress) {
                throw new Error('could not find shipping address');
            }
            const shippingAddressRequest = await this.http.post('user/address', {
                firstName: customer.firstName,
                lastName: customer.lastName,
                country: customerAddress.country,
                city: customerAddress.city,
                state: customerAddress.state,
                pincode: customerAddress.zip,
                addressLine1: customerAddress.address1,
            }, {
                headers: {
                    Authorization: jwt,
                },
            });
            if (((_a = shippingAddressRequest === null || shippingAddressRequest === void 0 ? void 0 : shippingAddressRequest.data) === null || _a === void 0 ? void 0 : _a.statusCode) !== 0) {
                throw new Error('could not create shipping address');
            }
            const order = await this.http.post('order', {
                sessionId,
                draft_id: draftId,
                shippingAddressId: shippingAddressRequest === null || shippingAddressRequest === void 0 ? void 0 : shippingAddressRequest.data.data._id,
                quantity,
                isDigital,
            }, {
                headers: {
                    Authorization: jwt,
                },
            });
            if (order.data.statusCode !== 0) {
                throw new Error(order.data.message);
            }
            session['currentStep'] = this.getNextStep(session.steps || [], session.currentStep);
            await this.sessionModel.findByIdAndUpdate(session.id, session).exec();
            const updatedSession = await this.findSession(session.id);
            const populatedSession = await this.populateSession(updatedSession);
            return { session: populatedSession, order: (_b = order.data) === null || _b === void 0 ? void 0 : _b.data };
        }
        catch (err) {
            if (err instanceof Error) {
                this.logger.error({
                    usageDate: luxon_1.DateTime.now(),
                    error: err.message,
                    method: 'OnboardService@orderBookAndUpdateSession',
                });
            }
            throw new common_1.HttpException('error while ordering book', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOfferById(offerId) {
        return this.offerModel.findById(offerId).exec();
    }
    async summary(session) {
        var _a, _b, _c, _d, _e;
        const { coachingSelection } = session;
        const offer = session.offer;
        const customer = session.customer;
        const scheduleDate = luxon_1.DateTime.fromJSDate(coachingSelection.utcStart)
            .setZone(coachingSelection.selectedTz)
            .setLocale('en-US');
        const scheduleData = [
            scheduleDate.toFormat('LLLL d'),
            `(${(0, string_1.capitalizeFirstLetter)(scheduleDate.toRelativeCalendar())}),`,
            scheduleDate.toFormat('t'),
        ];
        if (offer.accountType === types_3.AccountType.DENTIST && session.guideOrdered) {
            const guideOrder = session.guideOrder;
            const address = (_a = guideOrder === null || guideOrder === void 0 ? void 0 : guideOrder.shippingAddress) === null || _a === void 0 ? void 0 : _a.addressLine1;
            const city = (_b = guideOrder === null || guideOrder === void 0 ? void 0 : guideOrder.shippingAddress) === null || _b === void 0 ? void 0 : _b.city;
            const state = (_c = guideOrder === null || guideOrder === void 0 ? void 0 : guideOrder.shippingAddress) === null || _c === void 0 ? void 0 : _c.state;
            const zip = (_d = guideOrder === null || guideOrder === void 0 ? void 0 : guideOrder.shippingAddress) === null || _d === void 0 ? void 0 : _d.pincode;
            const country = (_e = guideOrder === null || guideOrder === void 0 ? void 0 : guideOrder.shippingAddress) === null || _e === void 0 ? void 0 : _e.country;
            return {
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
        return {
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
    async logBookOrderWhileTrial(customer, dto) {
        var _a;
        const subscriptions = await this.paymentChargifyService.getOnlySubscriptionsFromCustomerEmail(customer.email);
        let currentTrialSubscription = null;
        if (subscriptions.length > 0) {
            for (const subscription of subscriptions) {
                const metadata = await this.paymentChargifyService.getMetadataForResource('subscriptions', subscription.id);
                const sessionMetadata = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.metadata) === null || _a === void 0 ? void 0 : _a.find((meta) => (meta === null || meta === void 0 ? void 0 : meta.name) === 'sessionId');
                if (sessionMetadata) {
                    const sessionId = sessionMetadata.value;
                    if (subscription.state === types_6.State.TRIALING &&
                        dto.sessionId === sessionId) {
                        currentTrialSubscription = subscription;
                    }
                }
            }
        }
        if (currentTrialSubscription) {
            const logInput = {
                customer: {
                    email: customer.email,
                    name: `${customer.firstName} ${customer.lastName}`,
                },
                event: {
                    name: 'book-generated-while-trial',
                    namespace: 'book-generation',
                },
                source: 'digital-services',
                trace: (0, uuid_1.v4)(),
                tags: [
                    `quantity:${dto.quantity}`,
                    `subscription-id:${currentTrialSubscription.id}`,
                ],
            };
            await this.afyLoggerService.sendLog(logInput);
        }
    }
};
OnboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)(constants_1.COACHING_REMINDER_EMAIL_NAME)),
    __param(1, (0, mongoose_1.InjectModel)(offer_schema_1.Offer.name)),
    __param(2, (0, mongoose_1.InjectModel)(session_schema_1.Session.name)),
    __param(3, (0, mongoose_1.InjectModel)(webhook_idempotency_schema_1.WebhookIdempotency.name)),
    __param(4, (0, mongoose_1.InjectModel)(book_option_schema_1.BookOption.name)),
    __param(15, (0, common_1.Inject)('CONTENT_CONFIG')),
    __param(21, (0, common_1.Inject)('SCHEDULE_COACH_DURATION')),
    __param(25, (0, common_1.Inject)('HTTP_DIS')),
    __param(28, (0, bull_1.InjectQueue)(constants_1.DEALS_COACHING_DETAILS_PROCESSOR)),
    __metadata("design:paramtypes", [Object, mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        dis_service_1.DisService,
        config_1.ConfigService,
        customers_service_1.CustomersService,
        coaches_service_1.CoachesService,
        dentist_coaches_service_1.DentistCoachesService,
        generate_book_service_1.GenerateBookService,
        hubspot_service_1.HubspotService,
        hubspot_sync_actions_services_1.HubspotSyncActionsServices,
        leads_service_1.LeadsService,
        cms_service_1.CmsService, Object, products_service_1.ProductsService,
        common_1.Logger,
        payments_service_1.PaymentChargifyService,
        email_reminders_service_1.EmailRemindersService,
        customer_events_service_1.CustomerEventsService, Number, calendar_service_1.CalendarService,
        customer_properties_service_1.CustomerPropertiesService,
        session_service_1.SessionService,
        axios_1.Axios,
        afy_logger_service_1.default,
        offers_service_1.OffersService, Object])
], OnboardService);
exports.OnboardService = OnboardService;
//# sourceMappingURL=onboard.service.js.map