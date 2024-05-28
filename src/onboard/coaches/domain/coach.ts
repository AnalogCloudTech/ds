import { Expose } from 'class-transformer';
import { CalendarId, CoachId, HubspotId, CoachImageUrl } from './types';

export class CoachDomain {
  @Expose()
  id: CoachId;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  hubspotId: HubspotId;

  @Expose()
  meetingLink: string;

  @Expose()
  calendarId: CalendarId;

  @Expose()
  image: CoachImageUrl;

  @Expose()
  enabled: boolean;

  @Expose()
  schedulingPoints: number;
}
