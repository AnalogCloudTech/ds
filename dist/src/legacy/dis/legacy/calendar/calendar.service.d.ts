import { DateTime } from 'luxon';
import { GoogleService } from '@/legacy/dis/legacy/google/google.service';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { BusySlot, CalendarDto, DaySlots } from './dto/calendar.dto';
import { CreateMeetingDto } from './dto/createMeetting.dto';
export declare class CalendarService {
    private readonly scheduleCoachDuration;
    private hubspotService;
    private googleService;
    constructor(scheduleCoachDuration: number, hubspotService: HubspotService, googleService: GoogleService);
    createMeeting(meetingData: CreateMeetingDto): Promise<import("gaxios").GaxiosResponse<import("googleapis").calendar_v3.Schema$Event>>;
    getBusySlots(email: string, date: string, outputTimezone: string): Promise<CalendarDto>;
    generateSlots(start: DateTime, end: DateTime): Array<DateTime>;
    protected removePastSlots(slots: Array<DateTime>): Array<DateTime>;
    generateFreeTimeSlots(day: DateTime, busySlots: Array<BusySlot>): DaySlots;
}
