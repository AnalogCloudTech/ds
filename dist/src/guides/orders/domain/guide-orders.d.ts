import { ObjectId } from 'mongoose';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
export declare class FrontCover {
    image: string;
    name: string;
    title: string;
}
export declare class Address {
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    email?: string;
    firstName?: string;
    lastName?: string;
}
export declare enum OrderStatus {
    Pending = "pending",
    Completed = "completed",
    Cancelled = "cancelled",
    Shipped = "shipped"
}
export declare class GuideOrders {
    customer: ObjectId | CustomerDocument;
    frontCover: FrontCover;
    practiceName: string;
    practiceAddress: Address;
    practicePhone: string;
    practiceLogo: string;
    practiceWebsite?: string;
    practiceEmail?: string;
    quantity: number;
    thumbnail: string;
    guideName: string;
    guideId?: string;
    status?: string;
    landingPage?: string;
    readPage?: string;
    shippingAddress: Address;
}
