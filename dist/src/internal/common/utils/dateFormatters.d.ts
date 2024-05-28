import { DateTime } from 'luxon';
export declare enum TimeZones {
    UTC = "UTC",
    EST = "EST"
}
export declare const toTimeZone: (dateTime: DateTime, zone: TimeZones) => DateTime;
export declare const toISO: (seconds: any) => string;
export declare const timeStampToHumanReadable: (date: string, toZone?: TimeZones, fromZone?: TimeZones) => string;
export declare const timeElapsed: (epoch: any, type?: string) => any;
export declare const nowEpoch: () => number;
export declare const isoToEpoch: (iso: string) => number;
export declare function epochToHSDate(epoch: any): string;
export declare function dateStringToHSDate(dateString: string): string;
export declare function convertToHSDate(dateString: string): string;
export declare function getDifferenceInDays(endDate: string): number;
export declare function compareChargifyDates(firstDate: string, secondDate: string): boolean;
export declare function isInDaylightSaving(year: number, startDate: DateTime, endDate: DateTime): boolean;
export declare function fixDateInDaylightSaving(startDate: DateTime, endDate: DateTime): {
    startDate: DateTime;
    endDate: DateTime;
};
