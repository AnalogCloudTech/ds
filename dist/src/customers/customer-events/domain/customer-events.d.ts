import { ObjectId } from 'mongoose';
import { Events } from '@/customers/customer-events/domain/types';
export declare class CustomerEvents {
    id: string;
    customer: ObjectId;
    event: Events;
    metadata: object;
    createdAt: Date;
}
