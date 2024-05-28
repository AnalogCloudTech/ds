"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductStub = exports.productStub = exports.allProductsStub = exports.paginator = void 0;
const index_1 = require("../../../legacy/dis/legacy/hubspot/constants/index");
exports.paginator = {
    page: 0,
    perPage: 1,
};
exports.allProductsStub = {
    data: [
        {
            _id: '6349b8bc5c4da7d80faa1e44',
            stripeId: 'price_1KUZLuA4Qp1GGmkoDRy0jUbW',
            chargifyId: '1824465',
            name: 'Authorify Premium Membership $259',
            product: 'Authorify Premium Membership',
            productProperty: 'authorify_product',
            priceProperty: 'recurring_revenue_amount',
            value: '259',
            credits_once: 0,
            credits_recur: 20,
            formUrl: 'https://authorify.com',
            dealPipeline: index_1.DEAL_PIPELINE_ID,
            dealStage: index_1.DEAL_DEAL_STAGE_ID,
            createdAt: '2022-10-14T19:30:04.172Z',
            updatedAt: '2022-10-14T19:30:04.172Z',
            __v: 0,
        },
    ],
    meta: { total: 1, perPage: 1, currentPage: 1, lastPage: 1 },
};
exports.productStub = {
    stripeId: 'price_1KUZLuA4Qp1GGmkoDRy0jUbW',
    chargifyId: '1824465',
    name: 'Authorify Premium Membership $259',
    product: 'Authorify Premium Membership',
    productProperty: 'authorify_product',
    priceProperty: 'recurring_revenue_amount',
    value: '259',
    credits_once: 0,
    credits_recur: 20,
    formUrl: 'https://authorify.com',
    dealPipeline: index_1.DEAL_PIPELINE_ID,
    dealStage: index_1.DEAL_DEAL_STAGE_ID,
    _id: null,
    createdAt: null,
    updatedAt: null,
    __v: 0,
};
exports.createProductStub = {
    stripeId: 'price_1KUZLuA4Qp1GGmkoDRy0jUbW',
    chargifyId: '1824465',
    name: 'Authorify Premium Membership $259',
    product: 'Authorify Premium Membership',
    productProperty: 'authorify_product',
    priceProperty: 'recurring_revenue_amount',
    value: '259',
    credits_once: 0,
    credits_recur: 20,
    formUrl: 'https://authorify.com',
    dealPipeline: index_1.DEAL_PIPELINE_ID,
    dealStage: index_1.DEAL_DEAL_STAGE_ID,
};
//# sourceMappingURL=constants.js.map