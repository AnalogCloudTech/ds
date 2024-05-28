import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Subscription } from '@/payments/chargify/domain/types';
import { weekday } from '@/integrations/afy-logger/consts';
import { v4 as uuidv4 } from 'uuid';

export const trialConversionEvents = {
  BECOME_MEMBER: 'become-member',
  NEW_TRIAL: 'new-trial',
} as const;

export type TrialConversionEvents =
  (typeof trialConversionEvents)[keyof typeof trialConversionEvents];

export interface LogInput {
  customer: {
    email: string;
    name: string;
  };
  source: string;
  event: {
    name: string;
    namespace: string;
  };
  trace: string;
  tags?: string[];
}

@Injectable()
export default class AfyLoggerService {
  constructor(private readonly http: HttpService) {}

  async sendLog(data: LogInput) {
    try {
      await this.http.axiosRef.post('/loggers', data);
    } catch (err) {
      console.log('Error sending log to Afy-Logger', err);
    }
  }

  async sendLogTrialConversion(
    subscription: Subscription,
    eventName: TrialConversionEvents,
  ) {
    await this.sendLog({
      customer: {
        name: `${subscription.customer.first_name} ${subscription.customer.last_name}`.trim(),
        email: subscription.customer.email,
      },
      source: 'digital-services',
      event: {
        namespace: 'trial-conversion',
        name: eventName,
      },
      tags: [
        `day:${weekday[new Date().getDay()]}`,
        `subscription:${subscription.product.name}`,
      ],
      trace: uuidv4(),
    });
  }
}
