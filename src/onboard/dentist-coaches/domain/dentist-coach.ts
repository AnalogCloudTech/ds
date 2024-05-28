import { Expose } from 'class-transformer';
import { CoachId } from './types';

export class DentistCoachDomain {
  @Expose()
  id: CoachId;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  hubspotId: string;

  @Expose()
  meetingLink: string;

  @Expose()
  calendarId: string;

  @Expose()
  image: string;

  @Expose()
  enabled: boolean;

  @Expose()
  schedulingPoints: number;
}
