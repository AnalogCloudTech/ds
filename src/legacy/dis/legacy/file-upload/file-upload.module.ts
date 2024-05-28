import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Module({
  providers: [
    FileUploadService,
    {
      provide: 'BUCKET_NAME',
      useFactory: (configService: ConfigService) => {
        return configService.get('aws.publicBucketName');
      },
      inject: [ConfigService],
    },
    {
      provide: 'S3',
      useClass: S3,
    },
  ],
  controllers: [FileUploadController],
})
export class FileUploadModule {}
