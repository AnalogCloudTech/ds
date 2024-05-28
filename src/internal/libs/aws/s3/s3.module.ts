import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { IamModule } from '@/internal/libs/aws/iam/iam.module';
import { S3ProviderName } from '@/internal/libs/aws/s3/constants';
import { S3Service } from '@/internal/libs/aws/s3/s3.service';

@Module({
  imports: [IamModule],
  providers: [
    S3Service,
    Logger,
    {
      inject: [ConfigService],
      provide: S3ProviderName,
      useFactory: (configService: ConfigService): S3 => {
        return new S3({
          region: configService.get('aws.region'),
          credentials: {
            accessKeyId: configService.get('aws.accessKeyId'),
            secretAccessKey: configService.get('aws.secretAccessKey'),
          },
        });
      },
    },
  ],
  exports: [S3Service, S3ProviderName, IamModule],
})
export class S3Module {}
