import { ClientKafka } from '@nestjs/microservices';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { EmailsMetricsDto } from '@/integrations/afy-notifications/dto/emails-metrics.dto';
import { LoggerPayload } from '@/internal/utils/logger';
import { DateTime } from 'luxon';
import { CONTEXT_AFY_NOTIFICATIONS } from '@/internal/common/contexts';
import { CheckStatusOfEmailMessageException } from '@/integrations/afy-notifications/exceptions/check-status-of-email-message.exception';

const AFY_NOTIFICATIONS_TOPICS = {
  REGISTER_RECEIVERS: 'notifications.emails.email-address.create',
  CREATE_EMAIL_MESSAGE: 'notifications.emails.email-message.create',
  EMAIL_METRICS: 'notifications.events.metrics',
  STATUS: 'notifications.emails.email-message.status',
  COUNT_BY_EMAIL: 'notifications.emails.email-message.count-by-email',
};

export interface EmailMessage {
  from: string;
  to: string;
  subject: string;
  html: string;
  provider: string;
}

@Injectable()
export class AfyNotificationsService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly clientKafka: ClientKafka,
    private readonly logger: Logger,
  ) {}

  async onModuleInit() {
    [
      AFY_NOTIFICATIONS_TOPICS.CREATE_EMAIL_MESSAGE,
      AFY_NOTIFICATIONS_TOPICS.EMAIL_METRICS,
      AFY_NOTIFICATIONS_TOPICS.STATUS,
      AFY_NOTIFICATIONS_TOPICS.COUNT_BY_EMAIL,
    ].forEach((topic) => {
      this.clientKafka.subscribeToResponseOf(topic);
    });

    await this.clientKafka.connect();
  }

  public async sendEmail(
    emailMessages: EmailMessage[],
  ): Promise<Array<string>> {
    const promises = emailMessages.map(async (data) => {
      return lastValueFrom(
        this.clientKafka.send<string>(
          AFY_NOTIFICATIONS_TOPICS.CREATE_EMAIL_MESSAGE,
          data,
        ),
      );
    });

    return Promise.all<string>(promises);
  }

  public async getEmailMetrics(
    ids: string[],
    start: string,
    end: string,
  ): Promise<EmailsMetricsDto> {
    return lastValueFrom(
      this.clientKafka.send(AFY_NOTIFICATIONS_TOPICS.EMAIL_METRICS, {
        ids,
        start,
        end,
      }),
    );
  }

  public async checkStatusOf(
    messageIds: Array<string>,
    mode = 'any',
  ): Promise<boolean> {
    try {
      return lastValueFrom<boolean>(
        this.clientKafka.send(AFY_NOTIFICATIONS_TOPICS.STATUS, {
          ids: messageIds,
          mode,
        }),
      );
    } catch (error) {
      if (error instanceof Error) {
        const { name, stack, message } = error;
        this.logger.error(
          {
            payload: <LoggerPayload>{
              usageDate: DateTime.now(),
              name,
              stack,
              message,
            },
          },
          stack,
          CONTEXT_AFY_NOTIFICATIONS,
        );
      }

      throw new CheckStatusOfEmailMessageException();
    }
  }

  public async countEmailsBySender(sender: string) {
    try {
      return await lastValueFrom<number>(
        this.clientKafka.send(AFY_NOTIFICATIONS_TOPICS.COUNT_BY_EMAIL, {
          sender,
        }),
      );
    } catch (err) {
      if (err instanceof Error) {
        const { name, stack, message } = err;
        this.logger.error(
          {
            payload: <LoggerPayload>{
              usageDate: DateTime.now(),
              name,
              stack,
              message,
            },
          },
          stack,
          CONTEXT_AFY_NOTIFICATIONS,
        );
      }
    }
  }
}
