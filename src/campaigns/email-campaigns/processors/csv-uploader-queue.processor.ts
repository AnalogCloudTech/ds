import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CSV_UPLOADER_QUEUE } from '@/campaigns/email-campaigns/constants';
import { sleep } from '@/internal/utils/functions';
import { S3Service } from '@/internal/libs/aws/s3/s3.service';
import { CSVUploaderJob } from '@/campaigns/email-campaigns/campaigns/domain/types';
import { buildTemplateName } from '@/internal/libs/aws/ses/constants';
import { ConfigService } from '@nestjs/config';
import { SesService } from '@/internal/libs/aws/ses/ses.service';
import { get } from 'lodash';
import { replaceTags } from '@/internal/utils/aws/ses/replaceTags';
import { SendEmailRequest } from 'aws-sdk/clients/ses';
import { capitalizeFirstLetter } from '@/internal/utils/string';

/**
 * This processor is responsible for uploading CSV files to S3 and sending links to customers via email
 *
 * @disclaimer This processor uses sleep function so CMS server don't get overwhelmed with requests
 */
@Processor(CSV_UPLOADER_QUEUE)
export class CsvUploaderQueueProcessor {
  constructor(
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
    private readonly sesService: SesService,
  ) {}

  @Process({ concurrency: 1 })
  async handleJob(job: Job<CSVUploaderJob>) {
    try {
      const formattedData = job.data.formattedData;
      const customer = job.data.customer;
      const recipientEmail = job.data.email || customer.email;
      const bucket = job.data.bucket;

      const linksPromise = formattedData.map(async (data) => {
        const path = `csv`;
        if (data.data.length === 0) return '';
        await sleep(5000);
        return await this.s3Service.uploadCsv(path, data.data, bucket);
      });

      const links = await Promise.all(linksPromise);
      const download_links = links
        .filter((link) => link !== '')
        .map(
          (link, index) =>
            `<p><a href='${link}' style='color: #1890FF; text-decoration: none;'>CSV File ${
              index + 1
            }</a></p>`,
        )
        .join('');

      const templateName = buildTemplateName(
        this.configService.get('csvExportTemplate.templateId'),
      );

      const noreplyEmail: string = this.configService.get(
        'aws.ses.noreplyEmail',
      );

      const templateData = await this.sesService.getTemplateData(templateName);
      const body = get(templateData, ['Template', 'HtmlPart']);
      const bodyReplaced = replaceTags(body, {
        '{{CUSTOMER_NAME}}': capitalizeFirstLetter(customer.firstName),
        '{{DOWNLOAD_LINKS}}': download_links,
      });

      const params: SendEmailRequest = {
        Source: noreplyEmail,
        Destination: {
          ToAddresses: [recipientEmail],
        },
        Message: {
          Body: {
            Html: {
              Data: bodyReplaced,
            },
          },
          Subject: {
            Data: 'Your campaign data is ready for download',
          },
        },
        ConfigurationSetName: this.configService.get('aws.ses.config.default'),
      };

      await this.sesService.sendSingleEmail(params);

      await sleep(15000);
    } catch (error) {
      throw new Error(
        "Couldn't upload CSV files to S3 and send emails to customers: " +
          error,
      );
    }
  }
}
