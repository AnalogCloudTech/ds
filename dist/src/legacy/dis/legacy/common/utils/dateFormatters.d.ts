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
