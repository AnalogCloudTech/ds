import { Logger, Module } from '@nestjs/common';
import { SesService } from './ses.service';
import { ConfigService } from '@nestjs/config';
import { SES } from 'aws-sdk';
import { SesProviderName } from '@/internal/libs/aws/ses/constants';
import { IamModule } from '@/internal/libs/aws/iam/iam.module';
import { SesCustomVerificationEmailTemplateController } from './ses.custom-verification-email-template.controller';

@Module({
  imports: [IamModule],
  providers: [
    SesService,
    Logger,
    {
      inject: [ConfigService],
      provide: SesProviderName,
      useFactory: (configService: ConfigService): SES => {
        return new SES({
          region: configService.get('aws.region'),
          credentials: {
            accessKeyId: configService.get('aws.accessKeyId'),
            secretAccessKey: configService.get('aws.secretAccessKey'),
          },
        });
      },
    },
  ],
  exports: [SesService, SesProviderName, IamModule],
  controllers: [SesCustomVerificationEmailTemplateController],
})
export class SesModule {}
