import { Logger, Module } from '@nestjs/common';
import { SnsService } from './sns.service';
import { ConfigService } from '@nestjs/config';
import { SNS } from 'aws-sdk';
import { IamModule } from '@/internal/libs/aws/iam/iam.module';
import { SnsProviderName } from '@/internal/libs/aws/sns/contants';

@Module({
  imports: [IamModule],
  providers: [
    SnsService,
    Logger,
    {
      inject: [ConfigService],
      provide: SnsProviderName,
      useFactory: (configService: ConfigService): SNS => {
        return new SNS({
          region: configService.get('aws.region'),
          credentials: {
            accessKeyId: configService.get('aws.accessKeyId'),
            secretAccessKey: configService.get('aws.secretAccessKey'),
          },
        });
      },
    },
  ],
  exports: [SnsService, SnsProviderName, IamModule],
})
export class SnsModule {}
