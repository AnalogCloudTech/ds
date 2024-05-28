import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { Model } from 'mongoose';
import { Upload, UploadDocument } from '@/uploads/schemas/upload.schema';
import { CreateUploadDto } from '@/uploads/dto/create-upload.store.dto';
export declare class UploadsRepository {
    private readonly uploadModel;
    constructor(uploadModel: Model<UploadDocument>);
    create(customer: CustomerDocument, createUploadDto: CreateUploadDto): Promise<Upload & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>;
    findAll(customer: CustomerDocument): Promise<(Upload & import("mongoose").Document<any, any, any> & {
        _id: any;
    })[]>;
    findOne(uploadId: string, customer: CustomerDocument): Promise<Upload & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>;
}
