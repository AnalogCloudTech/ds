import { HydratedDocument } from 'mongoose';
import { CastableTo } from '@/internal/common/utils';
import { HubspotPriceProperty, HubspotProductProperty, Type } from '../domain/types';
import { Product as DomainProduct } from '../domain/product';
export declare class Product extends CastableTo<DomainProduct> {
    title: string;
    stripeId: string;
    type: Type;
    value: number;
    chargifyComponentId: string;
    chargifyProductHandle: string;
    chargifyProductPriceHandle: string;
    price: string;
    product: string;
    productProperty: HubspotProductProperty;
    priceProperty: HubspotPriceProperty;
    creditsOnce: number;
    toShowBuyCredits: boolean;
    creditsRecur: number;
    bookPackages: string;
    productWithoutTrial: boolean;
    hubspotListId: number;
    upgradeDowngrade: boolean;
}
export type ProductDocument = HydratedDocument<Product>;
export declare const ProductSchema: import("mongoose").Schema<Product, import("mongoose").Model<Product, any, any, any>, any, any>;
