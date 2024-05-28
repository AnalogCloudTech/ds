import { Auth as GoogleAuth, calendar_v3 } from 'googleapis';
import { CreateMeetingDto } from '@/legacy/dis/legacy/calendar/dto/createMeetting.dto';
import AfyLoggerService from '@/integrations/afy-logger/afy-logger.service';
export declare class GoogleService {
    private readonly googleCalendar;
    private readonly googleAuthInput;
    private readonly afyLoggerService;
    private googleAuth;
    constructor(googleCalendar: calendar_v3.Calendar, googleAuthInput: GoogleAuth.JWTInput, afyLoggerService: AfyLoggerService);
    getBusySlots(calendarEmail: string, startDate: string, endDate: string): Promise<calendar_v3.Schema$TimePeriod[]>;
    insertEvent(eventData: CreateMeetingDto): Promise<import("gaxios").GaxiosResponse<calendar_v3.Schema$Event>>;
    private getCalendarEvents;
}
