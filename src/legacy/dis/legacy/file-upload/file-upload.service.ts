import { Inject, Injectable } from '@nestjs/common';
import { Uuid4 } from 'id128';
import { S3 } from 'aws-sdk';
import { getExtensionFromMimeType } from '@/legacy/dis/legacy/common/utils';

@Injectable()
export class FileUploadService {
  constructor(
    @Inject('BUCKET_NAME')
    private readonly bucketName: string,
  ) {}

  async uploadPublicFile(dataBuffer: Buffer, mimeType: string) {
    const s3 = new S3();
    return await s3
      .upload({
        Bucket: this.bucketName,
        Body: dataBuffer,
        Key: `${Uuid4.generate().toCanonical()}.${getExtensionFromMimeType(
          mimeType,
        )}`,
        ACL: 'public-read',
      })
      .promise();
  }
}
