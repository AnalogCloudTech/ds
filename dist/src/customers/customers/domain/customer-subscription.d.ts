import { ObjectId } from 'mongoose';
export declare class CustomerSubscription {
    id: ObjectId;
    customer: ObjectId;
    createdAt: Date;
}
