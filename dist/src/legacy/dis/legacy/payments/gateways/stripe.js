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
exports.Stripe = exports.PaymentBehavior = void 0;
const stripe_1 = require("stripe");
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
var PaymentBehavior;
(function (PaymentBehavior) {
    PaymentBehavior["allowIncomplete"] = "allow_incomplete";
    PaymentBehavior["errorIfIncomplete"] = "error_if_incomplete";
    PaymentBehavior["pendingIfIncomplete"] = "pending_if_incomplete";
    PaymentBehavior["defaultIncomplete"] = "default_incomplete";
})(PaymentBehavior = exports.PaymentBehavior || (exports.PaymentBehavior = {}));
let Stripe = class Stripe {
    constructor(apiKey) {
        this.stripe = new stripe_1.Stripe(apiKey, {
            apiVersion: '2019-05-16',
            typescript: true,
        });
    }
    async findCustomerById(customerId) {
        if (!customerId) {
            throw new common_1.HttpException({ message: 'no customer id was provided' }, common_1.HttpStatus.BAD_REQUEST);
        }
        return this.stripe.customers.retrieve(customerId);
    }
    async createSubscription(createSubscriptionDto) {
        const subscriptionData = this.buildSubscriptionObject(createSubscriptionDto);
        const stripeSubscription = await this.stripe.subscriptions.create(subscriptionData);
        const { metadata } = subscriptionData;
        if (!(0, lodash_1.isEmpty)(metadata)) {
            const paymentIntentId = (0, lodash_1.get)(stripeSubscription, [
                'latest_invoice',
                'payment_intent',
                'id',
            ]);
            if (paymentIntentId) {
                await this.stripe.paymentIntents.update(paymentIntentId, { metadata });
            }
        }
        const subscriptionId = (0, lodash_1.get)(subscriptionData, 'id');
        const clientSecret = (0, lodash_1.get)(stripeSubscription, [
            'latest_invoice',
            'payment_intent',
            'client_secret',
        ]);
        return {
            subscriptionId,
            clientSecret,
        };
    }
    updateSubscription(subscriptionId, items, otherParams) {
        const params = Object.assign({ items }, otherParams);
        return this.stripe.subscriptions.update(subscriptionId, params);
    }
    getSubscription(id) {
        return this.stripe.subscriptions.retrieve(id);
    }
    getUpcomingInvoice(subId, items, date, trialEnd) {
        const params = {
            subscription: subId,
            subscription_items: items,
            subscription_proration_date: date,
            subscription_billing_cycle_anchor: 'now',
        };
        if (trialEnd) {
            params.subscription_trial_end = trialEnd;
        }
        return this.stripe.invoices.retrieveUpcoming(params);
    }
    getCustomer(id) {
        return this.stripe.customers.retrieve(id);
    }
    updateCustomer(id, customer) {
        const data = {
            address: customer.address,
            metadata: customer.metadata,
            shipping: {
                address: customer.address,
                name: customer.name,
            },
            invoice_settings: {
                default_payment_method: (0, lodash_1.get)(customer, 'invoice_settings.default_payment_method', null),
            },
        };
        return this.stripe.customers.update(id, data);
    }
    async findCustomerByEmail(email) {
        if (!email) {
            throw new common_1.HttpException({ message: 'No email was provided' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const params = {
            limit: 1,
            email: email,
        };
        const response = await this.stripe.customers.list(params);
        return response.data[0];
    }
    createCustomer(customer) {
        const params = customer;
        params.shipping = {
            address: customer.address,
            name: customer.name,
        };
        return this.stripe.customers.create(params);
    }
    async getPaymentMethods(customerId, type) {
        const params = {
            type: type || 'card',
        };
        const paymentMethods = await this.stripe.customers.listPaymentMethods(customerId, params);
        return paymentMethods.data;
    }
    getAllPaymentIntents(customerId) {
        const func = this.stripe.paymentIntents.list;
        const params = {
            customer: customerId,
            limit: 100,
        };
        return this.paginate(func, params);
    }
    getAllInvoices(customerId, status = 'paid') {
        const func = this.getListInvoices;
        const params = {
            customer: customerId,
            limit: 100,
            status,
        };
        return this.paginate(func, params);
    }
    cancelSubscription(id) {
        return this.stripe.subscriptions.cancel(id);
    }
    getListInvoices(params) {
        return this.stripe.invoices.list(params);
    }
    async paginate(func, params = {}) {
        let pages = [];
        const request = await func.call(this, params);
        pages = [...request.data];
        if (request.has_more) {
            const lastItemId = (0, lodash_1.get)(request, ['data', request.data.length - 1, 'id']);
            params.starting_after = lastItemId;
            const nextPage = await this.paginate(func, params);
            pages = [...pages, ...nextPage];
        }
        return pages;
    }
    buildSubscriptionObject(createSubscriptionDto) {
        const { customerId, products, oneTimeProducts, trialPeriod, metadata } = createSubscriptionDto;
        const items = products.map((product) => ({
            price: product.id,
        }));
        const oneTimeItems = (0, lodash_1.map)(oneTimeProducts, (product) => ({
            price: product.id,
            quantity: product.quantity,
        }));
        return {
            customer: customerId,
            items,
            add_invoice_items: oneTimeItems,
            payment_behavior: PaymentBehavior.defaultIncomplete,
            expand: ['latest_invoice.payment_intent'],
            trial_period_days: trialPeriod,
            automatic_tax: {
                enabled: true,
            },
            metadata: metadata || {},
        };
    }
};
Stripe = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('STRIPE_SECRET_KEY')),
    __metadata("design:paramtypes", [String])
], Stripe);
exports.Stripe = Stripe;
//# sourceMappingURL=stripe.js.map