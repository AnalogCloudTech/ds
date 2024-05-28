import { CalendarId, CoachId, HubspotId, CoachImageUrl } from './types';
export declare class CoachDomain {
    id: CoachId;
    name: string;
    email: string;
    hubspotId: HubspotId;
    meetingLink: string;
    calendarId: CalendarId;
    image: CoachImageUrl;
    enabled: boolean;
    schedulingPoints: number;
}
