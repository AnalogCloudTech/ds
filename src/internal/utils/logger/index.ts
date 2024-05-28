import { Logger } from '@nestjs/common';
import { DateTime } from 'luxon';

export class LoggerPayload {
  usageDate: string | DateTime | Date;
  subcontext?: string;
  customer?: {
    email?: string;
    name?: string;
  };
  // just a structure to use latter
  // error?: string;
  // message?: string;
  // stack?: string;
  // method?: string;
  // params?: object;
  [key: string]: any;
}

// TODO: create context constants/enums
export const LoggerWithContext = (context: string) => {
  return {
    provide: 'logger',
    useFactory: () => {
      return new Logger(context);
    },
  };
};
