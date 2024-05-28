import { HydratedDocument } from 'mongoose';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { FrontCover, Address } from '@/guides/orders/domain/guide-orders';
import { SchemaId } from '@/internal/types/helpers';
export declare class GuideOrders {
    customer: SchemaId | CustomerDocument;
    frontCover: FrontCover[];
    orderId: string;
    practiceName: string;
    practiceAddress: Address;
    practicePhone: string;
    practiceEmail?: string;
    practiceLogo: string;
    practiceWebsite?: string;
    quantity: number;
    guideName: string;
    guideId?: string;
    thumbnail: string;
    landingPage?: string;
    readPage?: string;
    status?: string;
    shippingAddress: Address;
}
export type GuideOrderDocument = HydratedDocument<GuideOrders>;
export declare const GuideOrdersSchema: import("mongoose").Schema<GuideOrders, import("mongoose").Model<GuideOrders, any, any, any>, any, any>;
