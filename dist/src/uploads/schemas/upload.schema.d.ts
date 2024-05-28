import { Document, ObjectId } from 'mongoose';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
export declare class Upload {
    bucket: string;
    ext: string;
    customer: ObjectId | CustomerDocument;
    downloadUrl: string;
    uploadUrl: string;
    isPrivate: boolean;
    context?: string;
}
export type UploadDocument = Upload & Document;
export declare const UploadSchema: import("mongoose").Schema<Upload, import("mongoose").Model<Upload, any, any, any>, any, any>;
