export declare enum Status {
    SCHEDULED = "scheduled",
    SENT = "sent",
    RESCHEDULED = "rescheduled",
    CANCELED = "canceled",
    ERROR = "error"
}
export declare enum ReminderDelays {
    CONFIRMATION = -1,
    IMMEDIATE = 0,
    FIFTEEN_MINUTES = 15,
    ONE_HOUR = 60,
    FOUR_HOURS = 240
}
export declare class Email {
    customerEmail: string;
}
