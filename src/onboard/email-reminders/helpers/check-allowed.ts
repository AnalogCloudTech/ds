import { EmailReminderDocument } from '@/onboard/email-reminders/schemas/email-reminder.schema';
import { DateTime } from 'luxon';

export function checkAllowedSms(reminder: EmailReminderDocument): boolean {
  const now = reminder.date;
  const currentHour = DateTime.fromJSDate(now).setZone('America/New_York').hour;
  return currentHour >= 9 && currentHour < 18;
}
