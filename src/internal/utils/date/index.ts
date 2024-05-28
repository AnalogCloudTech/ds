import { DateTime } from 'luxon';

export enum WeekDays {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY,
  THURSDAY = 4,
  FRIDAY,
  SATURDAY = 6,
  SUNDAY = 7,
}

export enum Months {
  january = 'JAN',
  february = 'FEB',
  march = 'MAR',
  april = 'APR',
  may = 'MAY',
  june = 'JUN',
  july = 'JUL',
  august = 'AUG',
  september = 'SEP',
  october = 'OCT',
  november = 'NOV',
  december = 'DEC',
}

export enum MonthsNumber {
  JAN = 1,
  FEB,
  MAR,
  APR,
  MAY,
  JUN,
  JUL,
  AUG,
  SEP,
  OCT,
  NOV,
  DEC,
}

export type MonthsType = keyof typeof MonthsNumber;

export function isWeekend(date: DateTime) {
  /**
   * https://en.wikipedia.org/wiki/ISO_week_date
   */
  const weekendDays = [WeekDays.SATURDAY, WeekDays.SUNDAY];
  return weekendDays.includes(date.weekday);
}

export function isWeekDay(date: DateTime) {
  return !isWeekend(date);
}

export function diffInDaysFromToday(date: Date): number {
  const startOfDay = { hour: 0, minute: 0, second: 0, millisecond: 0 };
  const today = DateTime.now().set(startOfDay);
  const dateStartOfDay = DateTime.fromJSDate(date).set(startOfDay);

  return today.diff(dateStartOfDay, ['days']).days;
}

export enum MonthsLong {
  jan = 'january',
  feb = 'february',
  mar = 'march',
  apr = 'april',
  may = 'may',
  jun = 'june',
  jul = 'july',
  aug = 'august',
  sep = 'september',
  oct = 'october',
  nov = 'november',
  dec = 'december',
}
