import { HttpException, HttpStatus } from '@nestjs/common';
import { DateTime, DurationUnits } from 'luxon';

export enum TimeZones {
  UTC = 'UTC',
  EST = 'EST',
}

/**
 * Change a DateTime Object to another timezone
 *
 * Defaults to UTC
 *
 * @example
 * toTimeZone(date, 'EST')
 */
export const toTimeZone = (dateTime: DateTime, zone: TimeZones): DateTime => {
  return dateTime.setZone(zone || 'UTC');
};

/**
 * Change a date number in seconds format to ISO format (UTC).
 *
 * @example
 * toISO(1644513962) => "2022-02-10T17:26:02.000+00:00"
 * @example
 * toISO(undefined) => null
 */

export const toISO = (seconds) => {
  if (!seconds) {
    return null;
  }
  const date = DateTime.fromSeconds(seconds);

  return date.toISO();
};

/**
 * Change a date string to human readable format (american). As well as changing the timezone
 *
 * Defaults to UTC
 *
 * @example
 * timeStampToHumanReadable('2021-12-29T19:18:18Z', 'UTC', 'EST')
 */
export const timeStampToHumanReadable = (
  date: string,
  toZone = TimeZones.UTC,
  fromZone = TimeZones.UTC,
): string => {
  const dateTime = DateTime.fromISO(date, { zone: fromZone });
  const toTimeZoneObject = toTimeZone(dateTime, toZone);
  return toTimeZoneObject
    .setLocale('en-us')
    .toLocaleString(DateTime.DATETIME_FULL);
};

/**
 * takes an epoch time number in seconds and returns the time that elapsed since then depending on the provided value
 * defaults to seconds.
 * @example
 * minutesElapsed(1644513962, 'minutes'): number
 */
export const timeElapsed = (epoch, type = 'seconds') => {
  const unit = type as DurationUnits;
  const now = DateTime.now();
  const date = DateTime.fromSeconds(epoch);
  const diff = now.diff(date, unit).toObject();
  return diff[type];
};

/**
 * Return date in epoch seconds format
 */
export const nowEpoch = () => {
  return Math.floor(Date.now() / 1000);
};

/**
 * takes a date in ISO format and return the seconds since epoch as a number
 * @example
 * isoToEpoch('2022-02-10T17:26:02.000Z') => 1644513962
 */
export const isoToEpoch = (iso: string) => {
  const date = DateTime.fromISO(iso);
  if (!date.isValid) {
    throw new HttpException(
      {
        message:
          date?.invalidExplanation || 'Failed to parse the provided date',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
  return date.toSeconds();
};

export function epochToHSDate(epoch) {
  const date = new Date(0);
  date.setUTCSeconds(epoch);

  return DateTime.fromJSDate(date).toFormat('yyyy-LL-dd');
}

export function dateStringToHSDate(dateString: string): string {
  const date = new Date(dateString);

  return DateTime.fromJSDate(date).toFormat('yyyy-LL-dd');
}

export function convertToHSDate(dateString: string): string {
  const newDateFormat = dateString.substring(0, 10);
  return DateTime.fromISO(newDateFormat).toFormat('yyyy-LL-dd');
}

export function getDifferenceInDays(endDate: string) {
  const today = DateTime.now();
  const endDateObj = DateTime.fromISO(endDate);
  const diff = endDateObj.diff(today, 'days').toObject();
  return Math.abs(diff.days);
}

export function compareChargifyDates(
  firstDate: string,
  secondDate: string,
): boolean {
  if (!firstDate || !secondDate) return false;
  const date1 = DateTime.fromISO(firstDate.substring(0, 10));
  const date2 = DateTime.fromISO(secondDate.substring(0, 10));

  return date1.valueOf() === date2.valueOf();
}

export function isInDaylightSaving(
  year: number,
  startDate: DateTime,
  endDate: DateTime,
): boolean {
  const startDST = DateTime.fromISO(`${year}-03-12T02:00:00-0500`);
  const endDST = DateTime.fromISO(`${year}-11-05T02:00:00-0500`);

  return startDate < endDST && startDST < endDate;
}

// if we are before with daylight saving and try to schedule a meeting after daylight saving
// subtract one hour
export function fixDateInDaylightSaving(
  startDate: DateTime,
  endDate: DateTime,
): { startDate: DateTime; endDate: DateTime } {
  const startToday = DateTime.now().startOf('day');
  const endToday = startToday.endOf('day');

  if (
    startToday < endDate &&
    !isInDaylightSaving(startToday.year, startToday, endToday) &&
    isInDaylightSaving(startDate.year, startDate, endDate)
  ) {
    startDate = startDate.minus({ hour: 1 });
    endDate = endDate.minus({ hour: 1 });
  }

  return {
    startDate,
    endDate,
  };
}
