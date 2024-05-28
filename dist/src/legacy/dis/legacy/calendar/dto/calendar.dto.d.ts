import { DateTime } from 'luxon';
import { Coach } from '@/onboard/domain/coach';
export declare class BusySlot {
    meetingStart: string;
    meetingEnd: string;
}
export declare class CalendarDto {
    email: string;
    calendarDateStart: string;
    calendarDateEnd: string;
    BusySlots: BusySlot[];
    freeTimeSlots?: Array<DaySlots>;
    outputTimezone?: string;
}
export declare class CalendarDtoWithCoach extends CalendarDto {
    coach: Coach;
}
export declare class GetBusySlotsDTO {
    email: string;
    date: string;
    outputTimezone: string;
}
export declare class DaySlots {
    day: string;
    slots: Array<DateTime>;
}
