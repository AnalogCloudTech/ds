import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { UpdateProductDto } from '../dto/update-products.dto';
import { Product, ProductDocument } from '../schemas/product.schema';
import { CreateProductDto } from '../dto/create-products.dto';
import { Type as ProductType } from '@/onboard/products/domain/types';
export declare class ProductsRepository {
    private model;
    constructor(model: Model<ProductDocument>);
    create(dto: CreateProductDto): Promise<import("mongoose").Document<unknown, any, Product> & Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(page?: number, perPage?: number, searchQuery?: string): Promise<PaginatorSchematicsInterface<ProductDocument>>;
    findOne(id: string): import("mongoose").Query<import("mongoose").Document<unknown, any, Product> & Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }, import("mongoose").Document<unknown, any, Product> & Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }, {}, import("mongoose").Document<unknown, any, Product> & Product & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: string, dto: UpdateProductDto): Promise<import("mongoose").Document<unknown, any, Product> & Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    remove(id: string): Promise<import("mongoose").Document<unknown, any, Product> & Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getProductsNeedToBeSynced(): Promise<Array<ProductDocument>>;
    findProductByChargifyId(chargifyComponentId: string, type?: ProductType): Promise<ProductDocument>;
    find(filter: FilterQuery<ProductDocument>, options?: QueryOptions): Promise<ProductDocument>;
    findProductByStripeId(stripeId: string): Promise<ProductDocument>;
}
