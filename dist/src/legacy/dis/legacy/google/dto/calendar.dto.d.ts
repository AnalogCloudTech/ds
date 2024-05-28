export declare class BusySlot {
    meetingStart: string;
    meetingEnd: string;
    timeZone: string;
}
export declare class CalendarDto {
    email: string;
    calendarDate: Date;
    BusySlots: BusySlot[];
}
