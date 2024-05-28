import { CalendarId, CoachImageUrl, HubspotId } from '../domain/types';
export declare class CreateCoachDto {
    name: string;
    email: string;
    hubspotId: HubspotId;
    image: CoachImageUrl;
    calendarId: CalendarId;
    enabled: boolean;
}
