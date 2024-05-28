import { CoachImageUrl } from '@/onboard/domain/types';
import { CalendarId, HubspotId } from '../domain/types';
export declare class UpdateCoachDto {
    name: string;
    email: string;
    hubspotId: HubspotId;
    image: CoachImageUrl;
    calendarId: CalendarId;
    enabled?: boolean;
    schedulingPoints?: number;
}
