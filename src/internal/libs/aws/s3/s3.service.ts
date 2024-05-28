import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AWSError, S3 } from 'aws-sdk';
import {
  FIFTEEN_MINUTES_IN_SECONDS,
  S3ProviderName,
} from '@/internal/libs/aws/s3/constants';
import {
  UploadParams,
  UploadParamsWCustomer,
  UploadStreamParams,
} from '@/internal/libs/aws/s3/domain/types';
import { v4 as uuid } from 'uuid';
import { PassThrough } from 'stream';
import * as csv from 'fast-csv';
import { DeleteObjectsOutput } from 'aws-sdk/clients/s3';

@Injectable()
export class S3Service {
  constructor(@Inject(S3ProviderName) protected readonly s3: S3) {}

  public preSignedDownload(
    bucketName: string,
    key: string,
    expiration = FIFTEEN_MINUTES_IN_SECONDS,
  ) {
    return this.s3.getSignedUrl('getObject', {
      Bucket: bucketName,
      Key: key,
      Expires: expiration,
    });
  }

  public preSignedUpload({
    bucket,
    path,
    ext,
    contentType,
    expiration = FIFTEEN_MINUTES_IN_SECONDS,
  }: UploadParams) {
    const fullPath = this.sanitizePath(path, ext);

    return this.s3.getSignedUrl('putObject', {
      Bucket: bucket,
      Key: fullPath,
      Expires: expiration,
      ContentType: contentType,
    });
  }

  public async uploadStream({
    bucket,
    fullPath,
    contentType,
    stream,
  }: UploadStreamParams & { stream: PassThrough }) {
    const uploadParams = {
      Bucket: bucket,
      Key: fullPath,
      ContentType: contentType,
      Body: stream,
    };

    const response = await this.s3.upload(uploadParams).promise();
    return response.Location;
  }

  public async uploadCsv(
    path: string,
    data: object[],
    bucket: string,
  ): Promise<string> {
    const csvStream = this.createCsvStream(data);
    const fullPath = this.sanitizePath(path, 'csv');
    await this.uploadStream({
      bucket,
      fullPath,
      contentType: 'text/csv',
      stream: csvStream,
    });
    return this.preSignedDownload(bucket, fullPath);
  }

  private createCsvStream(data: object[]): PassThrough {
    const csvStream = new PassThrough();
    csv.writeToStream(csvStream, data, {
      headers: true,
      delimiter: ',',
      quote: '"',
      escape: '"',
      includeEndRowDelimiter: true,
    });

    return csvStream;
  }

  public preSignedUploadWithCustomer({
    path,
    customer,
    ...rest
  }: UploadParamsWCustomer) {
    const newPath = `${customer._id.toString()}/${path}`;

    return this.preSignedUpload({
      path: newPath,
      ...rest,
    });
  }

  private sanitizePath(path: string, ext: string) {
    const key = uuid();

    let fullPath = [];

    if (path) {
      fullPath = path.split('/');
    }

    if (!key) {
      throw new HttpException(
        { message: 'missing file key' },
        HttpStatus.BAD_REQUEST,
      );
    }

    fullPath.push(`${key}.${ext}`);

    return fullPath.join('/');
  }
  private partitionArray<T>(arr: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, index) =>
      arr.slice(index * size, index * size + size),
    );
  }
  public async deleteS3Object(
    bucketName: string,
    keys: { Key: string }[],
  ): Promise<DeleteObjectsOutput | AWSError> {
    const batchSize = 1000; // Maximum number of objects to delete in a single batch
    if (keys?.length > batchSize) {
      const partitions = this.partitionArray(keys, batchSize);
      for (const partition of partitions) {
        const deleteParams = {
          Bucket: bucketName,
          Delete: {
            Objects: partition.map((item) => ({ Key: item.Key })),
            Quiet: false,
          },
        };
        return this.s3.deleteObjects(deleteParams).promise();
      }
    } else {
      const deleteParams = {
        Bucket: bucketName,
        Delete: {
          Objects: keys.map((item) => ({ Key: item.Key })),
          Quiet: false,
        },
      };
      return this.s3.deleteObjects(deleteParams).promise();
    }
  }
}
