import { ObjectId } from 'mongoose';
export declare class CustomerTemplate {
    id: ObjectId;
    templateId: number;
    name: string;
    subject: string;
    content: string;
    bodyContent?: string;
    templateTitle?: string;
    imageUrl?: string;
}
