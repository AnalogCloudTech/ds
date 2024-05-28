import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IamProviderName } from '@/internal/libs/aws/iam/constants';
import { IAM } from 'aws-sdk';
import { IamService } from '@/internal/libs/aws/iam/iam.service';

@Module({
  providers: [
    IamService,
    {
      inject: [ConfigService],
      provide: IamProviderName,
      useFactory: (configService: ConfigService): IAM => {
        return new IAM({
          region: configService.get('aws.region'),
          credentials: {
            accessKeyId: configService.get('aws.accessKeyId'),
            secretAccessKey: configService.get('aws.secretAccessKey'),
          },
        });
      },
    },
  ],
  exports: [IamService, IamProviderName],
})
export class IamModule {}
