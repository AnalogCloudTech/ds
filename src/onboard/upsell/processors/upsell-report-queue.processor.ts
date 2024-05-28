import { UPSELL_REPORT_QUEUE } from '@/onboard/upsell/constant';
import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { S3Service } from '@/internal/libs/aws/s3/s3.service';
import { ConfigService } from '@nestjs/config';
import { SesService } from '@/internal/libs/aws/ses/ses.service';
import { Job } from 'bull';
import { UpsellCSVJob } from '@/onboard/upsell/types/types';
import { isEmpty } from 'lodash';
import { SendEmailRequest } from 'aws-sdk/clients/ses';
import { sleep } from '@/internal/utils/functions';
import { LoggerPayload } from '@/internal/utils/logger';
import { DateTime } from 'luxon';
import { CONTEXT_SEND_UPSELL_REPORT_PROCESSOR } from '@/internal/common/contexts';
import { Logger } from '@nestjs/common';

/**
 * This processor is responsible for uploading Upsell Report CSV files to S3 and sending links to Admin via email
 *
 * @disclaimer This processor uses sleep function so CMS server don't get overwhelmed with requests
 */
@Processor(UPSELL_REPORT_QUEUE)
export class UpsellReportQueueProcessor {
  constructor(
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
    private readonly sesService: SesService,
    private readonly logger: Logger,
  ) {}

  @Process({ concurrency: 1 })
  async handleJob(job: Job<UpsellCSVJob>) {
    try {
      const formattedData = job.data.formattedData;
      const recipientEmail = job.data.email;

      if (isEmpty(formattedData) || !recipientEmail) {
        this.logger.log(
          {
            payload: <LoggerPayload>{
              usageDate: DateTime.now(),
              method: 'UpsellReportQueueProcessor.handleJob',
              message: `formattedData or recipientEmail is missing`,
            },
          },
          CONTEXT_SEND_UPSELL_REPORT_PROCESSOR,
        );
      }

      const link = await this.s3Service.uploadCsv(
        'csv',
        formattedData,
        this.configService.get('aws.reportsBucketName'),
      );

      const htmlLink = `<p>Your Upsell Report is Ready: <a href='${link}' style='color: #1890FF; text-decoration: none;'>DOWNLOAD NOW.</a></p>`;

      const noreplyEmail: string = this.configService.get(
        'aws.ses.noreplyEmail',
      );

      const params: SendEmailRequest = {
        Source: noreplyEmail,
        Destination: {
          ToAddresses: [recipientEmail],
        },
        Message: {
          Body: {
            Html: {
              Data: htmlLink,
            },
          },
          Subject: {
            Data: 'Upsell report data is ready for download',
          },
        },
        ConfigurationSetName: this.configService.get('aws.ses.config.default'),
      };

      await this.sesService.sendSingleEmail(params);

      await sleep(15000);
      return true;
    } catch (error) {
      this.logger.error(
        {
          payload: <LoggerPayload>{
            usageDate: DateTime.now(),
            message: `Couldn't upload CSV files to S3 and send email to admin:  ${error}`,
          },
        },
        CONTEXT_SEND_UPSELL_REPORT_PROCESSOR,
      );
      return false;
    }
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(
      {
        payload: <LoggerPayload>{
          usageDate: DateTime.now(),
          method: 'UpsellReportQueueProcessor.onFailed',
          message: error,
        },
      },
      CONTEXT_SEND_UPSELL_REPORT_PROCESSOR,
    );
  }
}
