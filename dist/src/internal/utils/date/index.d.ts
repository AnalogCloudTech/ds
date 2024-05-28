import { DateTime } from 'luxon';
export declare enum WeekDays {
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6,
    SUNDAY = 7
}
export declare enum Months {
    january = "JAN",
    february = "FEB",
    march = "MAR",
    april = "APR",
    may = "MAY",
    june = "JUN",
    july = "JUL",
    august = "AUG",
    september = "SEP",
    october = "OCT",
    november = "NOV",
    december = "DEC"
}
export declare enum MonthsNumber {
    JAN = 1,
    FEB = 2,
    MAR = 3,
    APR = 4,
    MAY = 5,
    JUN = 6,
    JUL = 7,
    AUG = 8,
    SEP = 9,
    OCT = 10,
    NOV = 11,
    DEC = 12
}
export type MonthsType = keyof typeof MonthsNumber;
export declare function isWeekend(date: DateTime): boolean;
export declare function isWeekDay(date: DateTime): boolean;
export declare function diffInDaysFromToday(date: Date): number;
export declare enum MonthsLong {
    jan = "january",
    feb = "february",
    mar = "march",
    apr = "april",
    may = "may",
    jun = "june",
    jul = "july",
    aug = "august",
    sep = "september",
    oct = "october",
    nov = "november",
    dec = "december"
}
