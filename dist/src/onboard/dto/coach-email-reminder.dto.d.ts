export declare class CoachEmailReminderDto {
    customerEmail: string;
    coachName: string;
    coachEmail: string;
    reminderEmailTime: string;
    meetingDateTIme: string;
    meetingSubject: string;
    meetingMessage: string;
}
export declare class CoachEmailReminderResponseDto {
    emailReminders: CoachEmailReminderDto[];
}
