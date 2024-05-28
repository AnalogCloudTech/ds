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
exports.AfyPaymentsServices = void 0;
const common_1 = require("@nestjs/common");
const customers_service_1 = require("../../customers/customers/customers.service");
const types_1 = require("../../customers/customers/domain/types");
const products_service_1 = require("../../onboard/products/products.service");
const mongoose_1 = require("mongoose");
const hubspot_service_1 = require("../../legacy/dis/legacy/hubspot/hubspot.service");
const hubspot_sync_actions_services_1 = require("../../legacy/dis/legacy/hubspot/hubspot-sync-actions.services");
const bull_1 = require("@nestjs/bull");
const constants_1 = require("../../legacy/dis/legacy/hubspot/constants");
const session_service_1 = require("../../onboard/services/session.service");
const onboard_service_1 = require("../../onboard/onboard.service");
const types_2 = require("../../onboard/domain/types");
const payments_service_1 = require("../../payments/payment_chargify/payments.service");
const customer_events_service_1 = require("../../customers/customer-events/customer-events.service");
const types_3 = require("../../customers/customer-events/domain/types");
const lodash_1 = require("lodash");
const luxon_1 = require("luxon");
const customer_properties_service_1 = require("../../customers/customer-properties/customer-properties.service");
const contexts_1 = require("../../internal/common/contexts");
let AfyPaymentsServices = class AfyPaymentsServices {
    constructor(logger, customersService, customerEventsServices, customerPropertiesServices, productServices, hubspotServices, hubspotSyncActionsServices, sessionServices, onboardServices, paymentChargifyServices, queue) {
        this.logger = logger;
        this.customersService = customersService;
        this.customerEventsServices = customerEventsServices;
        this.customerPropertiesServices = customerPropertiesServices;
        this.productServices = productServices;
        this.hubspotServices = hubspotServices;
        this.hubspotSyncActionsServices = hubspotSyncActionsServices;
        this.sessionServices = sessionServices;
        this.onboardServices = onboardServices;
        this.paymentChargifyServices = paymentChargifyServices;
        this.queue = queue;
    }
    parseCustomerDataFromSubscriptionPayload(customer) {
        return {
            firstName: customer.first_name,
            lastName: customer.last_name,
            email: customer.email,
            status: types_1.Status.INACTIVE,
            billing: {
                address1: customer.address,
                city: customer.city,
                state: customer.state,
                country: customer.country,
                zip: customer.zip,
            },
            phone: customer.phone,
            attributes: null,
            smsPreferences: {
                schedulingCoachReminders: false,
            },
        };
    }
    async enqueueHubspotSyncActionJob(syncAction, jobOptions = { delay: 1000 * 5 }) {
        await this.queue.add(syncAction, jobOptions);
    }
    async enqueueAddCreditsJob(email, credits) {
        const addBookCredits = await this.hubspotSyncActionsServices.addBookCreditsToCustomer(email, credits);
        await this.enqueueHubspotSyncActionJob(addBookCredits);
    }
    async enqueueEnrollContactToListJob(email, listId) {
        const enrollContactToList = await this.hubspotSyncActionsServices.enrollContactToList(email, listId);
        await this.enqueueHubspotSyncActionJob(enrollContactToList);
    }
    async enqueueUpdateBookPackageJob(email, bookPackage) {
        const updateBookPackage = await this.hubspotSyncActionsServices.setBookPackages(email, bookPackage);
        await this.enqueueHubspotSyncActionJob(updateBookPackage);
    }
    async findProduct(id) {
        const productQuery = {
            $or: [{ chargifyId: id }, { chargifyComponentId: id }],
        };
        return await this.productServices.find(productQuery);
    }
    async handleOneTimePaymentSuccessEvent(data) {
        const { customer: subscriptionCustomer, product: subscriptionProduct } = data.payload.subscription;
        const existentCustomer = await this.customersService.findOne({
            email: subscriptionCustomer.email,
        });
        await this.customersService.syncCustomer(this.parseCustomerDataFromSubscriptionPayload(subscriptionCustomer), existentCustomer ? existentCustomer.status : types_1.Status.INACTIVE, existentCustomer);
        const productQuery = {
            chargifyComponentId: subscriptionProduct.id,
        };
        const product = await this.productServices.find(productQuery);
        if (!product) {
            return;
        }
        const { email } = subscriptionCustomer;
        const promises = [];
        if (product.creditsOnce) {
            promises.push(this.enqueueAddCreditsJob(email, product.creditsOnce));
        }
        if (product.hubspotListId) {
            promises.push(this.enqueueEnrollContactToListJob(email, product.hubspotListId));
        }
        await Promise.all(promises);
    }
    async activateCustomer(customer) {
        await this.customersService.update(customer, {
            status: types_1.Status.ACTIVE,
        });
    }
    async handleUpsellOfferPaymentSuccessEvent(data, offerMetadata) {
        const session = await this.handleNewSubscriptionWithoutSession(data, offerMetadata, types_2.Step.SCHEDULE_COACHING);
        const customer = session.customer;
        await this.activateCustomer(customer);
        return session;
    }
    async handleDirectSalePaymentSuccessEvent(data, offerMetadata) {
        const session = await this.handleNewSubscriptionWithoutSession(data, offerMetadata, types_2.Step.DONE);
        const customer = session.customer;
        await this.activateCustomer(customer);
        return session;
    }
    async handleNewSubscriptionWithoutSession(data, offerMetadata, sessionDefaultStep) {
        var _a;
        const { subscription } = data.payload;
        const { customer: subscriptionCustomer } = subscription;
        const allocatedComponents = await this.paymentChargifyServices.getAllAllocatedComponentsFromSubscription(subscription);
        const productComponent = (0, lodash_1.first)(allocatedComponents);
        let existentCustomer = await this.customersService.findByEmail(subscriptionCustomer.email);
        existentCustomer = await this.customersService.syncCustomer(this.parseCustomerDataFromSubscriptionPayload(subscriptionCustomer), types_1.Status.ACTIVE, existentCustomer);
        let offer = await this.onboardServices.findOfferById(new mongoose_1.Types.ObjectId(offerMetadata.value));
        if (!offer) {
            return;
        }
        offer = await offer.populate(['products']);
        const offerProducts = offer.products;
        const session = await this.sessionServices.startSessionForUpSell(offer, sessionDefaultStep, existentCustomer);
        await this.paymentChargifyServices.setMetadataForResource('subscriptions', subscription.id, [
            {
                name: 'sessionId',
                value: session._id,
            },
        ]);
        const { email } = subscriptionCustomer;
        if ((_a = offer.packages) === null || _a === void 0 ? void 0 : _a.length) {
            await this.enqueueUpdateBookPackageJob(email, offer.packages);
        }
        if (offer === null || offer === void 0 ? void 0 : offer.hubspotListId) {
            await this.enqueueEnrollContactToListJob(email, offer.hubspotListId);
        }
        const product = offerProducts.find((product) => Number(product.chargifyComponentId) === productComponent.component_id);
        if (!product) {
            this.logger.error({
                payload: {
                    context: contexts_1.CONTEXT_CHARGIFY_DEAL,
                    usageDate: luxon_1.DateTime.now(),
                    message: `Product not found for subscription ${subscription.id} and component ${productComponent.id}`,
                    subscription,
                },
            }, '', contexts_1.CONTEXT_CHARGIFY_DEAL);
        }
        if (product) {
            if (product.creditsOnce) {
                await this.enqueueAddCreditsJob(email, product.creditsOnce);
            }
            if (product.hubspotListId) {
                await this.enqueueEnrollContactToListJob(email, product.hubspotListId);
            }
        }
        let createdDeal = null;
        try {
            const findExistingDeal = await this.hubspotServices.getDealBySubscriptionId(subscription.id);
            if (!findExistingDeal)
                createdDeal = await this.hubspotServices.createSubscriptionDeal(subscription, subscriptionCustomer, product, luxon_1.DateTime.now().toFormat('yyyy-LL-dd'), offer.title);
            await this.customerEventsServices.createEvent(existentCustomer, {
                event: types_3.Events.DEAL_CREATE,
                metadata: { createdDeal },
            });
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    payload: {
                        usageDate: luxon_1.DateTime.now(),
                        context: contexts_1.CONTEXT_CHARGIFY_DEAL,
                        stack: error === null || error === void 0 ? void 0 : error.stack,
                        error: error === null || error === void 0 ? void 0 : error.message,
                        message: `Error creating deal for subscription ${subscription.id} and component ${productComponent.id}`,
                    },
                });
            }
        }
        if (createdDeal) {
            try {
                await this.hubspotServices.associateDealToContact(existentCustomer.hubspotId, createdDeal.id);
            }
            catch (error) {
                this.logger.error(`Error associating deal to contact ${existentCustomer.hubspotId}`, error);
                const createPropertyPayload = {
                    customer: existentCustomer === null || existentCustomer === void 0 ? void 0 : existentCustomer._id,
                    customerEmail: existentCustomer.email,
                    module: 'onboard',
                    value: 'association',
                    name: 'Missing Association',
                    metadata: { dealId: createdDeal.id },
                };
                await this.customerPropertiesServices.create(createPropertyPayload, existentCustomer);
            }
            let hubspotProduct = await this.hubspotServices.findProductByChargifyId(product.chargifyComponentId);
            if (!hubspotProduct) {
                try {
                    hubspotProduct = await this.hubspotServices.createProduct({
                        title: product.title,
                        value: product.value,
                        chargifyId: product.chargifyComponentId,
                    });
                }
                catch (error) {
                    if (error instanceof Error) {
                        this.logger.error({
                            payload: {
                                usageDate: luxon_1.DateTime.now(),
                                context: contexts_1.CONTEXT_CHARGIFY_DEAL,
                                stack: error === null || error === void 0 ? void 0 : error.stack,
                                error: error === null || error === void 0 ? void 0 : error.message,
                                message: `Error creating product ${product.title} - ${product._id.toString()}`,
                            },
                        }, error === null || error === void 0 ? void 0 : error.stack, contexts_1.CONTEXT_CHARGIFY_DEAL);
                    }
                }
            }
            if (hubspotProduct) {
                const lineItemDto = {
                    name: hubspotProduct.properties.name,
                    hs_product_id: hubspotProduct.id,
                    quantity: '1',
                };
                const createdLineItem = await this.hubspotServices.createLineItem(lineItemDto);
                await this.hubspotServices.associateLineItemToDeal(createdLineItem.id, createdDeal.id);
            }
        }
        await session.populate(['customer']);
        return session;
    }
};
AfyPaymentsServices = __decorate([
    (0, common_1.Injectable)(),
    __param(10, (0, bull_1.InjectQueue)(constants_1.HUBSPOT_SYNC_ACTIONS_QUEUE)),
    __metadata("design:paramtypes", [common_1.Logger,
        customers_service_1.CustomersService,
        customer_events_service_1.CustomerEventsService,
        customer_properties_service_1.CustomerPropertiesService,
        products_service_1.ProductsService,
        hubspot_service_1.HubspotService,
        hubspot_sync_actions_services_1.HubspotSyncActionsServices,
        session_service_1.SessionService,
        onboard_service_1.OnboardService,
        payments_service_1.PaymentChargifyService, Object])
], AfyPaymentsServices);
exports.AfyPaymentsServices = AfyPaymentsServices;
//# sourceMappingURL=afy-payments.services.js.map