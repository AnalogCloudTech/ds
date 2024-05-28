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
