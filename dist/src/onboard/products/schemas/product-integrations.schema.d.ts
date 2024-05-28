import { HydratedDocument } from 'mongoose';
export declare class ProductIntegration {
    stripeId: string;
    chargifyId: string;
    name: string;
    product: string;
    productProperty: string;
    priceProperty: string;
    value: string;
    credits_once: number;
    credits_recur: number;
    book_packages: string;
    formUrl: string;
    dealPipeline: string;
    dealStage: string;
    createdAt: Date;
    updatedAt: Date;
}
export type ProductIntegrationDocument = HydratedDocument<ProductIntegration>;
export declare const ProductIntegrationSchema: import("mongoose").Schema<ProductIntegration, import("mongoose").Model<ProductIntegration, any, any, any>, any, any>;
