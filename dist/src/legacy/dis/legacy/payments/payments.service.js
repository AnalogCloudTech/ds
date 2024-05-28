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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
const dateFormatters_1 = require("../common/utils/dateFormatters");
const subscription_dto_1 = require("./dto/subscription.dto");
const cms_service_1 = require("../../../../cms/cms/cms.service");
const payments_constants_1 = require("./payments.constants");
const cms_filter_builder_1 = require("../../../../internal/utils/cms/filters/cms.filter.builder");
const payments_service_1 = require("../../../../payments/payment_chargify/payments.service");
let PaymentsService = class PaymentsService {
    constructor(paymentGateway, cmsService, paymentChargifyService) {
        this.paymentGateway = paymentGateway;
        this.cmsService = cmsService;
        this.paymentChargifyService = paymentChargifyService;
        this.getButtonText = (currentPlanId, currentPlanInterval, priceIdAnnually, priceIdMonthly, currentPlanAmount, paidMonthly, paidAnnually) => {
            const paidPeriod = currentPlanInterval === 'monthly' ? paidMonthly : paidAnnually;
            if (currentPlanId === priceIdMonthly) {
                return { monthly: 'Current Plan', annually: 'Switch To Annual' };
            }
            if (currentPlanId === priceIdAnnually) {
                return { monthly: 'Switch To Monthly', annually: 'Current Plan' };
            }
            return this.isDowngradeOrUpgrade(parseInt(currentPlanAmount, 10), parseInt(paidPeriod, 10));
        };
        this.isDowngradeOrUpgrade = (currentPlanAmount, amount) => currentPlanAmount > amount
            ? { monthly: 'Downgrade', annually: 'Downgrade' }
            : { monthly: 'Upgrade', annually: 'Upgrade' };
    }
    async createSubscription(createSubscriptionDto) {
        return this.paymentGateway.createSubscription(createSubscriptionDto);
    }
    async upgradeSubscription(dto) {
        const { subscriptionId, newPriceId, prorationDate, paymentMethodId } = dto;
        const prorationDateEpoch = (0, dateFormatters_1.isoToEpoch)(prorationDate);
        const subscription = await this.paymentGateway.getSubscription(subscriptionId);
        await this.validateSubscriptionUpgrade(prorationDateEpoch);
        const items = [
            {
                id: (0, lodash_1.get)(subscription, ['items', 'data', 0, 'id'], 'No ID'),
                price: newPriceId,
            },
        ];
        const upgradeOptions = {
            proration_behavior: subscription_dto_1.ProrationBehavior.CREATE_PRORATIONS,
            proration_date: prorationDateEpoch,
            cancel_at_period_end: false,
            default_payment_method: paymentMethodId,
            billing_cycle_anchor: 'now',
            trial_end: 'now',
        };
        const upgradedSubscription = await this.paymentGateway.updateSubscription(subscriptionId, items, upgradeOptions);
        const subscriptionItems = (0, lodash_1.get)(upgradedSubscription, ['items', 'data'], []);
        const listItems = subscriptionItems.map((i) => {
            return {
                priceId: i.price.id,
                nickName: i.price.nickname,
                amount: i.price.unit_amount,
                interval: i.price.recurring.interval,
                intervalCount: i.price.recurring.interval_count,
                quantity: i.quantity,
            };
        });
        const { billing_cycle_anchor, current_period_end, current_period_start, status, trial_end, } = upgradedSubscription;
        const res = {
            listItems,
            billingCycleAnchor: (0, dateFormatters_1.toISO)(billing_cycle_anchor),
            currentPeriodEnd: (0, dateFormatters_1.toISO)(current_period_end),
            currentPeriodStart: (0, dateFormatters_1.toISO)(current_period_start),
            status: status,
            trialEnd: (0, dateFormatters_1.toISO)(trial_end),
        };
        return res;
    }
    async getProration(email, dto) {
        var _a;
        const { subscriptionId, newPriceId } = dto;
        const prorationDate = (0, dateFormatters_1.nowEpoch)();
        const subscription = await this.paymentGateway.getSubscription(subscriptionId);
        await this.validateSubscriptionUpgrade(prorationDate);
        const items = [
            {
                id: (0, lodash_1.get)(subscription, ['items', 'data', 0, 'id'], 'No ID'),
                price: newPriceId,
            },
        ];
        let invoice = await this.paymentGateway.getUpcomingInvoice(subscription.id, items, prorationDate, 1);
        let nextPaymentAttempt;
        if (subscription.status === 'trialing' && invoice.total === 0) {
            invoice = await this.paymentGateway.getUpcomingInvoice(subscription.id, items, prorationDate, prorationDate);
            nextPaymentAttempt = (0, dateFormatters_1.toISO)(subscription.trial_end);
        }
        const newPrice = (0, lodash_1.find)((0, lodash_1.get)(invoice, ['lines', 'data'], []), (lineItem) => {
            return (0, lodash_1.get)(lineItem, ['price', 'id'], 'No ID') === newPriceId;
        });
        const lineItems = (0, lodash_1.map)((0, lodash_1.get)(invoice, ['lines', 'data']), (lineItem) => {
            return {
                amount: lineItem.amount,
                description: lineItem.description,
            };
        });
        const res = {
            subscriptionId: invoice.subscription,
            amountDue: invoice.amount_due,
            amountRemaining: invoice.amount_remaining,
            amountPaid: invoice.amount_paid,
            prorationDate: (0, dateFormatters_1.toISO)((_a = invoice.subscription_proration_date) !== null && _a !== void 0 ? _a : null),
            subTotal: invoice.subtotal,
            total: invoice.total,
            nextPaymentAttempt: nextPaymentAttempt !== null && nextPaymentAttempt !== void 0 ? nextPaymentAttempt : (0, dateFormatters_1.toISO)(invoice.next_payment_attempt),
            startingBalance: invoice.starting_balance,
            newPriceId: (0, lodash_1.get)(newPrice, ['price', 'id'], 'No ID'),
            newPriceNickname: (0, lodash_1.get)(newPrice, ['price', 'nickname'], 'No Nickname'),
            newPriceValue: (0, lodash_1.get)(newPrice, ['price', 'unit_amount'], 0),
            lineItems,
        };
        return res;
    }
    async validateSubscriptionUpgrade(prorationDate) {
        const upgradeTimeExpirey = payments_constants_1.SUBSCRIPTION_UPGRADE_EXPIRY;
        const prorationDateExpired = (0, dateFormatters_1.timeElapsed)(prorationDate, 'minutes') > upgradeTimeExpirey;
        if (prorationDateExpired) {
            throw new common_1.HttpException({
                message: 'Your upgrade/downgrade session has expired, please retry again',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        return true;
    }
    async createOrUpdateCustomer(customer) {
        const foundCustomer = await this.paymentGateway.findCustomerByEmail(customer.email);
        if (foundCustomer) {
            const customerId = foundCustomer.id;
            return this.paymentGateway.updateCustomer(customerId, customer);
        }
        return this.paymentGateway.createCustomer(customer);
    }
    async updateCustomerPaymentMethod(customerId, paymentMethodId) {
        const foundCustomer = (await this.paymentGateway.findCustomerById(customerId));
        if (!foundCustomer) {
            throw new common_1.HttpException({ message: 'customer not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        foundCustomer.invoice_settings.default_payment_method = paymentMethodId;
        return this.paymentGateway.updateCustomer(customerId, foundCustomer);
    }
    async getProductsPlans(currentPlanInterval, queryString, componentInfo) {
        const TOTAL_MONTHS = 12;
        const { componentId: currentPlanId, componentUnitPrice: currentPlanAmount, } = componentInfo;
        const response = await this.cmsService.productPackages(queryString);
        return response === null || response === void 0 ? void 0 : response.map((plan) => {
            const { attributes: { paidMonthly = '0', paidAnnually = '0', priceIdMonthly, priceIdAnnually, }, } = plan || {};
            plan.attributes.amount = { monthly: paidMonthly, annually: paidAnnually };
            plan.attributes.priceId = {
                monthly: priceIdMonthly,
                annually: priceIdAnnually,
            };
            plan.attributes.saveAmount =
                parseInt(paidMonthly, 10) * TOTAL_MONTHS - parseInt(paidAnnually, 10);
            plan.attributes.buttonText = currentPlanId
                ? this.getButtonText(currentPlanId, currentPlanInterval, priceIdAnnually, priceIdMonthly, currentPlanAmount, paidMonthly, paidAnnually)
                : { monthly: 'Upgrade', annually: 'Upgrade' };
            let planAttributes = plan.attributes;
            planAttributes = ((0, lodash_1.omit)(planAttributes, [
                'priceIdMonthly',
                'priceIdAnnually',
                'paidMonthly',
                'paidAnnually',
                'createdAt',
                'updatedAt',
                'publishedAt',
            ]));
            return Object.assign(Object.assign({}, plan), { attributes: planAttributes });
        });
    }
    updateCustomer(id, customer) {
        return this.paymentGateway.updateCustomer(id, customer);
    }
    getCustomer(id) {
        return this.paymentGateway.getCustomer(id);
    }
    findCustomerByEmail(email) {
        return this.paymentGateway.findCustomerByEmail(email);
    }
    async getInvoices(email) {
        const customer = await this.paymentGateway.findCustomerByEmail(email);
        if (!customer) {
            throw new common_1.HttpException({ message: `No customer was found for the provided data: ${email}` }, common_1.HttpStatus.NOT_FOUND);
        }
        const customerId = customer.id;
        const invoices = await this.paymentGateway.getAllInvoices(customerId);
        return this.buildGetInvoicesResponseObject(email, invoices);
    }
    async getPaymentMethods(email, type) {
        const customer = await this.paymentGateway.findCustomerByEmail(email);
        if (!customer) {
            throw new common_1.HttpException({ message: `No customer was found for the provided data: ${email}` }, common_1.HttpStatus.NOT_FOUND);
        }
        const customerId = customer.id;
        const defaultSource = customer.default_source ||
            customer.invoice_settings.default_payment_method;
        const paymentMethods = await this.paymentGateway.getPaymentMethods(customerId, type);
        return this.buildGetPaymentsResponseObject(email, paymentMethods, defaultSource);
    }
    async getSubscriptionByCustomer(email, isAllActiveRequired = false) {
        const customer = await this.paymentGateway.findCustomerByEmail(email);
        if (!customer) {
            throw new common_1.HttpException({ message: `No customer was found for the provided data: ${email}` }, common_1.HttpStatus.NOT_FOUND);
        }
        const subscriptions = customer.subscriptions.data;
        if (isAllActiveRequired) {
            return this.buildSubscriptionObject(subscriptions);
        }
        const filteredProductId = subscriptions.map((subscription) => subscription['plan']['id']);
        const filterObjects = [];
        filterObjects.push({
            name: 'priceIdMonthly',
            operator: '$in',
            value: filteredProductId,
        });
        filterObjects.push({
            name: 'priceIdAnnually',
            operator: '$in',
            value: filteredProductId,
        });
        const subQuery = {
            operator: '$or',
            value: filterObjects,
        };
        const filteredAuthorifySubcsriptions = subscriptions === null || subscriptions === void 0 ? void 0 : subscriptions.filter((subscription) => {
            let required = false;
            if (!isAllActiveRequired) {
                const { plan: { nickname }, } = subscription;
                const isAuthorifyMembership = nickname &&
                    nickname.includes('Authorify') &&
                    payments_constants_1.AVAILABLE_PLANS_TYPES.some((v) => nickname.includes(v)) &&
                    nickname.includes('Membership');
                if (isAuthorifyMembership) {
                    required = true;
                }
                else if (!nickname) {
                    required = true;
                }
            }
            return required;
        });
        const queryString = '?' + cms_filter_builder_1.CmsFilterBuilder.buildSubQuery(subQuery);
        const plans = await this.cmsService.productPackages(queryString);
        let subscriptionWithPlanDetails = [];
        if ((0, lodash_1.get)(plans, 'length')) {
            subscriptionWithPlanDetails = filteredAuthorifySubcsriptions === null || filteredAuthorifySubcsriptions === void 0 ? void 0 : filteredAuthorifySubcsriptions.map((subscription) => {
                const data = Object.assign({}, subscription);
                (0, lodash_1.each)(plans, ({ attributes, attributes: { priceIdMonthly, priceIdAnnually }, }) => {
                    const planId = (0, lodash_1.get)(data, ['plan', 'id']);
                    if ([priceIdMonthly, priceIdAnnually].includes(planId)) {
                        data.attributes = attributes;
                    }
                });
                return data;
            });
        }
        const subscriptionObj = this.buildSubscriptionObject(subscriptionWithPlanDetails);
        return Object.assign(Object.assign({}, subscriptionObj), (0, lodash_1.pick)((0, lodash_1.first)(plans), 'attributes.planName', 'attributes.plusPlan', 'attributes.licensedBooks', 'attributes.printedBooks'));
    }
    buildSubscriptionObject(subscription) {
        return (0, lodash_1.pick)((0, lodash_1.first)(subscription), [
            'current_period_end',
            'plan.nickname',
            'plan.currency',
            'plan.amount',
            'plan.interval',
            'plan.interval_count',
            'plan.id',
            'status',
            'id',
        ]);
    }
    async getPlans(email, plusPlan) {
        const filterObjects = [
            {
                name: 'plusPlan',
                operator: '$eq',
                value: plusPlan || false,
            },
        ];
        const queryString = '?' + cms_filter_builder_1.CmsFilterBuilder.build(filterObjects);
        const currentSubscription = await this.paymentChargifyService.getSubscriptionsFromEmail(email);
        const subscriptionComponent = (await this.paymentChargifyService.getSubscriptionComponents(currentSubscription === null || currentSubscription === void 0 ? void 0 : currentSubscription.id));
        const currentProductIntervalUnit = ((0, lodash_1.get)(currentSubscription, 'product.interval_unit'));
        const currentPlanInterval = ((currentProductIntervalUnit === 'month' ? 'monthly' : 'anually'));
        const componentId = subscriptionComponent === null || subscriptionComponent === void 0 ? void 0 : subscriptionComponent.component_id;
        const componentPriceDetails = await this.paymentChargifyService.getComponentPriceByPricePointId(componentId);
        const componentUnitPrice = (0, lodash_1.get)(componentPriceDetails, 'prices[0].unit_price');
        try {
            if (!JSON.parse(plusPlan)) {
                return this.getProductsPlans(currentPlanInterval, queryString, {
                    componentId: componentId.toString(),
                    componentUnitPrice,
                });
            }
        }
        catch (error) {
            const { response: errorResponse, message } = error;
            throw new common_1.HttpException(message, errorResponse === null || errorResponse === void 0 ? void 0 : errorResponse.status);
        }
        return [];
    }
    cancelSubscription(subscriptionId) {
        return this.paymentGateway.cancelSubscription(subscriptionId);
    }
    async getSubscriptionBySubscriptionId(subscriptionId) {
        return this.paymentGateway.getSubscription(subscriptionId);
    }
    buildGetPaymentsResponseObject(email, paymentMethods, defaultPaymentMethodId) {
        const cards = paymentMethods.map((method) => {
            const type = method.type;
            const brand = method.card.brand;
            const methodResponse = {
                brand: brand,
                country: (0, lodash_1.get)(method, [type, 'country'], ''),
                expMonth: (0, lodash_1.get)(method, [type, 'exp_month']),
                expYear: (0, lodash_1.get)(method, [type, 'exp_year']),
                last4: (0, lodash_1.get)(method, [type, 'last4'], ''),
                email,
                default: (0, lodash_1.get)(method, ['id'], -1) === defaultPaymentMethodId,
                id: (0, lodash_1.get)(method, ['id'], ''),
            };
            return methodResponse;
        });
        return {
            count: cards.length,
            data: cards,
        };
    }
    buildGetInvoicesResponseObject(email, paymentMethods) {
        const invoices = paymentMethods.map((invoice) => {
            const invoiceResponse = {
                amountDue: invoice.amount_due,
                amountPaid: invoice.amount_paid,
                amountRemaining: invoice.amount_remaining,
                total: invoice.total,
                billingReason: invoice.billing_reason,
                created: invoice.created,
                email: invoice.customer_email || email,
                status: invoice.status,
                paidDate: invoice.status_transitions.paid_at,
            };
            return invoiceResponse;
        });
        return {
            count: invoices.length,
            data: invoices,
        };
    }
};
PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('PAYMENT_GATEWAY')),
    __metadata("design:paramtypes", [Object, cms_service_1.CmsService,
        payments_service_1.PaymentChargifyService])
], PaymentsService);
exports.PaymentsService = PaymentsService;
//# sourceMappingURL=payments.service.js.map