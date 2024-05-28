import { Model } from 'mongoose';
import { ProductIntegration, ProductIntegrationDocument } from '@/onboard/products/schemas/product-integrations.schema';
export type ProductCreateDto = {
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
};
export declare class ProductsIntegrationsRepository {
    private readonly model;
    constructor(model: Model<ProductIntegration>);
    create(product: ProductCreateDto): Promise<ProductIntegrationDocument>;
    findByChargifyId(chargifyId: string): Promise<ProductIntegrationDocument>;
    findAll(page?: number, perPage?: number): Promise<import("@/internal/utils/paginator").PaginatorSchematicsInterface<import("mongoose").Document<unknown, any, ProductIntegration> & ProductIntegration & {
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
