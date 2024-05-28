import { ProductCreateDto } from './../repositories/products-integrations.repository';
export declare const paginator: {
    page: number;
    perPage: number;
};
export declare const allProductsStub: {
    data: {
        _id: string;
        stripeId: string;
        chargifyId: string;
        name: string;
        product: string;
        productProperty: string;
        priceProperty: string;
        value: string;
        credits_once: number;
        credits_recur: number;
        formUrl: string;
        dealPipeline: string;
        dealStage: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    }[];
    meta: {
        total: number;
        perPage: number;
        currentPage: number;
        lastPage: number;
    };
};
export declare const productStub: {
    stripeId: string;
    chargifyId: string;
    name: string;
    product: string;
    productProperty: string;
    priceProperty: string;
    value: string;
    credits_once: number;
    credits_recur: number;
    formUrl: string;
    dealPipeline: string;
    dealStage: string;
    _id: any;
    createdAt: any;
    updatedAt: any;
    __v: number;
};
export declare const createProductStub: ProductCreateDto;
