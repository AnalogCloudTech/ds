import { Email } from '@/onboard/email-reminders/domain/types';

/**
 * @deprecated
 */
export class EmailReminder {
  subject: string;
  customerName: string;
  customerEmail: string;
  coachName: string;
  coachEmail: string;
  zoomLink: string;
  emailList: Email[];
  dateTime: string;
}
