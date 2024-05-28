/// <reference types="node" />
import { S3 } from 'aws-sdk';
export declare class FileUploadService {
    private readonly bucketName;
    constructor(bucketName: string);
    uploadPublicFile(dataBuffer: Buffer, mimeType: string): Promise<S3.ManagedUpload.SendData>;
}
