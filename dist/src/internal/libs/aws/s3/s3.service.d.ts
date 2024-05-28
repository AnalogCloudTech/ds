/// <reference types="node" />
import { AWSError, S3 } from 'aws-sdk';
import { UploadParams, UploadParamsWCustomer, UploadStreamParams } from '@/internal/libs/aws/s3/domain/types';
import { PassThrough } from 'stream';
import { DeleteObjectsOutput } from 'aws-sdk/clients/s3';
export declare class S3Service {
    protected readonly s3: S3;
    constructor(s3: S3);
    preSignedDownload(bucketName: string, key: string, expiration?: number): string;
    preSignedUpload({ bucket, path, ext, contentType, expiration, }: UploadParams): string;
    uploadStream({ bucket, fullPath, contentType, stream, }: UploadStreamParams & {
        stream: PassThrough;
    }): Promise<string>;
    uploadCsv(path: string, data: object[], bucket: string): Promise<string>;
    private createCsvStream;
    preSignedUploadWithCustomer({ path, customer, ...rest }: UploadParamsWCustomer): string;
    private sanitizePath;
    deleteS3Object(bucketName: string, keyData: {
        Key: string;
    }[]): Promise<DeleteObjectsOutput | AWSError>;
}
