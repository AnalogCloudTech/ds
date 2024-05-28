import { ObjectId } from 'mongoose';
export declare class EmailHistory {
    id: ObjectId;
    title: string;
    type: string;
    templateName: string;
    status: string;
    createdAt: Date;
}
