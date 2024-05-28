export enum Status {
  SCHEDULED = 'scheduled',
  SENT = 'sent',
  RESCHEDULED = 'rescheduled',
  CANCELED = 'canceled',
  ERROR = 'error',
}

/**
 * time in minutes
 */

export enum ReminderDelays {
  CONFIRMATION = -1,
  IMMEDIATE = 0,
  FIFTEEN_MINUTES = 15,
  ONE_HOUR = 60,
  FOUR_HOURS = 60 * 4,
}

/**
 * @deprecated
 */
export class Email {
  customerEmail: string;
}
