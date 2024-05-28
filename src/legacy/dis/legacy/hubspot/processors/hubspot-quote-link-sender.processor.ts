import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { HUBSPOT_QUOTE_LINK_SENDER_QUEUE } from '@/legacy/dis/legacy/hubspot/constants';
import { Job } from 'bull';
import { isEmpty } from 'lodash';
import { LoggerPayload } from '@/internal/utils/logger';
import { DateTime } from 'luxon';
import { CONTEXT_SEND_QUOTE_LINK_PROCESSOR } from '@/internal/common/contexts';
import { Logger } from '@nestjs/common';
import { QuotesQueueJob } from '@/legacy/dis/legacy/hubspot/domain/types';
import { buildTemplateName } from '@/internal/libs/aws/ses/constants';
import { replaceTags } from '@/internal/utils/aws/ses/replaceTags';
import { ConfigService } from '@nestjs/config';
import { SesService } from '@/internal/libs/aws/ses/ses.service';
import { SendEmailRequest } from 'aws-sdk/clients/ses';

@Processor(HUBSPOT_QUOTE_LINK_SENDER_QUEUE)
export class HubspotQuoteLinkSenderProcessor {
  private readonly logger: Logger;
  constructor(
    private readonly configService: ConfigService,
    private readonly sesService: SesService,
  ) {
    this.logger = new Logger(HubspotQuoteLinkSenderProcessor.name);
  }

  @Process({ concurrency: 1 })
  async handleJob(job: Job<QuotesQueueJob>) {
    try {
      const quoteLink = job.data.quoteLink;
      const email = job.data.email;

      if (isEmpty(quoteLink) || !email) {
        this.logger.log(
          {
            payload: <LoggerPayload>{
              usageDate: DateTime.now(),
              method: 'UpsellReportQueueProcessor.handleJob',
              message: `formattedData or recipientEmail is missing`,
            },
          },
          CONTEXT_SEND_QUOTE_LINK_PROCESSOR,
        );
      }

      const templateName = buildTemplateName(
        this.configService.get<number>('hubspotQuoteTemplate.templateId'),
      );

      const noreplyEmail = this.configService.get<string>(
        'aws.ses.noreplyEmail',
      );

      const templateData = await this.sesService.getTemplateData(templateName);
      const body = templateData.Template.HtmlPart;
      const bodyReplaced = replaceTags(body, {
        '{{QUOTE_LINK}}': quoteLink,
      });

      const params: SendEmailRequest = {
        Source: noreplyEmail,
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Body: {
            Html: {
              Data: bodyReplaced,
            },
          },
          Subject: {
            Data: 'Your Plan Contract is Ready',
          },
        },
        ConfigurationSetName: this.configService.get('aws.ses.config.default'),
      };

      await this.sesService.sendSingleEmail(params);
    } catch (error) {
      this.logger.error(
        {
          payload: <LoggerPayload>{
            usageDate: DateTime.now(),
            message: `Couldn't not send quote link to user:  ${error}`,
          },
        },
        CONTEXT_SEND_QUOTE_LINK_PROCESSOR,
      );
    }
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(
      {
        payload: <LoggerPayload>{
          usageDate: DateTime.now(),
          method: 'HubspotQuoteLinkSenderProcessor.onFailed',
          message: error,
        },
      },
      CONTEXT_SEND_QUOTE_LINK_PROCESSOR,
    );
  }
}
