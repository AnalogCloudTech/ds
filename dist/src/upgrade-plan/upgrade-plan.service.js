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
exports.UpgradePlanService = void 0;
const types_1 = require("../payments/chargify/domain/types");
const payments_service_1 = require("../payments/payment_chargify/payments.service");
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
const products_service_1 = require("../onboard/products/products.service");
const payments_service_2 = require("../legacy/dis/legacy/payments/payments.service");
const product_schema_1 = require("../onboard/products/schemas/product.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const hubspot_service_1 = require("../legacy/dis/legacy/hubspot/hubspot.service");
const dateFormatters_1 = require("../internal/common/utils/dateFormatters");
const constants_1 = require("../legacy/dis/legacy/hubspot/constants");
const luxon_1 = require("luxon");
const contexts_1 = require("../internal/common/contexts");
let UpgradePlanService = class UpgradePlanService {
    constructor(productModel, logger, paymentChargifyService, productsService, hubspotService, paymentsService) {
        this.productModel = productModel;
        this.logger = logger;
        this.paymentChargifyService = paymentChargifyService;
        this.productsService = productsService;
        this.hubspotService = hubspotService;
        this.paymentsService = paymentsService;
    }
    async planUpgrade(customer, upgradePlanDto) {
        const { planComponentHandle, paymentProfileId, flow, isPlusPlan } = upgradePlanDto;
        const componentData = await this.paymentChargifyService.getComponentDetails(planComponentHandle);
        if ((0, lodash_1.isEmpty)(componentData)) {
            return null;
        }
        const { id: planPriceid } = componentData.component;
        const productData = await this.productsService.findProductByChargifyId(planPriceid.toString());
        if ((0, lodash_1.isEmpty)(productData)) {
            return null;
        }
        const paymentProfile = await this.paymentChargifyService.getPaymentProfile(paymentProfileId);
        if ((0, lodash_1.isEmpty)(paymentProfile)) {
            return null;
        }
        const subscriptionDetails = await this.paymentChargifyService.getAllActiveSubscriptionsFromCustomerEmail(customer.email);
        if ((0, lodash_1.isEmpty)(subscriptionDetails)) {
            return null;
        }
        let subscriptionData = subscriptionDetails[0];
        const deal = await this.hubspotService.getActiveMemberListDeal(customer.email);
        if (deal) {
            const dealSubscriptionId = (0, lodash_1.get)(deal, ['properties', 'chargify_subscription_id'], '');
            const subData = subscriptionDetails.find((sub) => sub.id.toString() === dealSubscriptionId);
            if (subData) {
                subscriptionData = subData;
            }
        }
        const { id: subscriptionId, state, credit_card, product: subProduct, } = subscriptionData;
        if (state === types_1.State.TRIALING && !isPlusPlan) {
            return null;
        }
        const billingNext = {
            interval: subProduct.interval,
            interval_unit: subProduct.interval_unit,
        };
        const changePaymentProfile = credit_card.id === paymentProfileId;
        if (!changePaymentProfile) {
            await this.paymentChargifyService.changePaymentProfileForSubscription(subscriptionId.toString(), paymentProfileId);
        }
        if (flow === 'family-change') {
            const productFromChargify = await this.paymentChargifyService.getProductByHandle(productData.chargifyProductHandle);
            billingNext.interval = productFromChargify.product.interval;
            billingNext.interval_unit = productFromChargify.product.interval_unit;
        }
        const updateSubscriptionDto = {
            subscription: {
                next_billing_at: this.getTimeDate(billingNext),
            },
        };
        if (flow === 'family-change') {
            updateSubscriptionDto.subscription.product_handle =
                productData.chargifyProductHandle;
        }
        await this.paymentChargifyService.updateSubscription(subscriptionId.toString(), updateSubscriptionDto);
        const allocateCompObject = {
            subscriptionId,
            newComponentId: Number(planPriceid),
        };
        let result;
        if (isPlusPlan) {
            result = await this.paymentChargifyService.allocateOnce(allocateCompObject, state);
            if (state === types_1.State.TRIALING) {
                await this.paymentChargifyService.activateSubscription(subscriptionId, {
                    revert_on_failure: true,
                });
            }
        }
        else {
            result = await this.paymentChargifyService.allocateComponent(allocateCompObject);
        }
        return {
            result,
            subscriptionData,
            paymentProfile,
            productData,
        };
    }
    getTimeDate(intervalObject) {
        const dt = new Date();
        const { interval_unit, interval } = intervalObject;
        if (interval_unit == 'day') {
            dt.setDate(dt.getDate() + Number(interval));
        }
        if (interval_unit == 'month') {
            dt.setMonth(dt.getMonth() + Number(interval));
        }
        return `${dt.toISOString()} EDT`;
    }
    splitName(name) {
        const nameArr = name.split(' ');
        const first = nameArr.slice(0, nameArr.length - 1).join(' ');
        const last = nameArr[nameArr.length - 1];
        return { first, last };
    }
    async migrateSubscription(email, planComponentHandle) {
        var _a, _b, _c, _d;
        if (!email) {
            throw new common_1.HttpException({
                message: 'Email is required',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const componentData = await this.paymentChargifyService.getComponentDetails(planComponentHandle);
        if ((0, lodash_1.isEmpty)(componentData)) {
            return null;
        }
        const { id: planPriceid } = componentData.component;
        await this.productsService.findProductByChargifyId(planPriceid.toString());
        const isStripeSubscription = await this.identifyAccount(email);
        if (!isStripeSubscription.value) {
            throw new common_1.HttpException({
                message: 'This account is not stripe account',
            }, common_1.HttpStatus.OK);
        }
        const dealData = await this.hubspotService.findActiveDealsByEmail(email);
        const dealId = (0, lodash_1.get)(dealData, ['results', '0', 'id']);
        const subscriptionId = (0, lodash_1.get)(dealData, [
            'results',
            '0',
            'properties',
            'stripe_subscription_id',
        ]);
        try {
            const subscriptionDetails = (await this.paymentsService.getSubscriptionBySubscriptionId(subscriptionId));
            const customer = subscriptionDetails.customer;
            const customerDetails = (await this.paymentsService.getCustomer(customer));
            const fullName = (0, lodash_1.get)(customerDetails, ['metadata', 'name']) ||
                (0, lodash_1.get)(customerDetails, ['name']) ||
                (0, lodash_1.get)(customerDetails, ['shipping', 'name']);
            const splitedName = this.splitName(fullName);
            const nextBillingAt = (0, lodash_1.get)(subscriptionDetails, 'current_period_end');
            const cardDetails = await this.paymentsService.getPaymentMethods(email);
            let card_type = '';
            let expiration_month = '';
            let expiration_year = '';
            let last_four = '';
            for (const card of cardDetails.data) {
                const defaultCard = card.default;
                if (defaultCard) {
                    card_type = card.brand;
                    expiration_month = card.expMonth.toString();
                    expiration_year = card.expYear.toString();
                    last_four = card.last4.toString();
                }
            }
            const productInfo = await this.productModel.findOne({
                chargifyComponentId: planPriceid,
            });
            const contactInfo = {
                email: customerDetails.email,
                phone: customerDetails.phone,
            };
            const customerAddressInfo = (0, lodash_1.get)(customerDetails, 'address', {});
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
            const { address1: addressOne, address2: addressTwo } = customerAddress, rest = __rest(customerAddress, ["address1", "address2"]);
            const productHandle = (0, lodash_1.get)(productInfo, 'chargifyProductHandle');
            const chargifySubscriptionPayload = {
                subscription: {
                    product_handle: productHandle,
                    next_billing_at: nextBillingAt && (0, dateFormatters_1.epochToHSDate)(nextBillingAt),
                    components: [
                        {
                            component_id: planPriceid,
                            allocated_quantity: 1,
                        },
                    ],
                    customer_attributes: Object.assign(Object.assign({ first_name: splitedName === null || splitedName === void 0 ? void 0 : splitedName.first, last_name: splitedName === null || splitedName === void 0 ? void 0 : splitedName.last }, contactInfo), rest),
                    credit_card_attributes: {
                        first_name: splitedName === null || splitedName === void 0 ? void 0 : splitedName.first,
                        last_name: splitedName === null || splitedName === void 0 ? void 0 : splitedName.last,
                        card_type: card_type,
                        expiration_month: expiration_month,
                        expiration_year: expiration_year,
                        last_four: last_four,
                        vault_token: customer.toString(),
                        current_vault: 'stripe_connect',
                    },
                },
            };
            const chargifySybscription = await this.paymentChargifyService.createSubscription(chargifySubscriptionPayload);
            const reqBody = {
                properties: {
                    [(_a = productInfo.productProperty) !== null && _a !== void 0 ? _a : 'authorify_product']: productInfo.title,
                    recurring_revenue_amount: (_b = productInfo.value) === null || _b === void 0 ? void 0 : _b.toString(10),
                    dealname: this.hubspotService.createDealName(chargifySybscription.subscription, chargifySybscription.subscription.customer, productInfo),
                    pipeline: constants_1.DEAL_PIPELINE_ID,
                    dealstage: constants_1.DEAL_DEAL_STAGE_ID,
                    stripe_subscription_id: '',
                    chargify_subscription_id: chargifySybscription === null || chargifySybscription === void 0 ? void 0 : chargifySybscription.subscription.id.toString(10),
                    status: this.hubspotService.translateStripeStatusToHubspot(chargifySybscription === null || chargifySybscription === void 0 ? void 0 : chargifySybscription.subscription.state),
                    amount: productInfo.value.toString(10),
                    contact_email: (0, lodash_1.get)(chargifySybscription, [
                        'subscription',
                        'customer',
                        'email',
                    ]),
                    first_name: (0, lodash_1.get)(chargifySybscription, [
                        'subscription',
                        'customer',
                        'first_name',
                    ]),
                    last_name: (0, lodash_1.get)(chargifySybscription, [
                        'subscription',
                        'customer',
                        'last_name',
                    ]),
                    next_recurring_date: ((_c = chargifySybscription === null || chargifySybscription === void 0 ? void 0 : chargifySybscription.subscription) === null || _c === void 0 ? void 0 : _c.current_period_ends_at)
                        ? (0, dateFormatters_1.convertToHSDate)((_d = chargifySybscription === null || chargifySybscription === void 0 ? void 0 : chargifySybscription.subscription) === null || _d === void 0 ? void 0 : _d.current_period_ends_at)
                        : luxon_1.DateTime.now().plus({ months: 1 }).toFormat('yyyy-LL-dd'),
                },
            };
            const user = await this.hubspotService.getContactDetailsByEmail(email);
            await this.hubspotService.updateDeal(dealId, reqBody);
            const updateCreditsAndPackagesDto = {
                id: user.vid.toString(),
                credits: productInfo.creditsOnce
                    ? productInfo.creditsOnce
                    : productInfo.creditsRecur,
                packages: [productInfo.bookPackages],
            };
            await this.hubspotService.updateCreditsAndPackages(updateCreditsAndPackagesDto);
            await this.paymentsService.cancelSubscription(subscriptionId);
            return chargifySybscription;
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    payload: {
                        usageDate: luxon_1.DateTime.now(),
                        context: contexts_1.CONTEXT_CHARGIFY_DEAL,
                        stack: error === null || error === void 0 ? void 0 : error.stack,
                        error: error === null || error === void 0 ? void 0 : error.message,
                        message: 'Something went wrong while convert from stripe to chargify',
                    },
                });
                throw new common_1.HttpException({
                    message: 'Something went wrong while convert from stripe to chargify',
                    erorr: error.message,
                    name: error.name,
                    stack: error.stack,
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async identifyAccount(email) {
        if (!email) {
            throw new common_1.HttpException({
                message: 'Email is required',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const dealData = await this.hubspotService.findActiveDealsByEmail(email);
            const identifyStripe = (0, lodash_1.get)(dealData, [
                'results',
                '0',
                'properties',
                'stripe_subscription_id',
            ]);
            if (identifyStripe) {
                return { value: true };
            }
            return { value: false };
        }
        catch (e) {
            if (e instanceof Error)
                throw new common_1.HttpException({
                    message: 'Something went wrong with identify account',
                    name: e.name,
                    erorr: e.message,
                    stack: e.stack,
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
UpgradePlanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        common_1.Logger,
        payments_service_1.PaymentChargifyService,
        products_service_1.ProductsService,
        hubspot_service_1.HubspotService,
        payments_service_2.PaymentsService])
], UpgradePlanService);
exports.UpgradePlanService = UpgradePlanService;
//# sourceMappingURL=upgrade-plan.service.js.map