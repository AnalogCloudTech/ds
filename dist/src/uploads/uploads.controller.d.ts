import { UploadsService } from './uploads.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { S3Service } from '@/internal/libs/aws/s3/s3.service';
export declare class UploadsController {
    private readonly uploadsService;
    private readonly s3Service;
    constructor(uploadsService: UploadsService, s3Service: S3Service);
    create(customer: CustomerDocument, createUploadDto: CreateUploadDto): Promise<import("./schemas/upload.schema").Upload & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>;
    findOne(customer: CustomerDocument, id: string): Promise<import("./schemas/upload.schema").Upload & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>;
    findAll(customer: CustomerDocument): Promise<(import("./schemas/upload.schema").Upload & import("mongoose").Document<any, any, any> & {
        _id: any;
    })[]>;
}
