import { CreateUploadDto } from './dto/create-upload.dto';
import { UploadsRepository } from '@/uploads/uploads.repository';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
export declare class UploadsService {
    private readonly uploadRepository;
    constructor(uploadRepository: UploadsRepository);
    create(customer: CustomerDocument, createUploadDto: CreateUploadDto, uploadUrl: string): Promise<import("./schemas/upload.schema").Upload & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>;
    findAll(customer: CustomerDocument): Promise<(import("./schemas/upload.schema").Upload & import("mongoose").Document<any, any, any> & {
        _id: any;
    })[]>;
    findOne(customer: CustomerDocument, uploadId: string): Promise<import("./schemas/upload.schema").Upload & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>;
}
