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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const types_1 = require("../chargify/domain/types");
const lodash_1 = require("lodash");
const bcrypt = require("bcryptjs");
const randomstring_1 = require("randomstring");
const hubspot_service_1 = require("../../legacy/dis/legacy/hubspot/hubspot.service");
const customers_service_1 = require("../../customers/customers/customers.service");
const payments_service_1 = require("../payment_chargify/payments.service");
const products_service_1 = require("../../onboard/products/products.service");
const dateFormatters_1 = require("../../internal/common/utils/dateFormatters");
const luxon_1 = require("luxon");
const cms_service_1 = require("../../cms/cms/cms.service");
const onboard_service_1 = require("../../onboard/onboard.service");
const string_1 = require("../../internal/utils/string");
const contexts_1 = require("../../internal/common/contexts");
const customer_events_service_1 = require("../../customers/customer-events/customer-events.service");
const types_2 = require("../../customers/customer-events/domain/types");
const payments_service_2 = require("../../legacy/dis/legacy/payments/payments.service");
const types_3 = require("../../onboard/products/domain/types");
const hubspot_sync_actions_services_1 = require("../../legacy/dis/legacy/hubspot/hubspot-sync-actions.services");
const bull_1 = require("@nestjs/bull");
const constants_1 = require("../../legacy/dis/legacy/hubspot/constants");
const types_4 = require("../../customers/customers/domain/types");
const afy_notifications_service_1 = require("../../integrations/afy-notifications/afy-notifications.service");
const afy_logger_service_1 = require("../../integrations/afy-logger/afy-logger.service");
let WebhookService = class WebhookService {
    constructor(hubspotService, customersService, paymentChargify, productsService, logger, cmsService, onboardService, customerEventsService, stripeService, hubspotSyncActionsService, afyNotificationsService, queue, afyLoggerService) {
        this.hubspotService = hubspotService;
        this.customersService = customersService;
        this.paymentChargify = paymentChargify;
        this.productsService = productsService;
        this.logger = logger;
        this.cmsService = cmsService;
        this.onboardService = onboardService;
        this.customerEventsService = customerEventsService;
        this.stripeService = stripeService;
        this.hubspotSyncActionsService = hubspotSyncActionsService;
        this.afyNotificationsService = afyNotificationsService;
        this.queue = queue;
        this.afyLoggerService = afyLoggerService;
    }
    async handleSubscriptionStateChange(subscription) {
        const state = (0, lodash_1.get)(subscription, ['state']);
        const customerEmail = (0, lodash_1.get)(subscription, ['customer', 'email']);
        await this.chargifyWebhookActivity(customerEmail, { event: types_2.Events.SUBSCRIPTION_STATE_CHANGE }, subscription);
        if (state === 'active') {
            await this.handleStateToActiveSubscription(subscription);
        }
        else if (state === 'canceled') {
            await this.handleCancelSubscription(subscription);
        }
        else if (state === 'past_due') {
            await this.handlePastDueSubscription(subscription);
        }
        throw new common_1.HttpException({
            message: 'Subscription status change handled successfully',
        }, common_1.HttpStatus.OK);
    }
    async handleStateToActiveSubscription(subscription) {
        var _a, _b, _c, _d;
        const subscriptionId = (0, lodash_1.get)(subscription, ['id']);
        const previousState = (0, lodash_1.get)(subscription, ['previous_state']);
        const state = (0, lodash_1.get)(subscription, ['state']);
        const customerEmail = (0, lodash_1.get)(subscription, ['customer', 'email']);
        const deal = await this.hubspotService.getDealBySubscriptionId(subscriptionId);
        if (!deal) {
            throw new common_1.HttpException({
                message: 'There is no Deal for this customer on Hubspot. No changes made',
            }, common_1.HttpStatus.OK);
        }
        const dealId = (0, lodash_1.get)(deal, ['id']);
        const customer = subscription.customer;
        const allocatedComponents = await this.paymentChargify.getAllAllocatedComponentsFromSubscription(subscription);
        this.logger.log(`allocatedComponents: ${allocatedComponents}`);
        if (!(allocatedComponents === null || allocatedComponents === void 0 ? void 0 : allocatedComponents.length)) {
            this.logger.log({
                payload: {
                    customerEmail,
                    menthod: 'handleStateToActiveSubscription',
                    message: 'There is no allocated component for this subscription',
                    usageDate: luxon_1.DateTime.now(),
                    subscriptionId,
                },
            }, contexts_1.CONTEXT_CHARGIFY);
            throw new common_1.HttpException({
                message: 'There is no allocated component for this subscription, No changes made',
            }, common_1.HttpStatus.NOT_MODIFIED);
        }
        const componentDetails = (0, lodash_1.first)(allocatedComponents);
        this.logger.log(`componentDetails: ${componentDetails}`);
        const chargifyProductId = (0, lodash_1.get)(componentDetails, ['component_id']);
        this.logger.log(`chargifyProductId: ${chargifyProductId}`);
        const product = await this.productsService.findProductByChargifyId(chargifyProductId.toString());
        this.logger.log(`product: ${product}`);
        const propertyData = {
            properties: {
                status: this.hubspotService.translateStripeStatusToHubspot(state),
                dealname: this.hubspotService.createDealName(subscription, customer, product),
                next_recurring_date: (0, dateFormatters_1.convertToHSDate)(subscription.current_period_ends_at),
                [(_a = product.productProperty) !== null && _a !== void 0 ? _a : types_3.HubspotProductProperty.AUTHORIFY_PRODUCT]: product.title,
                [(_b = product.priceProperty) !== null && _b !== void 0 ? _b : types_3.HubspotPriceProperty.RECURRING_REVENUE_AMOUNT]: (_c = product.value) === null || _c === void 0 ? void 0 : _c.toString(10),
                amount: (_d = product.value) === null || _d === void 0 ? void 0 : _d.toString(10),
                dealstage: constants_1.DEAL_DEAL_STAGE_ID,
            },
        };
        await this.customerSubscribeorUnSubscribe(subscription);
        if (previousState !== types_1.State.TRIALING) {
            await this.onboardService.handleBookCredit(product, subscription);
        }
        this.logger.log({
            payload: {
                dealId,
                propertyData,
                usageDate: luxon_1.DateTime.now(),
                message: 'Updating hubspot deals',
            },
        }, contexts_1.CONTEXT_HUBSPOT);
        const handleSubscriptionToActive = { propertyData, dealId };
        await this.chargifyWebhookActivity(customerEmail, { event: types_2.Events.DEAL_UPDATE }, handleSubscriptionToActive);
        await this.hubspotService.updateDeal(dealId, propertyData);
    }
    async handleCancelSubscription(subscription) {
        try {
            await this.afyLoggerService.sendLog({
                customer: {
                    email: subscription.customer.email,
                    name: `${subscription.customer.first_name} ${subscription.customer.last_name}`,
                },
                event: {
                    name: 'subscription-canceled',
                    namespace: 'subscription',
                },
                source: 'digital-services',
                trace: 'subscription-cancelled',
                tags: [`product_name:${subscription.product.name}`, `product_handle:${subscription.product.handle}`],
            });
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    payload: {
                        method: 'handleCancelSubscription',
                        usageDate: luxon_1.DateTime.now(),
                        error,
                    },
                }, error === null || error === void 0 ? void 0 : error.stack, contexts_1.CONTEXT_ERROR);
            }
        }
        await this.handleDeleteSubscription(subscription);
        await this.customerSubscribeorUnSubscribe(subscription);
    }
    async handlePastDueSubscription(subscription) {
        if (!subscription) {
            throw new common_1.HttpException({
                message: "Couldn't find config object for Subscription",
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const subscriptionId = (0, lodash_1.get)(subscription, ['id']);
        if (!subscriptionId) {
            throw new common_1.HttpException({
                message: 'This Invoice charge has no subscription, No changes made',
            }, common_1.HttpStatus.OK);
        }
        const customerEmail = (0, lodash_1.get)(subscription, ['customer', 'email']);
        const deal = await this.hubspotService.getDealBySubscriptionId(subscriptionId);
        this.logger.log(`deal: ${deal}`);
        if (!deal) {
            throw new common_1.HttpException({
                message: 'There is no Deal for this customer on Hubspot. No changes made',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const body = {
            properties: {
                status: 'Failed',
            },
        };
        const handleSubscriptionToPastdue = { body, deal };
        await this.chargifyWebhookActivity(customerEmail, { event: types_2.Events.DEAL_UPDATE }, handleSubscriptionToPastdue);
        await this.hubspotService.updateDeal(deal.id, body);
    }
    async handleExpireCard(subscription) {
        this.logger.log(`subscription: ${subscription}`);
        const customerObject = (0, lodash_1.get)(subscription, ['customer']);
        const email = (0, lodash_1.get)(customerObject, ['email']);
        await this.chargifyWebhookActivity(email, { event: types_2.Events.EXPIRING_CARD }, subscription);
        this.logger.log(`email : ${email}`);
        const user = await this.hubspotService.getContactDetailsByEmail(email);
        const userId = user.vid.toString();
        this.logger.log(`HSuserId : ${userId}`);
        const activeDeals = await this.hubspotService.findActiveDealsByEmail(email);
        const numberOfActiveDeals = activeDeals === null || activeDeals === void 0 ? void 0 : activeDeals.total;
        const lifeCycle = this.getCustomerLifeCycle(numberOfActiveDeals);
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
        await this.hubspotService.updateContactById(userId, resetLifecycleStage);
        await this.hubspotService.updateContactById(userId, setLifecycleStage);
        const propertyData = {
            properties: {
                status: 'Expired',
            },
        };
        const dealData = (0, lodash_1.get)(activeDeals, ['results']);
        const expiredCard = { dealData, propertyData };
        await this.chargifyWebhookActivity(email, { event: types_2.Events.DEAL_UPDATE }, expiredCard);
        const promises = (0, lodash_1.map)(dealData, (deal) => this.hubspotService.updateDeal(deal.id, propertyData));
        await Promise.all(promises);
        return { Message: 'Deals updated successfully' };
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
                dealstage: constants_1.DEAL_DEAL_CANCELLED_STAGE_ID,
            },
        };
        const canceledSubscription = { objectInput, dealId };
        await this.chargifyWebhookActivity(customerEmail, { event: types_2.Events.DEAL_UPDATE }, canceledSubscription);
        await this.hubspotService.updateDeal(dealId, objectInput);
    }
    async handlePaymentFailure(body) {
        var _a, _b;
        const payload = (0, lodash_1.get)(body, ['payload']);
        const subscriptionObject = (0, lodash_1.get)(payload, ['subscription']);
        const transactionObject = (0, lodash_1.get)(payload, ['transaction']);
        if (!subscriptionObject) {
            throw new common_1.HttpException({
                message: "Couldn't find config object for Subscription",
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const customerObject = (0, lodash_1.get)(payload, ['subscription', 'customer']);
        const invoiceIds = (0, lodash_1.get)(transactionObject, ['invoice_uids']);
        const invoiceId = (0, lodash_1.first)(invoiceIds).toString();
        this.logger.log(`InvoiceId: ${invoiceId}`);
        const invoiceObject = await this.paymentChargify.getInvoiceByInvoiceId(invoiceId);
        if (!invoiceObject) {
            throw new common_1.HttpException({
                message: 'This charge has no invoice. No changes made',
            }, common_1.HttpStatus.OK);
        }
        const invoiceObjectJson = JSON.stringify(invoiceObject);
        this.logger.log({ invoiceObjectJson }, contexts_1.CONTEXT_CHARGIFY);
        const invoiceUrl = (0, lodash_1.get)(invoiceObject, ['public_url']);
        const email = (0, lodash_1.get)(customerObject, ['email']);
        await this.chargifyWebhookActivity(email, { event: types_2.Events.PAYMENT_FAILED }, body);
        this.logger.log(`invoiceUrl: ${invoiceUrl}`);
        const userId = await this.hubspotService.getContactDetailsByEmail(email);
        if (!userId) {
            throw new common_1.HttpException({
                message: 'There is no customer for that email on HubSpot. No changes made',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const subscriptionId = (0, lodash_1.get)(subscriptionObject, ['id']);
        if (!subscriptionId) {
            throw new common_1.HttpException({
                message: 'This Invoice charge has no subscription, No changes made',
            }, common_1.HttpStatus.OK);
        }
        const deal = await this.hubspotService.getDealBySubscriptionId(subscriptionId);
        this.logger.log(`deal: ${deal}`);
        if (!deal) {
            throw new common_1.HttpException({
                message: 'There is no Deal for this customer on Hubspot. No changes made',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const updatedDeal = {
            properties: {
                hold_payment_date: luxon_1.DateTime.now().toFormat('yyyy-LL-dd').toString(),
                failed_payment_reason: 'Payment failed',
                stripe_payment_page: invoiceUrl,
            },
        };
        const paymentFailure = { updatedDeal, deal };
        await this.chargifyWebhookActivity(email, { event: types_2.Events.DEAL_UPDATE }, paymentFailure);
        await this.hubspotService.updateDeal(deal.id, updatedDeal);
        const event = body.event;
        const sessionId = body.sessionId;
        const resourceMetaData = body.resourceMetaData;
        this.logger.log({ resourceMetaData }, contexts_1.CONTEXT_CHARGIFY);
        const offerId = resourceMetaData && resourceMetaData.metadata.length
            ? (_a = resourceMetaData.metadata.find((meta) => (meta === null || meta === void 0 ? void 0 : meta.name) === 'offerId')) === null || _a === void 0 ? void 0 : _a.value
            : null;
        this.logger.log({ offerId }, contexts_1.CONTEXT_CHARGIFY);
        const message = (_b = subscriptionObject.last_payment_error) === null || _b === void 0 ? void 0 : _b.message;
        this.logger.log({ message });
        let session;
        this.logger.log({ event });
        this.logger.log('event: payment_failure updating session');
        if (sessionId && offerId) {
            session = await this.onboardService.registerPaymentFailure(sessionId, offerId, message);
        }
        this.logger.log({ session });
        if (session) {
            await this.onboardService.updateStepAndPopulateSession(session);
        }
    }
    async customerSubscribeorUnSubscribe(subscription) {
        const subscriptionId = (0, lodash_1.get)(subscription, ['id']).toString();
        const customerId = (0, lodash_1.get)(subscription, ['customer', 'id']);
        const subObjects = await this.paymentChargify.getSubscriptionBySubId(subscriptionId);
        const status = (0, lodash_1.get)(subObjects, ['subscription', 'state']);
        const previousState = (0, lodash_1.get)(subObjects, ['subscription', 'previous_state']);
        return this.customersService.createSubscriptionorUnsubscription(customerId, subscriptionId, status, previousState);
    }
    isAllocationIncreasing(previousAllocation, newAllocation) {
        return previousAllocation == 0 && newAllocation;
    }
    getCustomerLifeCycle(dealsCount) {
        return dealsCount ? 'customer' : 'subscriber';
    }
    getDealName(status, name, productName) {
        return status === 'trialing'
            ? `${name} - ${productName} - trialing`
            : `${name} - ${productName}`;
    }
    isCreditsAvailable(creditsOnce, creditsRecur) {
        return creditsOnce || creditsRecur;
    }
    async handleSubscriptionUpdate(payload) {
        var _a, _b;
        const subscription = (0, lodash_1.get)(payload, ['subscription']);
        const component = (0, lodash_1.get)(payload, ['component']);
        const previous_allocation = (0, lodash_1.get)(payload, ['previous_allocation']);
        const new_allocation = (0, lodash_1.get)(payload, ['new_allocation']);
        const subscriptionId = subscription.id;
        const subObjects = await this.paymentChargify.getSubscriptionBySubId(subscriptionId.toString());
        const { customer, state: status, current_period_ends_at, } = subObjects.subscription;
        this.logger.log({
            payload: {
                method: 'handleSubscriptionUpdate',
                usageDate: luxon_1.DateTime.now(),
                subscription,
                component,
                previous_allocation,
                new_allocation,
            },
        }, contexts_1.CONTEXT_SUBSCRIPTION_UPDATE);
        if ((component === null || component === void 0 ? void 0 : component.kind) !== 'quantity_based_component') {
            throw new common_1.HttpException({
                message: 'Kind is not quantity_based_component',
            }, common_1.HttpStatus.OK);
        }
        if (new_allocation == 0) {
            await this.rewiseDeAllocation(component, customer, current_period_ends_at, subscription);
            throw new common_1.HttpException({
                message: 'Component De-allocated successfully',
            }, common_1.HttpStatus.OK);
        }
        const productPriceId = component.id;
        this.logger.log({
            payload: {
                method: 'handleSubscriptionUpdate',
                usageDate: luxon_1.DateTime.now(),
                productPriceId,
            },
        }, contexts_1.CONTEXT_SUBSCRIPTION_UPDATE);
        const query = {
            chargifyComponentId: productPriceId.toString(),
        };
        const productObj = await this.productsService.find(query);
        if (!productObj) {
            throw new common_1.HttpException({
                message: 'Chargify Product not found',
            }, common_1.HttpStatus.OK);
        }
        const customerEmail = (0, lodash_1.get)(subObjects, [
            'subscription',
            'customer',
            'email',
        ]);
        await this.chargifyWebhookActivity(customerEmail, { event: types_2.Events.SUBSCRIPTION_UPDATED }, payload);
        this.logger.log({
            payload: {
                method: 'handleSubscriptionUpdate',
                usageDate: luxon_1.DateTime.now(),
                subObjects,
            },
        }, contexts_1.CONTEXT_SUBSCRIPTION_UPDATE);
        if (!subObjects) {
            throw new common_1.HttpException({
                message: 'Could not get subscription details from chargify using subId',
            }, common_1.HttpStatus.OK);
        }
        this.logger.log({
            payload: {
                method: 'handleSubscriptionUpdate',
                usageDate: luxon_1.DateTime.now(),
                data: { customer, status, current_period_ends_at },
            },
        }, contexts_1.CONTEXT_SUBSCRIPTION_UPDATE);
        if (status === 'canceled') {
            throw new common_1.HttpException({
                message: 'Returned due to canceled status',
            }, common_1.HttpStatus.OK);
        }
        const isComponentQuantityIncreasing = this.isAllocationIncreasing(previous_allocation, new_allocation);
        if (isComponentQuantityIncreasing) {
            const newStatus = status;
            const { email } = customer;
            const user = await this.hubspotService.getContactDetailsByEmail(email);
            const userId = user.vid.toString();
            const name = (0, lodash_1.get)(customer, ['first_name']) + ' ' + (0, lodash_1.get)(customer, ['last_name']);
            this.logger.log({
                payload: {
                    method: 'handleSubscriptionUpdate',
                    usageDate: luxon_1.DateTime.now(),
                    data: { email, userId },
                },
            }, contexts_1.CONTEXT_SUBSCRIPTION_UPDATE);
            if (productObj.type === types_3.Type.ONE_TIME) {
                const existingBookCredit = Number((0, lodash_1.get)(user, ['properties', 'afy_book_credits', 'value'], 0));
                const newBookCredit = existingBookCredit + Number(productObj.creditsOnce);
                const reqBody = {
                    properties: {
                        afy_book_credits: newBookCredit.toString(),
                    },
                };
                const webhookBookCredit = {
                    newBookCredit,
                    existingBookCredit,
                    reqBody,
                };
                await this.chargifyWebhookActivity(email, { event: types_2.Events.BOOK_CREDITS_ADD }, webhookBookCredit);
                await this.hubspotService.updateContactById(userId, reqBody);
            }
            const subObjects = await this.paymentChargify.getSubscriptionBySubId(subscriptionId.toString());
            if (productObj === null || productObj === void 0 ? void 0 : productObj.upgradeDowngrade) {
                const reqBodyData = await this.getPackageCreditsData(user, productObj, subObjects === null || subObjects === void 0 ? void 0 : subObjects.subscription, subscription);
                const updateCreditsData = await Promise.all([
                    this.sendEmail(email),
                    this.hubspotService.updateContactById(userId, reqBodyData),
                ]);
                this.logger.log({
                    payload: {
                        customerEmail,
                        method: 'handleSubscriptionUpdate',
                        usageDate: luxon_1.DateTime.now(),
                        subscriptionId: subscription.id,
                        reqBodyData,
                        updateCreditsData,
                    },
                }, contexts_1.CONTEXT_SUBSCRIPTION_UPDATE);
            }
            const deal = await this.hubspotService.getDealBySubscriptionId(subscription.id);
            this.logger.log({
                payload: {
                    customerEmail,
                    method: 'handleSubscriptionUpdate',
                    usageDate: luxon_1.DateTime.now(),
                    subscriptionId: subscription.id,
                    deal,
                },
            }, contexts_1.CONTEXT_SUBSCRIPTION_UPDATE);
            if (!deal) {
                throw new common_1.HttpException({
                    message: 'There is no Deal for this customer on Hubspot. No changes made',
                }, common_1.HttpStatus.OK);
            }
            const dealId = (0, lodash_1.get)(deal, ['id']);
            this.logger.log({
                payload: {
                    customerEmail,
                    method: 'handleSubscriptionUpdate',
                    usageDate: luxon_1.DateTime.now(),
                    dealId,
                },
            }, contexts_1.CONTEXT_SUBSCRIPTION_UPDATE);
            const activeDeals = await this.hubspotService.findActiveDealsByEmail(email);
            const numberOfActiveDeals = activeDeals === null || activeDeals === void 0 ? void 0 : activeDeals.total;
            const lifeCycle = this.getCustomerLifeCycle(numberOfActiveDeals);
            const resetLifecycleStage = {
                properties: {
                    lifecyclestage: '',
                },
                json: true,
            };
            this.logger.log({
                payload: {
                    customerEmail,
                    method: 'handleSubscriptionUpdate',
                    usageDate: luxon_1.DateTime.now(),
                    resetLifecycleStage,
                },
            }, contexts_1.CONTEXT_SUBSCRIPTION_UPDATE);
            const setLifecycleStage = {
                properties: {
                    lifecyclestage: lifeCycle,
                },
                json: true,
            };
            this.logger.log({
                payload: {
                    customerEmail,
                    method: 'handleSubscriptionUpdate',
                    usageDate: luxon_1.DateTime.now(),
                    setLifecycleStage,
                },
            }, contexts_1.CONTEXT_SUBSCRIPTION_UPDATE);
            await this.hubspotService.updateContactById(userId, resetLifecycleStage);
            await this.hubspotService.updateContactById(userId, setLifecycleStage);
            const next_recurring_date = (0, dateFormatters_1.convertToHSDate)(current_period_ends_at);
            const dealStatus = (0, string_1.capitalizeFirstLetter)(newStatus);
            const body = {
                properties: {
                    dealname: this.getDealName(status, name, productObj.title),
                    amount: productObj.value.toString(10),
                    status: dealStatus,
                    [(_a = productObj.productProperty) !== null && _a !== void 0 ? _a : types_3.HubspotProductProperty.AUTHORIFY_PRODUCT]: productObj.product,
                    [(_b = productObj.priceProperty) !== null && _b !== void 0 ? _b : types_3.HubspotPriceProperty.RECURRING_REVENUE_AMOUNT]: productObj.value.toString(10),
                    next_recurring_date: next_recurring_date,
                },
            };
            const subscriptionUpdated = { body, dealId };
            this.logger.log({
                payload: {
                    customerEmail,
                    method: 'handleSubscriptionUpdate',
                    usageDate: luxon_1.DateTime.now(),
                    dealId,
                    body,
                },
            }, contexts_1.CONTEXT_SUBSCRIPTION_UPDATE);
            await this.chargifyWebhookActivity(customerEmail, { event: types_2.Events.DEAL_UPDATE }, subscriptionUpdated);
            await this.hubspotService.updateDeal(dealId, body);
            const associationsResult = await this.hubspotService.getDealsAssociation(dealId);
            const associations = (0, lodash_1.get)(associationsResult, ['results']);
            await Promise.all(associations.map(async (association) => {
                await this.hubspotService.deleteAssociation(dealId, association.id);
            }));
            const hubspotProduct = await this.hubspotService.createOrUpdateProduct(productPriceId.toString(), productObj);
            this.logger.log({
                payload: {
                    customerEmail,
                    method: 'handleSubscriptionUpdate',
                    usageDate: luxon_1.DateTime.now(),
                    hubspotProduct,
                },
            }, contexts_1.CONTEXT_SUBSCRIPTION_UPDATE);
            const lineItemDto = {
                name: hubspotProduct.properties.name,
                hs_product_id: hubspotProduct.id,
                quantity: '1',
            };
            this.logger.log({
                payload: {
                    customerEmail,
                    method: 'handleSubscriptionUpdate',
                    usageDate: luxon_1.DateTime.now(),
                    lineItemDto,
                },
            }, contexts_1.CONTEXT_SUBSCRIPTION_UPDATE);
            const createdLineItem = await this.hubspotService.createLineItem(lineItemDto);
            this.logger.log({
                payload: {
                    customerEmail,
                    method: 'handleSubscriptionUpdate',
                    usageDate: luxon_1.DateTime.now(),
                    createdLineItem,
                },
            }, contexts_1.CONTEXT_SUBSCRIPTION_UPDATE);
            await this.hubspotService.associateLineItemToDeal(createdLineItem.id, dealId);
            this.logger.log({
                payload: {
                    method: 'handleSubscriptionUpdate',
                    usageDate: luxon_1.DateTime.now(),
                    message: `Deal Updated & Association created & Execution Completed`,
                },
            }, contexts_1.CONTEXT_SUBSCRIPTION_UPDATE);
            this.logger.log({
                payload: {
                    customerEmail,
                    method: 'handleSubscriptionUpdate',
                    usageDate: luxon_1.DateTime.now(),
                    message: 'Successfully handled book credits.',
                },
            }, contexts_1.CONTEXT_SUBSCRIPTION_UPDATE);
        }
    }
    async rewiseDeAllocation(component, customer, current_period_ends_at, subscription) {
        const subObjects = await this.paymentChargify.getSubscriptionBySubId(subscription.id.toString());
        const chargifyComponentId = component.id;
        const query = {
            chargifyComponentId: chargifyComponentId.toString(),
        };
        const productObj = await this.productsService.find(query);
        if (!productObj) {
            throw new common_1.HttpException({
                message: 'For Book Credits reduce - Chargify Product not found',
            }, common_1.HttpStatus.OK);
        }
        const { email } = customer;
        const user = await this.hubspotService.getContactDetailsByEmail(email);
        const userId = user.vid.toString();
        const previousState = (0, lodash_1.get)(subObjects, ['subscription', 'previous_state']);
        if ((productObj === null || productObj === void 0 ? void 0 : productObj.upgradeDowngrade) &&
            (productObj === null || productObj === void 0 ? void 0 : productObj.creditsRecur) &&
            previousState !== types_1.State.TRIALING) {
            const reqBodyData = await this.getCreditsReduceData(user, productObj, current_period_ends_at, subscription);
            await this.hubspotService.updateContactById(userId, reqBodyData);
        }
    }
    async sendEmail(email) {
        const htmlData = await this.cmsService.getUpgradeNowTermsConfig();
        const emailMessage = {
            from: 'noreply@authorify.com',
            to: email,
            subject: 'Authorify Terms and Condition',
            html: htmlData,
            provider: 'aws',
        };
        return this.afyNotificationsService.sendEmail([emailMessage]);
    }
    async getPackageCreditsData(user, productObj, subscription, upateSubscription) {
        var _a, _b;
        const reqBody = {
            properties: {},
        };
        let existingBookCredit = Number((0, lodash_1.get)(user, ['properties', 'afy_book_credits', 'value'], 0));
        if (((_a = subscription === null || subscription === void 0 ? void 0 : subscription.product) === null || _a === void 0 ? void 0 : _a.id.toString()) ===
            ((_b = upateSubscription === null || upateSubscription === void 0 ? void 0 : upateSubscription.product) === null || _b === void 0 ? void 0 : _b.id.toString()) &&
            (subscription === null || subscription === void 0 ? void 0 : subscription.previous_state) !== types_1.State.TRIALING) {
            const reqBodyData = await this.getCreditsReduceData(user, productObj, subscription === null || subscription === void 0 ? void 0 : subscription.current_period_ends_at, upateSubscription);
            const hubspotData = await this.hubspotService.updateContactById(user.vid.toString(), reqBodyData);
            existingBookCredit = Number((0, lodash_1.get)(hubspotData, ['properties', 'afy_book_credits'], 0));
        }
        if (productObj === null || productObj === void 0 ? void 0 : productObj.bookPackages) {
            reqBody.properties['afy_package'] = productObj.bookPackages;
        }
        if (productObj === null || productObj === void 0 ? void 0 : productObj.product) {
            reqBody.properties['authorify_saas_product'] = productObj.product;
        }
        if (productObj === null || productObj === void 0 ? void 0 : productObj.creditsRecur) {
            const newBookCredit = existingBookCredit + Number(productObj.creditsRecur);
            reqBody.properties['afy_book_credits'] = newBookCredit;
        }
        return reqBody;
    }
    async getCreditsReduceData(user, productObj, current_period_ends_at, subscription) {
        const { interval_unit } = subscription.product;
        const currentPlanInterval = ((interval_unit === 'month' ? 'monthly' : 'anually'));
        const reqBody = {
            properties: {},
        };
        if (productObj === null || productObj === void 0 ? void 0 : productObj.creditsRecur) {
            const upcomingDaysCount = (0, dateFormatters_1.getDifferenceInDays)(current_period_ends_at);
            const perDay = currentPlanInterval === 'monthly'
                ? (productObj === null || productObj === void 0 ? void 0 : productObj.creditsRecur) / 30
                : (productObj === null || productObj === void 0 ? void 0 : productObj.creditsRecur) / 365;
            let toBeReduceCredits = Math.ceil(upcomingDaysCount * perDay);
            const existingBookCredit = Number((0, lodash_1.get)(user, ['properties', 'afy_book_credits', 'value'], 0));
            const newBookCredit = Number(existingBookCredit) - Number(toBeReduceCredits);
            reqBody.properties['afy_book_credits'] =
                newBookCredit > 0 ? newBookCredit : 0;
        }
        return reqBody;
    }
    async updateCustomerLifeCycle(email, stage = 'customer') {
        this.logger.log({
            payload: {
                email,
                method: 'updateCustomerLifeCycle',
                usageDate: luxon_1.DateTime.now(),
                stage,
            },
        }, contexts_1.CONTEXT_HUBSPOT);
        const hubspotCustomer = await this.hubspotService.getContactDetailsByEmail(email);
        this.logger.log({
            payload: {
                email,
                method: 'updateCustomerLifeCycle',
                usageDate: luxon_1.DateTime.now(),
                hubspotCustomer,
            },
        }, contexts_1.CONTEXT_HUBSPOT);
        const vid = hubspotCustomer.vid.toString();
        const hubspotPayload = {
            properties: {
                lifecyclestage: stage,
            },
        };
        this.logger.log({
            payload: {
                email,
                method: 'updateCustomerLifeCycle',
                usageDate: luxon_1.DateTime.now(),
                vid,
                hubspotPayload,
            },
        }, contexts_1.CONTEXT_HUBSPOT);
        await this.hubspotService.updateContactById(vid, hubspotPayload);
    }
    async verifyRmmSubscription(body) {
        const { reference, payload } = body;
        const referralMarketingPlans = await this.cmsService.getReferralMarketingPlans();
        const { subscription, } = payload;
        const customerEmail = (0, lodash_1.get)(subscription, ['customer', 'email']);
        this.logger.log({
            payload: {
                email: customerEmail,
                method: 'verifyRmmSubscription',
                usageDate: luxon_1.DateTime.now(),
                subscription,
            },
        }, contexts_1.CONTEXT_WEBHOOK_METRICS);
        const currentSubscriptionProductFamily = ((0, lodash_1.get)(subscription, 'product.product_family', {}));
        const isReferralMarketingPlan = referralMarketingPlans.includes(currentSubscriptionProductFamily.handle);
        const currentCreditCardCurrentVault = ((0, lodash_1.get)(subscription, 'credit_card.current_vault', ''));
        const isStripeSubscription = currentCreditCardCurrentVault === 'stripe_connect';
        this.logger.log({ isReferralMarketingPlan, isStripeSubscription }, contexts_1.CONTEXT_CHARGIFY);
        if (subscription) {
            await this.customerSubscribeorUnSubscribe(subscription);
        }
        if (isStripeSubscription) {
            try {
                this.logger.log({
                    payload: {
                        email: customerEmail,
                        method: 'stripe subscription, initiating deal creation',
                        usageDate: luxon_1.DateTime.now(),
                        isStripeSubscription,
                    },
                }, contexts_1.CONTEXT_WEBHOOK_METRICS);
                await this.handlePaymentSuccess(body);
            }
            catch (exception) {
                this.logger.log({ exception });
                throw new common_1.HttpException({ message: 'There was some issue. please try again.' }, common_1.HttpStatus.OK);
            }
            return null;
        }
        if (!isReferralMarketingPlan)
            return null;
        await this.chargifyWebhookActivity(customerEmail, { event: types_2.Events.VERIFY_RMM_SUBSCRIPTION }, payload);
        try {
            await this.onboardService.createHubspotDeal(reference, subscription, subscription.created_at);
            await this.updateCustomerLifeCycle(customerEmail);
            const randomString = (0, randomstring_1.generate)(8);
            const encryptedPassword = await bcrypt.hash(randomString, 10);
            const hubspotDto = {
                email: customerEmail,
                afy_password: randomString,
                afy_password_encrypted: encryptedPassword,
                afy_package: 'RM Only',
                afy_customer_status: 'Active',
            };
            await this.hubspotService.createOrUpdateContact(hubspotDto);
            return { message: 'Subscription created successfully' };
        }
        catch (exception) {
            this.logger.log({ exception });
            throw new common_1.HttpException({ message: 'There was some issue. please try again.' }, common_1.HttpStatus.OK);
        }
    }
    async invoiceIssued(body) {
        var _a, _b;
        const invoiceId = ((_a = body.payload.invoice) === null || _a === void 0 ? void 0 : _a.uid) || null;
        if ((0, lodash_1.isEmpty)(invoiceId)) {
            this.logger.log({
                payload: {
                    message: 'No Invoice id found in payload body',
                    usageDate: luxon_1.DateTime.now(),
                },
            }, contexts_1.INVOICE_ISSUED);
            return null;
        }
        const invoiceObject = await this.paymentChargify.getInvoiceByInvoiceId(invoiceId);
        if ((0, lodash_1.isEmpty)(invoiceObject)) {
            this.logger.log({
                payload: {
                    message: 'No Invoice object found in chargify using uid',
                    usageDate: luxon_1.DateTime.now(),
                },
            }, contexts_1.INVOICE_ISSUED);
            return null;
        }
        const customerEmail = ((_b = invoiceObject === null || invoiceObject === void 0 ? void 0 : invoiceObject.customer) === null || _b === void 0 ? void 0 : _b.email) || null;
        if ((0, lodash_1.isEmpty)(customerEmail)) {
            this.logger.log({
                payload: {
                    message: 'There is no customer email address found',
                    usageDate: luxon_1.DateTime.now(),
                },
            }, contexts_1.INVOICE_ISSUED);
            return null;
        }
        const reqObject = {
            recipient_emails: [customerEmail],
        };
        const response = await this.paymentChargify.sendInvoice(invoiceId, reqObject);
        return response;
    }
    async renewalSuccess(body) {
        try {
            const { payload } = body;
            const { subscription } = payload;
            const allocatedComponents = await this.paymentChargify.getAllAllocatedComponentsFromSubscription(subscription);
            const componentDetails = (0, lodash_1.first)(allocatedComponents);
            const chargifyProductId = (0, lodash_1.get)(componentDetails, ['component_id']);
            this.logger.log({
                payload: {
                    email: subscription.customer.email,
                    method: 'renewalSuccess',
                    usageDate: luxon_1.DateTime.now(),
                    allocatedComponents,
                    componentDetails,
                },
            }, contexts_1.RENEWAL_SUCCESS);
            let productDetails = await this.productsService.findProductByChargifyId(chargifyProductId.toString());
            const metaData = await this.paymentChargify.getMetadataForResource('subscriptions', subscription.id);
            const { metadata } = metaData;
            if (metadata.length > 0) {
                const offerMetadata = metadata.find((meta) => meta.name === 'offerId');
                if (offerMetadata) {
                    let offer = await this.onboardService.findOfferById(new mongoose_1.Types.ObjectId(offerMetadata.value));
                    if (offer) {
                        offer = await offer.populate(['products']);
                        const offerProducts = offer.products;
                        const offerProduct = offerProducts === null || offerProducts === void 0 ? void 0 : offerProducts.find((product) => product.chargifyComponentId ===
                            componentDetails.component_id.toString());
                        if (offerProduct) {
                            productDetails = offerProduct;
                        }
                    }
                }
            }
            this.logger.log({
                payload: {
                    email: subscription.customer.email,
                    method: 'renewalSuccess',
                    usageDate: luxon_1.DateTime.now(),
                    productDetails,
                    message: 'Start updating book credit',
                },
            }, contexts_1.RENEWAL_SUCCESS);
            const intervalUnit = (0, lodash_1.get)(subscription, ['product', 'interval_unit']);
            if (intervalUnit === 'month' &&
                (productDetails === null || productDetails === void 0 ? void 0 : productDetails.creditsOnce) > 0 &&
                (productDetails === null || productDetails === void 0 ? void 0 : productDetails.creditsRecur) == 0) {
                const queryParams = {
                    kinds: 'payment',
                };
                this.logger.log({
                    payload: {
                        email: subscription.customer.email,
                        method: 'getAllTransactionBySubscriptionId',
                        usageDate: luxon_1.DateTime.now(),
                        subscription,
                        productDetails,
                        message: 'Start updating annual credit once',
                    },
                }, contexts_1.RENEWAL_SUCCESS);
                await this.getAllTransactionBySubscriptionId(subscription, queryParams, productDetails === null || productDetails === void 0 ? void 0 : productDetails.creditsOnce, 50, 1);
            }
            await this.onboardService.handleBookCredit(productDetails, subscription);
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    payload: {
                        usageDate: luxon_1.DateTime.now(),
                        context: `${contexts_1.RENEWAL_SUCCESS}`,
                        stack: error === null || error === void 0 ? void 0 : error.stack,
                        error: error === null || error === void 0 ? void 0 : error.message,
                        message: 'Something went wrong during renewal success webhook',
                    },
                });
                throw new common_1.HttpException({
                    message: 'Something went wrong during renewal success webhook',
                    error: error === null || error === void 0 ? void 0 : error.message,
                    name: error === null || error === void 0 ? void 0 : error.name,
                    stack: error === null || error === void 0 ? void 0 : error.stack,
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async getAllTransactionBySubscriptionId(subscription, queryParams, newCredits, perPage = 50, page = 1) {
        var _a, _b, _c, _d;
        if (!subscription) {
            throw new common_1.HttpException({
                message: 'Subscription is required',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const subscriptionId = (0, lodash_1.get)(subscription, ['id']);
        const url = `subscriptions/${subscriptionId}/transactions.json/?per_page=${perPage}&page=${page}`;
        const email = (0, lodash_1.get)(subscription, ['customer', 'email']);
        const response = await this.paymentChargify.find(url, queryParams);
        let count = 0;
        for (const data of response) {
            const transaction = (_a = data === null || data === void 0 ? void 0 : data.transaction) === null || _a === void 0 ? void 0 : _a.memo.includes(`${(_b = subscription === null || subscription === void 0 ? void 0 : subscription.customer) === null || _b === void 0 ? void 0 : _b.first_name} ${(_c = subscription === null || subscription === void 0 ? void 0 : subscription.customer) === null || _c === void 0 ? void 0 : _c.last_name} - ${(_d = subscription === null || subscription === void 0 ? void 0 : subscription.product) === null || _d === void 0 ? void 0 : _d.name}: Renewal payment`);
            if (transaction) {
                count++;
            }
        }
        const isRenewed = count % 12 == 0;
        this.logger.log({
            payload: {
                email,
                method: 'getAllTransactionBySubscriptionId',
                usageDate: luxon_1.DateTime.now(),
                count,
                isRenewed,
            },
        }, contexts_1.RENEWAL_SUCCESS);
        if (isRenewed) {
            count = 12;
        }
        if (count == 12) {
            const user = await this.hubspotService.getContactDetailsByEmail(email);
            const userId = user.vid.toString();
            const existingBookCredit = Number((0, lodash_1.get)(user, ['properties', 'afy_book_credits', 'value'], 0));
            const newBookCredit = existingBookCredit + newCredits;
            const reqBody = {
                properties: {
                    afy_book_credits: newBookCredit.toString(),
                },
            };
            const hubspotData = await this.hubspotService.updateContactById(userId, reqBody);
            this.logger.log({
                payload: {
                    method: 'getAllTransactionBySubscriptionId',
                    usageDate: luxon_1.DateTime.now(),
                    hubspotData,
                    email,
                },
            }, contexts_1.RENEWAL_SUCCESS);
        }
    }
    async handlePaymentSuccess(body) {
        var _a;
        const { id: reference, payload } = body;
        const sessionId = body.sessionId;
        const resourceMetaData = body.resourceMetaData;
        const { subscription, transaction, event_id: eventId } = payload;
        this.logger.log({ subscription }, contexts_1.CONTEXT_CHARGIFY);
        this.logger.log({ resourceMetaData }, contexts_1.CONTEXT_CHARGIFY);
        const offerId = resourceMetaData && resourceMetaData.metadata.length
            ? (_a = resourceMetaData.metadata.find((meta) => (meta === null || meta === void 0 ? void 0 : meta.name) === 'offerId')) === null || _a === void 0 ? void 0 : _a.value
            : null;
        this.logger.log({ offerId });
        const subscriptionCustomer = subscription.customer;
        const customerEmail = (0, lodash_1.get)(subscriptionCustomer, ['email']);
        this.logger.log({ customerEmail }, contexts_1.CONTEXT_CHARGIFY);
        this.logger.log({
            payload: {
                email: customerEmail,
                method: 'handlePaymentSuccess',
                action: 'fetch customer',
                usageDate: luxon_1.DateTime.now(),
            },
        }, contexts_1.CONTEXT_WEBHOOK_METRICS);
        const user = await this.customersService.findByEmail(customerEmail);
        this.logger.log({
            payload: {
                email: customerEmail,
                method: 'handlePaymentSuccess',
                action: 'customer data',
                usageDate: luxon_1.DateTime.now(),
                user,
            },
        }, contexts_1.CONTEXT_WEBHOOK_METRICS);
        if (!(user === null || user === void 0 ? void 0 : user._id)) {
            this.logger.log({
                payload: {
                    email: customerEmail,
                    method: 'handlePaymentSuccess',
                    action: 'customer not found, creating instead.',
                    usageDate: luxon_1.DateTime.now(),
                },
            }, contexts_1.CONTEXT_WEBHOOK_METRICS);
            const randomString = (0, randomstring_1.generate)(8);
            const createUserDto = {
                firstName: subscriptionCustomer.first_name,
                lastName: subscriptionCustomer.last_name,
                email: customerEmail,
                chargifyId: (0, lodash_1.get)(subscription, ['customer', 'id']),
                status: 'active',
                billing: {
                    address1: subscriptionCustomer.address,
                    city: subscriptionCustomer.city,
                    state: subscriptionCustomer.state,
                    country: subscriptionCustomer.country,
                    zip: subscriptionCustomer.zip,
                },
                phone: subscriptionCustomer.phone,
                password: randomString,
                attributes: null,
                smsPreferences: {
                    schedulingCoachReminders: false,
                },
            };
            this.logger.log({
                payload: {
                    email: customerEmail,
                    method: 'handlePaymentSuccess',
                    action: 'create customer payload',
                    usageDate: luxon_1.DateTime.now(),
                    createUserDto,
                },
            }, contexts_1.CONTEXT_WEBHOOK_METRICS);
            await this.customersService.create(createUserDto);
        }
        else {
            if (user.status !== types_4.Status.ACTIVE) {
                this.logger.log({
                    payload: {
                        email: customerEmail,
                        method: 'handlePaymentSuccess',
                        action: 'customer is inactive or pending, changing to active.',
                        usageDate: luxon_1.DateTime.now(),
                    },
                }, contexts_1.CONTEXT_WEBHOOK_METRICS);
                await this.customersService.update(user, { status: types_4.Status.ACTIVE });
            }
        }
        const referralMarketingPlans = await this.cmsService.getReferralMarketingPlans();
        const currentSubscriptionProductFamily = ((0, lodash_1.get)(subscription, 'product.product_family', {}));
        const dateFormat = 'yyyy-MM-dd';
        const isReferralMarketingPlan = referralMarketingPlans.includes(currentSubscriptionProductFamily.handle);
        const transactionCretaedAt = luxon_1.DateTime.fromISO(transaction === null || transaction === void 0 ? void 0 : transaction.created_at).toFormat(dateFormat);
        const subscriptionCreatedAt = luxon_1.DateTime.fromISO(subscription === null || subscription === void 0 ? void 0 : subscription.created_at).toFormat(dateFormat);
        if (isReferralMarketingPlan &&
            transactionCretaedAt === subscriptionCreatedAt) {
            return { message: 'Not create a deal for referral marketing plan' };
        }
        await this.chargifyWebhookActivity(customerEmail, { event: types_2.Events.PAYMENT_SUCCESS }, body);
        let session;
        this.logger.log({
            payload: {
                email: customerEmail,
                method: 'stripe subscription, initiating deal creation',
                usageDate: luxon_1.DateTime.now(),
                session,
                subscriptionCustomer,
            },
        }, contexts_1.CONTEXT_WEBHOOK_METRICS);
        try {
            if (sessionId) {
                const { properties } = await this.onboardService.createHubspotDeal(eventId, subscription, transaction.created_at, transaction === null || transaction === void 0 ? void 0 : transaction.component_id, sessionId);
                await this.chargifyWebhookActivity(customerEmail, { event: types_2.Events.DEAL_CREATE }, properties);
                await this.onboardService.updateCustomerSocialMediaTraining(properties);
                await this.updateCustomerLifeCycle(customerEmail);
                this.logger.log({
                    payload: {
                        email: customerEmail,
                        method: 'handlePaymentSuccess',
                        section: 'dealCreation',
                        usageDate: luxon_1.DateTime.now(),
                        properties,
                    },
                }, contexts_1.CONTEXT_WEBHOOK_METRICS);
            }
        }
        catch (exception) {
            this.logger.error({
                exception: exception.toString(),
                payload: {
                    method: 'handlePaymentSuccess',
                    section: 'dealCreation',
                    usageDate: luxon_1.DateTime.now(),
                },
            }, '', contexts_1.CONTEXT_ERROR);
        }
        try {
            if (sessionId && offerId) {
                const paymentDetails = await this.onboardService.getPaymentDetails({
                    sessionId,
                    offerId,
                });
                if (!paymentDetails) {
                    session = await this.onboardService.registerPaymentSuccess(sessionId, offerId, reference.toString(10), customerEmail);
                }
            }
            this.logger.log({
                payload: {
                    email: customerEmail,
                    method: 'stripe subscription, initiating deal creation',
                    usageDate: luxon_1.DateTime.now(),
                    session,
                },
            }, contexts_1.CONTEXT_WEBHOOK_METRICS);
            if (session) {
                await this.onboardService.updateStepAndPopulateSession(session);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    payload: {
                        usageDate: luxon_1.DateTime.now(),
                        context: `${contexts_1.CONTEXT_ERROR}`,
                        stack: error === null || error === void 0 ? void 0 : error.stack,
                        error: error === null || error === void 0 ? void 0 : error.message,
                        message: 'Something went wrong during payment success webhook',
                    },
                }, error === null || error === void 0 ? void 0 : error.stack, contexts_1.CONTEXT_ERROR);
            }
        }
    }
    async formatUserProperties(contactData) {
        const properties = [];
        const randomString = Math.random().toString(36).slice(-8);
        const encryptedPassword = await bcrypt.hash(randomString, 10);
        if (!(0, lodash_1.isUndefined)(contactData.password)) {
            properties.push({
                property: 'afy_password',
                value: randomString,
            }, {
                property: 'afy_password_encrypted',
                value: encryptedPassword,
            });
        }
        if (!(0, lodash_1.isUndefined)(contactData.text_message_opt_in)) {
            properties.push({
                property: 'text_message_opt_in',
                value: (0, lodash_1.get)(contactData, ['text_message_opt_in']),
            });
        }
        if (!(0, lodash_1.isUndefined)(contactData.email)) {
            properties.push({
                property: 'email',
                value: (0, lodash_1.get)(contactData, ['email']),
            });
        }
        if (!(0, lodash_1.isUndefined)(contactData.firstname)) {
            properties.push({
                property: 'firstname',
                value: (0, lodash_1.get)(contactData, ['firstname']),
            });
        }
        if (!(0, lodash_1.isUndefined)(contactData.lastname)) {
            properties.push({
                property: 'lastname',
                value: (0, lodash_1.get)(contactData, ['lastname']),
            });
        }
        if (!(0, lodash_1.isUndefined)(contactData.afy_package)) {
            properties.push({
                property: 'afy_package',
                value: (0, lodash_1.get)(contactData, ['afy_package']),
            });
        }
        return properties;
    }
    async clickfunnel(body) {
        this.logger.error({ body }, '', contexts_1.CONTEXT_CLICKFUNNEL_LOG);
        const contactData = body.purchase.contact;
        const { text_message_opt_in: text_message_opt_in, text: password, email, first_name: firstname, last_name: lastname, book_packages: afy_package, book_credits: bookCredits, } = contactData;
        this.logger.error({ contactData }, '', contexts_1.CONTEXT_CLICKFUNNEL_LOG);
        const contactProperties = {
            email,
            firstname,
            lastname,
            text_message_opt_in,
            password,
            afy_package,
        };
        await this.formatUserProperties(contactProperties);
        await this.hubspotService.createOrUpdateContact(contactProperties);
        const user = await this.hubspotService.getContactDetailsByEmail(email);
        const userId = user.vid.toString();
        const bookCreditPackage = {
            id: userId,
            credits: bookCredits,
            packages: afy_package,
        };
        this.logger.error({ bookCreditPackage }, '', contexts_1.CONTEXT_CLICKFUNNEL_LOG);
        await this.hubspotService.updateCreditsAndPackages(bookCreditPackage);
    }
    async stripeSubscriptionSuccess(body) {
        var _a;
        const info = (0, lodash_1.get)(body, 'data.object');
        const customerEmail = (0, lodash_1.get)(info, 'customer_email');
        const stripeSubscriptionId = (0, lodash_1.get)(info, 'subscription');
        this.logger.log({
            payload: {
                email: customerEmail,
                method: 'stripeSubscriptionSuccess',
                usageDate: luxon_1.DateTime.now(),
                stripeSubscriptionId,
            },
        }, contexts_1.CONTEXT_WEBHOOK_METRICS);
        const customerName = (0, lodash_1.get)(info, 'customer_name');
        const [firstName = '', lastName = ''] = (_a = (customerName || (0, lodash_1.get)(info, 'customer_shipping.name', ''))) === null || _a === void 0 ? void 0 : _a.split(' ');
        const lineItems = (0, lodash_1.get)(info, 'lines.data', []);
        const subscriptionInfo = lineItems.find((lineItems) => lineItems.type == 'subscription');
        const plan = (0, lodash_1.get)(subscriptionInfo, 'plan');
        if (!plan) {
            const stripePlanMessage = 'Stripe Plan not found';
            const planNotFoundPayload = {
                event: body.id,
                email: customerEmail,
                data: { stripeSubscriptionId },
                message: stripePlanMessage,
                usageDate: luxon_1.DateTime.now(),
            };
            this.logger.log({
                payload: {
                    email: customerEmail,
                    method: 'stripeSubscriptionSuccess',
                    usageDate: luxon_1.DateTime.now(),
                    planNotFoundPayload,
                },
            }, contexts_1.CONTEXT_WEBHOOK_METRICS);
            throw new common_1.HttpException({ message: stripePlanMessage }, 200);
        }
        const customerAddressInfo = (0, lodash_1.get)(info, 'customer_address', {});
        const { line1: address1, line2: address2, postal_code: zip, country, state, city, } = customerAddressInfo || {};
        const customerAddress = {
            city,
            country,
            state,
            address1,
            address2,
            address: `${address1} ${address2}`,
            zip,
        };
        const contactInfo = {
            email: customerEmail,
            phone: (0, lodash_1.get)(info, 'number'),
        };
        this.logger.log({
            payload: {
                email: customerEmail,
                method: 'fetching Product info',
                usageDate: luxon_1.DateTime.now(),
                stripeId: plan.id,
                plan,
            },
        }, contexts_1.CONTEXT_WEBHOOK_METRICS);
        const productInfo = await this.productsService.getProductByStripeId(plan.id);
        const productHandle = (0, lodash_1.get)(productInfo, 'chargifyProductHandle');
        const componentId = parseInt((0, lodash_1.get)(productInfo, 'chargifyComponentId'));
        const productPriceHandle = (0, lodash_1.get)(productInfo, 'chargifyProductPriceHandle');
        this.logger.log({
            payload: {
                email: customerEmail,
                method: 'fetching Product info',
                usageDate: luxon_1.DateTime.now(),
                productHandle,
                componentId,
                productInfo,
                productPriceHandle,
            },
        }, contexts_1.CONTEXT_WEBHOOK_METRICS);
        if (!productHandle || !componentId) {
            const exceptionMessage = 'productHandle or componentId not found';
            const exceptionPayload = {
                eventId: body.id,
                email: customerEmail,
                productHandle,
                componentId,
                productInfo,
                productPriceHandle,
                message: exceptionMessage,
                usageDate: luxon_1.DateTime.now(),
            };
            this.logger.log({
                payload: {
                    email: customerEmail,
                    method: 'stripeSubscriptionSuccess',
                    usageDate: luxon_1.DateTime.now(),
                    exceptionPayload,
                },
            }, contexts_1.CONTEXT_WEBHOOK_METRICS);
            throw new common_1.HttpException({ message: exceptionMessage }, 200);
        }
        const { address1: addressOne, address2: addressTwo } = customerAddress, rest = __rest(customerAddress, ["address1", "address2"]);
        const customer = (0, lodash_1.get)(info, 'customer');
        const nextBillingAt = (0, lodash_1.get)(info, 'due_date') || 0;
        const chargifySubscriptionPayload = {
            subscription: {
                product_handle: productHandle,
                next_billing_at: nextBillingAt && (0, dateFormatters_1.epochToHSDate)(nextBillingAt),
                components: [
                    {
                        component_id: componentId,
                        allocated_quantity: 1,
                    },
                ],
                customer_attributes: Object.assign(Object.assign({ first_name: firstName, last_name: lastName }, contactInfo), rest),
                credit_card_attributes: {
                    first_name: firstName,
                    last_name: lastName,
                    vault_token: customer,
                    current_vault: 'stripe_connect',
                    gateway_handle: 'stripe-handle',
                },
            },
        };
        this.logger.log({
            payload: {
                email: customerEmail,
                method: 'stripeSubscriptionSuccess',
                usageDate: luxon_1.DateTime.now(),
                chargifySubscriptionPayload,
            },
        }, contexts_1.CONTEXT_WEBHOOK_METRICS);
        const subscription = await this.paymentChargify.createSubscription(chargifySubscriptionPayload);
        this.logger.log({
            payload: {
                email: customerEmail,
                method: 'stripeSubscriptionSuccess',
                message: 'chargify subscription',
                usageDate: luxon_1.DateTime.now(),
                subscription,
            },
        }, contexts_1.CONTEXT_WEBHOOK_METRICS);
        this.logger.log({
            payload: {
                email: customerEmail,
                method: 'stripeSubscriptionSuccess',
                message: 'Canceling stripe subscription',
                usageDate: luxon_1.DateTime.now(),
                stripeSubscriptionId,
            },
        }, contexts_1.CONTEXT_WEBHOOK_METRICS);
        await this.stripeService.cancelSubscription(stripeSubscriptionId);
    }
    async chargifyWebhookActivity(customerEmail, dto, body) {
        const { event } = dto;
        const customer = await this.customersService.findByEmail(customerEmail);
        if (customer) {
            const data = {
                customer: customer,
                event: event,
                metadata: { body },
            };
            await this.customerEventsService.createEvent(customer, data);
        }
    }
    async handleBillingDateChange(req) {
        const { payload } = req;
        const { subscription } = payload;
        const subscriptionId = subscription === null || subscription === void 0 ? void 0 : subscription.id;
        if (!subscriptionId) {
            throw new common_1.HttpException({
                message: 'There is no subscriptionId found. No changes made',
            }, common_1.HttpStatus.NOT_MODIFIED);
        }
        const subObjects = await this.paymentChargify.getSubscriptionBySubId(subscriptionId.toString());
        const customerEmail = (0, lodash_1.get)(subObjects, [
            'subscription',
            'customer',
            'email',
        ]);
        const deal = await this.hubspotService.getDealBySubscriptionId(subscriptionId);
        this.logger.log({
            payload: {
                customerEmail,
                method: 'handleBillingDateChange',
                usageDate: luxon_1.DateTime.now(),
                subscriptionId,
                deal,
            },
        }, contexts_1.CONTEXT_WEBHOOK_METRICS);
        if (!deal) {
            throw new common_1.HttpException({
                message: 'There is no Deal for this customer on Hubspot. No changes made',
            }, common_1.HttpStatus.NOT_MODIFIED);
        }
        const dealId = (0, lodash_1.get)(deal, ['id']);
        this.logger.log({
            payload: {
                customerEmail,
                method: 'handleBillingDateChange',
                usageDate: luxon_1.DateTime.now(),
                dealId,
            },
        }, contexts_1.CONTEXT_WEBHOOK_METRICS);
        const { current_period_ends_at } = subObjects.subscription;
        const next_recurring_date = (0, dateFormatters_1.convertToHSDate)(current_period_ends_at);
        const body = {
            properties: {
                next_recurring_date,
            },
        };
        const subscriptionUpdated = { body, dealId };
        this.logger.log({
            payload: {
                customerEmail,
                method: 'handleBillingDateChange',
                usageDate: luxon_1.DateTime.now(),
                dealId,
                body,
            },
        }, contexts_1.CONTEXT_WEBHOOK_METRICS);
        await this.chargifyWebhookActivity(customerEmail, { event: types_2.Events.DEAL_UPDATE }, subscriptionUpdated);
        await this.hubspotService.updateDeal(dealId, body);
        this.logger.log({
            payload: {
                customerEmail,
                method: 'handleBillingDateChange',
                usageDate: luxon_1.DateTime.now(),
                message: 'deal updated with new billing date',
            },
        }, contexts_1.CONTEXT_WEBHOOK_METRICS);
    }
};
WebhookService = __decorate([
    (0, common_1.Injectable)(),
    __param(11, (0, bull_1.InjectQueue)(constants_1.HUBSPOT_SYNC_ACTIONS_QUEUE)),
    __metadata("design:paramtypes", [hubspot_service_1.HubspotService,
        customers_service_1.CustomersService,
        payments_service_1.PaymentChargifyService,
        products_service_1.ProductsService,
        common_1.Logger,
        cms_service_1.CmsService,
        onboard_service_1.OnboardService,
        customer_events_service_1.CustomerEventsService,
        payments_service_2.PaymentsService,
        hubspot_sync_actions_services_1.HubspotSyncActionsServices,
        afy_notifications_service_1.AfyNotificationsService, Object, afy_logger_service_1.default])
], WebhookService);
exports.WebhookService = WebhookService;
//# sourceMappingURL=webhook.service.js.map