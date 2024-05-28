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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentChargifyService = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
const chargify_service_1 = require("../chargify/chargify.service");
const routes_1 = require("./routes");
const url_1 = require("../../internal/utils/url");
const payments_constants_1 = require("../../legacy/dis/legacy/payments/payments.constants");
const payments_constants_2 = require("./payments.constants");
const types_1 = require("../chargify/domain/types");
const types_2 = require("./types");
const contexts_1 = require("../../internal/common/contexts");
const luxon_1 = require("luxon");
const payments_gateway_1 = require("./gateways/payments.gateway");
const products_service_1 = require("../../onboard/products/products.service");
const paginator_1 = require("../../internal/utils/paginator");
const cms_service_1 = require("../../cms/cms/cms.service");
let PaymentChargifyService = class PaymentChargifyService {
    constructor(productsService, chargifyService, paymentSocketGateway, cmsService, logger) {
        this.productsService = productsService;
        this.chargifyService = chargifyService;
        this.paymentSocketGateway = paymentSocketGateway;
        this.cmsService = cmsService;
        this.logger = logger;
    }
    find(url, params) {
        return this.chargifyService.passthru(url, 'get', { params });
    }
    async createSubscription(createSubscriptionDto) {
        try {
            const subscriptionCreated = await this.generalCreate(routes_1.ROUTE_SUBSCRIPTION_CREATE, createSubscriptionDto);
            return subscriptionCreated;
        }
        catch (error) {
            this.logger.error({
                payload: {
                    usageDate: luxon_1.DateTime.now(),
                    error,
                    subcontext: contexts_1.CONTEXT_CHARGIFY,
                },
            }, '', contexts_1.CONTEXT_ERROR);
            if (error instanceof Error) {
                throw new common_1.HttpException({
                    message: 'unable to create chargify subscription',
                    error: error === null || error === void 0 ? void 0 : error.message,
                    stack: error === null || error === void 0 ? void 0 : error.stack,
                    name: error === null || error === void 0 ? void 0 : error.name,
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    updateSubscription(subscriptionId, updateSubscriptionDto) {
        if (!subscriptionId) {
            throw new common_1.HttpException({ message: 'missing param subscription_id' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_SUBSCRIPTION_UPDATE, ':id', `${subscriptionId}`);
        return this.generalUpdate(url, updateSubscriptionDto);
    }
    async findSubscriptionById(subscriptionId) {
        if (!subscriptionId) {
            throw new common_1.HttpException({ message: 'missing param subscription_id' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_SUBSCRIPTION_UPDATE, ':id', `${subscriptionId}`);
        return await this.find(url);
    }
    purgeSubscription(subscriptionId, query) {
        const hasSubscriptionId = query.includes('subscription_id');
        if (!subscriptionId || !hasSubscriptionId) {
            throw new common_1.HttpException({ message: 'missing param subscription_id' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_SUBSCRIPTION_PURGE, ':id', subscriptionId) +
            `?${query}`;
        return this.generalDelete(url);
    }
    activateSubscription(subscriptionId, activateSubscription) {
        if (!subscriptionId) {
            throw new common_1.HttpException({ message: 'Missing Subscription Id' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_SUBSCRIPTION_ACTIVATE, ':subscriptionId', `${subscriptionId}`);
        return this.generalUpdate(url, activateSubscription);
    }
    createInvoice(subscriptionId, createInvoiceDto) {
        if (!subscriptionId) {
            throw new common_1.HttpException({ message: 'missing param subscription_id' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_INVOICE_CREATE, ':id', `${subscriptionId}`);
        return this.generalCreate(url, createInvoiceDto);
    }
    voidInvoice(invoiceId, updateInvoiceDto) {
        if (!invoiceId) {
            throw new common_1.HttpException({ message: 'missing param invoice id' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_INVOICE_VOID, ':id', invoiceId);
        return this.generalCreate(url, updateInvoiceDto);
    }
    createPayment(invoiceId, createPaymentDto) {
        if (!invoiceId) {
            throw new common_1.HttpException({ message: 'missing param invoiceId' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_PAYMENT_CREATE, ':id', invoiceId);
        return this.generalCreate(url, createPaymentDto);
    }
    async createPaymentProfile(userEmail, createPaymentDto) {
        if (!userEmail) {
            throw new common_1.HttpException({ message: 'missing key customer_email or customer_id' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const payload = {
            payment_profile: {
                chargify_token: createPaymentDto.chargifyToken,
                customer_id: '',
            },
        };
        const customer = await this.getCustomerInfoFromEmail(userEmail);
        payload.payment_profile.customer_id = customer.id;
        return this.generalCreate(routes_1.ROUTE_PAYMENT_PROFILE_CREATE, payload);
    }
    updatePaymentProfile(paymentProfileId, updatePaymentProfileDto) {
        if (!paymentProfileId) {
            throw new common_1.HttpException({ message: 'missing param paymentProfile_id' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_PAYMENT_PROFILE_UPDATE, ':id', `${paymentProfileId}`);
        return this.generalUpdate(url, updatePaymentProfileDto);
    }
    getPaymentProfile(paymentProfileId) {
        if (!paymentProfileId) {
            throw new common_1.HttpException({ message: 'missing param paymentProfile_id' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_PAYMENT_PROFILE_UPDATE, ':id', `${paymentProfileId}`);
        return this.find(url);
    }
    getComponentDetails(handle) {
        if (!handle) {
            throw new common_1.HttpException({ message: 'missing param component handle' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const url = `components/lookup.json?handle=${handle}`;
        return this.find(url);
    }
    getMetadataForResource(resourceType, resourceId) {
        const url = (0, url_1.replaceAll)(routes_1.ROUTE_RESOURCE_METADATA, {
            _id: resourceId,
            _type: resourceType,
        });
        return this.chargifyService.passthru(url, 'get', {});
    }
    async setMetadataForResource(resourceType, resourceId, metadata) {
        const url = (0, url_1.replaceAll)(routes_1.ROUTE_RESOURCE_METADATA, {
            _type: resourceType,
            _id: resourceId,
        });
        const payload = metadata.map((meta) => {
            const { name, value } = meta;
            return { name, value };
        });
        const metadataPayload = {
            metadata: payload,
        };
        return this.chargifyService.passthru(url, 'post', metadataPayload);
    }
    async getCustomerInfoFromEmail(customerEmail) {
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_CUSTOMERS_LIST, ':query', customerEmail);
        const response = await this.find(url);
        const customer = (0, lodash_1.get)(response, '[0].customer');
        return customer;
    }
    async getPaymentProfilesFromEmail(email) {
        const customer = await this.getCustomerInfoFromEmail(email);
        const url = routes_1.ROUTE_PAYMENT_PROFILE_CREATE + `?customer_id=${customer.id}`;
        return this.find(url);
    }
    async getPaymentProfilesListFromEmail(email) {
        const customer = await this.getCustomerInfoFromEmail(email);
        if (!customer) {
            return [];
        }
        const url = routes_1.ROUTE_PAYMENT_PROFILE_CREATE + `?customer_id=${customer.id}`;
        const paymentProfiles = await this.find(url);
        if (paymentProfiles.length) {
            return paymentProfiles.map((paymentProfile, idx) => {
                paymentProfile.payment_profile.expired = this.isExpired(paymentProfile.payment_profile);
                paymentProfile.payment_profile.default = idx === 0;
                paymentProfile.payment_profile.email = email;
                return paymentProfile.payment_profile;
            });
        }
        return [];
    }
    async getShowCreditsButton(email) {
        const customerData = await this.getCustomerInfoFromEmail(email);
        if (!(customerData === null || customerData === void 0 ? void 0 : customerData.id)) {
            this.logger.log({
                payload: {
                    message: 'Chargify Customer does not exist',
                    method: 'getShowCreditsButton',
                    usageDate: luxon_1.DateTime.now(),
                },
            }, contexts_1.CONTEXT_PAYMENT_CHARGIFY_SERVICE);
            return false;
        }
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_CUSTOMERS_SUBSCRIPTIONS, ':id', customerData.id);
        const allSubscriptions = await this.find(url);
        const subscriptions = allSubscriptions.map((sub) => sub.subscription);
        if ((0, lodash_1.isEmpty)(subscriptions)) {
            return false;
        }
        const filteredAuthorifySubscriptions = subscriptions === null || subscriptions === void 0 ? void 0 : subscriptions.filter(({ product }) => {
            let required = false;
            const { name } = product;
            const isAuthorifyMembership = name &&
                name.includes('Authorify') &&
                payments_constants_1.AVAILABLE_PLANS_TYPES.some((v) => name.includes(v));
            if (isAuthorifyMembership || !name) {
                required = true;
            }
            return required;
        });
        const firstSubscription = (0, lodash_1.first)(filteredAuthorifySubscriptions);
        if (!firstSubscription || firstSubscription.state === types_1.State.TRIALING) {
            return false;
        }
        const componentsLists = await this.getComponentsBySubscriptionId(firstSubscription.id);
        if ((0, lodash_1.isEmpty)(componentsLists)) {
            return false;
        }
        const { component_id } = componentsLists[0];
        const query = {
            chargifyComponentId: component_id.toString(),
        };
        const productObj = await this.productsService.find(query);
        return !!(productObj === null || productObj === void 0 ? void 0 : productObj.toShowBuyCredits);
    }
    async getBillingHistory(customer, startDate, endDate, page = 0, perPage = 15) {
        const subscriptionDetails = await this.getAllActiveSubscriptionsFromCustomerEmail(customer.email);
        if ((0, lodash_1.isEmpty)(subscriptionDetails)) {
            return [];
        }
        const { id: subscriptionId } = subscriptionDetails[0];
        const paramsData = (0, url_1.paramsStringify)({
            subscription_id: subscriptionId,
            date_field: 'paid_date',
            payments: true,
            start_date: startDate,
            end_date: endDate,
            page,
            per_page: perPage,
        });
        const url = `${routes_1.ROUTE_INVOICE_LIST_BY_SUBID}?${paramsData}`;
        const invoiceList = await this.find(url);
        const result = invoiceList.invoices;
        if ((0, lodash_1.isEmpty)(result)) {
            return [];
        }
        const response = result.map((info) => {
            info.invoice_download = info.public_url.replace('?', '.pdf?');
            return info;
        });
        const invoiceListPaginated = paginator_1.PaginatorSchema.build(invoiceList.meta.total_invoice_count, response, --page, perPage);
        return invoiceListPaginated;
    }
    async getComponentsBySubscriptionId(subscriptionId) {
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_SUBSCRIPTION_COMPONENTS, ':id', `${subscriptionId}`);
        const response = (await this.find(url)) || [];
        const componentsList = response
            .filter((info) => (0, lodash_1.get)(info, 'component.allocated_quantity'))
            .map((info) => info.component) || [];
        return componentsList;
    }
    isExpired(paymentProfile) {
        const { expiration_month, expiration_year } = paymentProfile;
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        return (expiration_year < currentYear ||
            (expiration_year === currentYear && expiration_month < currentMonth));
    }
    async getSubscriptionEvents(subscriptionId) {
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_SUBSCRIPTION_EVENTS, ':id', `${subscriptionId}`);
        return this.find(url);
    }
    async getSubscriptionBySubId(subscriptionId) {
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_SUBSCRIPTION_BY_ID, ':id', subscriptionId);
        return this.find(url);
    }
    async getInvoiceByInvoiceId(invoiceId) {
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_INVOICE, ':id', invoiceId);
        return this.find(url);
    }
    async sendInvoice(invoiceId, reqObject) {
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_SEND_INVOICE, ':id', invoiceId);
        return this.generalCreate(url, reqObject);
    }
    async addEventNameInSubscription(subscriptions) {
        const updatedSubscriptionList = subscriptions.map(async (subscription) => {
            const events = await this.getSubscriptionEvents(subscription === null || subscription === void 0 ? void 0 : subscription.id);
            const component = await this.addComponentUnitPriceInComponent(subscription.id);
            const filteredEvents = events.filter(({ event }) => payments_constants_2.subscriptionEventsFilters.includes(event.key));
            const { key: billingReason, message } = (0, lodash_1.get)(filteredEvents, '[0].event', {});
            return Object.assign(Object.assign({}, subscription), { billingReason, message, component });
        });
        return Promise.all(updatedSubscriptionList);
    }
    async getOnlySubscriptionsFromCustomerEmail(email) {
        const customer = await this.getCustomerInfoFromEmail(email);
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_CUSTOMERS_SUBSCRIPTIONS, ':id', customer.id);
        const response = await this.find(url);
        return response.map((sub) => sub.subscription);
    }
    async getSubscriptionsFromEmail(email, isAllActiveRequired = 'false') {
        const customer = await this.getCustomerInfoFromEmail(email);
        if ((0, lodash_1.isEmpty)(customer)) {
            throw new common_1.HttpException({
                message: 'Customer not found in Chargify with email address',
            }, common_1.HttpStatus.NOT_FOUND);
        }
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_CUSTOMERS_SUBSCRIPTIONS, ':id', customer.id);
        const allSubscriptions = await this.find(url);
        if ((0, lodash_1.isEmpty)(allSubscriptions)) {
            throw new common_1.HttpException({
                message: 'There is no subscriptions found with email address',
            }, common_1.HttpStatus.NOT_FOUND);
        }
        const subscriptions = allSubscriptions.map((sub) => sub.subscription);
        if (isAllActiveRequired === 'ALL') {
            return this.addEventNameInSubscription(subscriptions);
        }
        if (isAllActiveRequired === 'true') {
            return this.buildSubscriptionObject(subscriptions);
        }
        const filteredAuthorifySubscriptions = subscriptions === null || subscriptions === void 0 ? void 0 : subscriptions.filter(({ product }) => {
            let required = false;
            if (isAllActiveRequired === 'false') {
                const { name } = product;
                const isAuthorifyMembership = name &&
                    name.includes('Authorify') &&
                    payments_constants_1.AVAILABLE_PLANS_TYPES.some((v) => name.includes(v));
                if (isAuthorifyMembership || !name) {
                    required = true;
                }
            }
            return required;
        });
        return this.buildSubscriptionObject(filteredAuthorifySubscriptions);
    }
    async getDefaultPaymentProfile(email) {
        try {
            const subscriptions = await this.getAllActiveSubscriptionsFromCustomerEmail(email);
            return (0, lodash_1.get)(subscriptions, ['0', 'credit_card']);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException({
                    message: 'unable to get default payment profile',
                    error: error === null || error === void 0 ? void 0 : error.message,
                    stack: error === null || error === void 0 ? void 0 : error.stack,
                    name: error === null || error === void 0 ? void 0 : error.name,
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async changeDefaultPaymentProfile(email, paymentProfileId) {
        try {
            const paymentProfiles = [];
            const subscription = await this.getAllActiveSubscriptionsFromCustomerEmail(email);
            for (const subscriptions of subscription) {
                const url = `/subscriptions/${subscriptions.id}/payment_profiles/${paymentProfileId}/change_payment_profile.json`;
                const response = await this.generalCreate(url, {});
                paymentProfiles.push(response);
            }
            return paymentProfiles;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException({
                    message: 'unable to create change payment profile',
                    error: error === null || error === void 0 ? void 0 : error.message,
                    stack: error === null || error === void 0 ? void 0 : error.stack,
                    name: error === null || error === void 0 ? void 0 : error.name,
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async deletePaymentProfile(profileId, email) {
        if (!profileId) {
            throw new common_1.HttpException({
                message: 'profileId is required',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        if (!email) {
            throw new common_1.HttpException({
                message: 'email is required',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const url = `/payment_profiles/${profileId}.json`;
            const defaultPayment = await this.getDefaultPaymentProfile(email);
            const defaultPaymentId = (0, lodash_1.get)(defaultPayment, 'id');
            if (defaultPaymentId.toString() === profileId.toString()) {
                throw new common_1.HttpException({
                    message: 'unable to delete default payment profile',
                }, common_1.HttpStatus.OK);
            }
            await this.generalDelete(url);
            return { message: 'Payment profile deleted successfully' };
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException({
                    message: 'unable to delete default payment profile',
                    error: error === null || error === void 0 ? void 0 : error.message,
                    stack: error === null || error === void 0 ? void 0 : error.stack,
                    name: error === null || error === void 0 ? void 0 : error.name,
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async changePaymentProfileForSubscription(subscription_id, paymentProfileId) {
        if (!subscription_id || !paymentProfileId) {
            throw new common_1.HttpException({ message: 'subscription Id Or Payment Profile Id Not found' }, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const url = `/subscriptions/${subscription_id}/payment_profiles/${paymentProfileId}/change_payment_profile.json`;
            const response = await this.generalCreate(url, {});
            return response;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException({
                    message: 'unable to create change payment profile',
                    error: error === null || error === void 0 ? void 0 : error.message,
                    stack: error === null || error === void 0 ? void 0 : error.stack,
                    name: error === null || error === void 0 ? void 0 : error.name,
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async getSubscriptionComponents(subscriptionId, isAllListRequired = false) {
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_SUBSCRIPTION_COMPONENTS, ':id', `${subscriptionId}`);
        const response = (await this.find(url)) || [];
        if (isAllListRequired) {
            return (response.map((info) => info.component) || []);
        }
        const componentsList = response
            .filter((info) => (0, lodash_1.get)(info, 'component.allocated_quantity'))
            .map((info) => info.component) || [];
        return (0, lodash_1.first)(componentsList);
    }
    async createPreviewAllocation(subscriptionId, createPreviewDto) {
        if (!subscriptionId) {
            throw new common_1.HttpException({ message: 'Bad request' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_PREVIEW_ALLOCATION, ':id', subscriptionId);
        const response = await this.generalCreate(url, createPreviewDto);
        try {
            return (0, lodash_1.get)(response, 'allocation_preview');
        }
        catch (e) {
            this.logger.log({
                payload: {
                    usageDate: luxon_1.DateTime.now(),
                    message: `${JSON.stringify(e)}`,
                },
            }, contexts_1.CONTEXT_PAYMENT_CHARGIFY_SERVICE);
            return Promise.reject(e);
        }
    }
    async getAllocation(result) {
        var _a;
        const allocatedComponents = result === null || result === void 0 ? void 0 : result.filter((comp) => comp.allocation.quantity).map((info) => info.allocation);
        const allocatedComponent = (0, lodash_1.first)(allocatedComponents);
        const subId = (_a = (0, lodash_1.get)(allocatedComponent, 'subscription_id')) === null || _a === void 0 ? void 0 : _a.toString();
        const readSubscriptionUrl = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_SUBSCRIPTION_UPDATE, ':id', subId);
        const { subscription } = await this.find(readSubscriptionUrl);
        return Object.assign(Object.assign({}, allocatedComponent), { renewalDate: subscription.current_period_ends_at });
    }
    async allocateOnce(allocationDto, state) {
        const { subscriptionId, newComponentId } = allocationDto;
        if (!subscriptionId || !newComponentId) {
            throw new common_1.HttpException({
                message: 'Bad request, Missing property subscriptionId, newComponentId',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_COMPONENT_ALLOCATION, ':id', `${subscriptionId}`);
        const component = (await this.getSubscriptionComponents(subscriptionId));
        let responseDegraded = [];
        const isTrialing = state === types_1.State.TRIALING;
        if (!(0, lodash_1.isEmpty)(component)) {
            const currentComponentId = component.component_id;
            const downPayload = {
                accrue_charge: false,
                upgrade_charge: 'prorated',
                downgrade_credit: 'prorated',
                allocations: [
                    {
                        component_id: currentComponentId,
                        quantity: 0,
                        accrue_charge: false,
                        upgrade_charge: 'prorated',
                        downgrade_credit: 'prorated',
                    },
                ],
            };
            responseDegraded = await this.generalCreate(url, downPayload);
        }
        const upPayload = {
            accrue_charge: false,
            upgrade_charge: isTrialing ? 'none' : 'prorated',
            downgrade_credit: isTrialing ? 'none' : 'prorated',
            allocations: [
                {
                    component_id: newComponentId,
                    quantity: 1,
                    accrue_charge: false,
                    upgrade_charge: isTrialing ? 'none' : 'prorated',
                    downgrade_credit: isTrialing ? 'none' : 'prorated',
                },
            ],
        };
        const responseUpgraded = await this.generalCreate(url, upPayload);
        const result = [...responseUpgraded, ...responseDegraded];
        return await this.getAllocation(result);
    }
    async allocateComponent(allocationDto) {
        const { subscriptionId, newComponentId } = allocationDto;
        if (!subscriptionId || !newComponentId) {
            throw new common_1.HttpException({
                message: 'Bad request, Missing property subscriptionId, newComponentId',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const component = (await this.getSubscriptionComponents(subscriptionId));
        if ((0, lodash_1.isEmpty)(component)) {
            throw new common_1.HttpException({
                message: 'Component not found in this subscription',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const currentComponentId = component.component_id;
        await this.migrateSubscription(subscriptionId, newComponentId);
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_COMPONENT_ALLOCATION, ':id', `${subscriptionId}`);
        const downPayload = {
            accrue_charge: false,
            upgrade_charge: 'prorated',
            downgrade_credit: 'prorated',
            allocations: [
                {
                    component_id: currentComponentId,
                    quantity: 0,
                    accrue_charge: false,
                    upgrade_charge: 'prorated',
                    downgrade_credit: 'prorated',
                },
            ],
        };
        const responseDegraded = await this.generalCreate(url, downPayload);
        const upPayload = {
            accrue_charge: false,
            upgrade_charge: 'prorated',
            downgrade_credit: 'prorated',
            allocations: [
                {
                    component_id: newComponentId,
                    quantity: 1,
                    accrue_charge: false,
                    upgrade_charge: 'prorated',
                    downgrade_credit: 'prorated',
                },
            ],
        };
        const responseUpgraded = await this.generalCreate(url, upPayload);
        const result = [...responseDegraded, ...responseUpgraded];
        return await this.getAllocation(result);
    }
    async getComponentPriceByPricePointId(componentId) {
        if (!componentId) {
            throw new common_1.HttpException({ message: 'Bad request' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_COMPONENT_PRICE_BY_PRICE_POINT_ID, ':id', `${componentId}`);
        const response = await this.find(url);
        return (0, lodash_1.first)(response.price_points);
    }
    async getProductByHandle(handle) {
        if (!handle) {
            throw new common_1.HttpException({ message: 'Bad request' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_GET_PRODUCT_BY_HANDLE, ':id', `${handle}`);
        const response = await this.find(url);
        return response;
    }
    async getAllSubscriptionsFromCustomerEmail(email) {
        const customer = await this.getCustomerInfoFromEmail(email);
        if (!customer) {
            return null;
        }
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_CUSTOMERS_SUBSCRIPTIONS, ':id', customer.id);
        const subscriptionsResponse = await this.find(url);
        return subscriptionsResponse.map(({ subscription }) => subscription);
    }
    async getAllActiveSubscriptionsFromCustomerEmail(email) {
        const subscriptions = await this.getAllSubscriptionsFromCustomerEmail(email);
        const activeStates = [types_1.State.ACTIVE, types_1.State.TRIALING];
        if (!(0, lodash_1.get)(subscriptions, 'length')) {
            return null;
        }
        return subscriptions.filter((subscription) => {
            return activeStates.includes(subscription.state);
        });
    }
    async getComponentsFromSubscription(subscription) {
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_SUBSCRIPTION_COMPONENT, ':id', `${subscription.id}`);
        const subscriptionComponentResponse = await this.find(url);
        return subscriptionComponentResponse.map(({ component }) => component);
    }
    async getAllAllocatedComponentsFromSubscription(subscription) {
        const components = await this.getComponentsFromSubscription(subscription);
        return components.filter(({ allocated_quantity }) => allocated_quantity > 0);
    }
    async migrateSubscription(subscriptionId, newComponentId) {
        const componentsList = (await this.getSubscriptionComponents(subscriptionId, true));
        const currentComponent = componentsList.find((comp) => comp.allocated_quantity);
        const newComponent = componentsList.find((comp) => comp.component_id === newComponentId);
        const readSubscriptionUrl = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_SUBSCRIPTION_UPDATE, ':id', `${subscriptionId}`);
        const { subscription } = await this.find(readSubscriptionUrl);
        const productHandle = (0, lodash_1.get)(subscription, 'product.handle');
        const replacer = currentComponent.component_handle.split('_')[1];
        const newValue = newComponent.component_handle.split('_')[1];
        const newProductHandle = productHandle.replace(replacer, newValue);
        if (productHandle === newProductHandle) {
            return { subscription };
        }
        const payload = {
            migration: {
                product_handle: newProductHandle,
            },
        };
        const url = (0, url_1.replaceRouteParameter)(routes_1.ROUTE_COMPONENT_MIGRATE_SUBSCRIPTION, ':id', `${subscriptionId}`);
        return this.generalCreate(url, payload);
    }
    sendSuccessPaymentEventToSocket(dto) {
        const data = Object.assign(Object.assign({}, dto), { isApproved: true });
        return this.paymentSocketGateway.sendPaymentStatus(data);
    }
    sendSuccessUpsellPaymentEventToSocket(dto) {
        return this.paymentSocketGateway.sendUpsellStatus(Object.assign(Object.assign({}, dto), { isApproved: true }));
    }
    sendRmSuccessEventToSocket(dto) {
        return this.paymentSocketGateway.sendRMStatus(Object.assign(Object.assign({}, dto), { isApproved: true }));
    }
    async addComponentUnitPriceInComponent(subscriptionId) {
        const component = (await this.getSubscriptionComponents(subscriptionId));
        const componentPriceInfo = await this.getComponentPriceByPricePointId(component === null || component === void 0 ? void 0 : component.component_id);
        const unitPrice = (0, lodash_1.get)(componentPriceInfo, 'prices[0].unit_price');
        return Object.assign(Object.assign({}, component), { unitPrice });
    }
    async buildSubscriptionObject(subscriptions) {
        const firstSubscription = (0, lodash_1.first)(subscriptions);
        const component = await this.addComponentUnitPriceInComponent(firstSubscription.id);
        const subscriptionObj = (0, lodash_1.pick)(firstSubscription, [
            'current_period_ends_at',
            'product.name',
            'currency',
            'signup_revenue',
            'product.interval',
            'product.interval_unit',
            'product.id',
            'state',
            'id',
        ]);
        subscriptionObj.component = component;
        return subscriptionObj;
    }
    async generalCreate(route, data) {
        try {
            return await this.chargifyService.passthru(route, 'post', data);
        }
        catch (error) {
            if (error instanceof types_2.ErrorInfo) {
                const { status } = error.response;
                throw new common_1.HttpException(error === null || error === void 0 ? void 0 : error.message, status);
            }
        }
    }
    async generalUpdate(route, data) {
        try {
            return await this.chargifyService.passthru(route, 'put', data);
        }
        catch (error) {
            if (error instanceof types_2.ErrorInfo) {
                const { status } = error.response;
                throw new common_1.HttpException(error === null || error === void 0 ? void 0 : error.message, status);
            }
        }
    }
    async generalDelete(route, data = {}) {
        try {
            return await this.chargifyService.passthru(route, 'delete', data);
        }
        catch (error) {
            if (error instanceof types_2.ErrorInfo) {
                const { status } = error.response;
                throw new common_1.HttpException(error === null || error === void 0 ? void 0 : error.message, status);
            }
        }
    }
    async currentSubscriptionIsRM(customer) {
        const subscriptions = await this.getOnlySubscriptionsFromCustomerEmail(customer.email);
        const rmPlans = await this.cmsService.getReferralMarketingPlans();
        return subscriptions.some((subscription) => {
            const { product } = subscription;
            const isActive = subscription.state === types_1.State.ACTIVE ||
                subscription.state === types_1.State.TRIALING;
            const isRmProductFamily = rmPlans.includes(product.product_family.handle);
            return isActive && isRmProductFamily;
        });
    }
};
PaymentChargifyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [products_service_1.ProductsService,
        chargify_service_1.ChargifyService,
        payments_gateway_1.PaymentsWebsocketGateway,
        cms_service_1.CmsService,
        common_1.Logger])
], PaymentChargifyService);
exports.PaymentChargifyService = PaymentChargifyService;
//# sourceMappingURL=payments.service.js.map