import { DateTime, Settings } from 'luxon';
import { fixDateInDaylightSaving } from '@/internal/common/utils/dateFormatters';

describe('Date Formatters', () => {
  test('Luxon now is fixed on 2023-03-03T09:00:00-0500', () => {
    Settings.now = () => new Date(2023, 2, 3, 9, 0, 0, 0).valueOf();
    const now = DateTime.now();
    expect('2023-03-03').toEqual(now.toFormat('yyyy-MM-dd'));
  });

  test('If today is not daylight saving and schedule date is, sub 1 hour', () => {
    Settings.now = () => new Date(2023, 2, 3, 9, 0, 0, 0).valueOf();

    const scheduleDateStart = DateTime.fromISO('2023-03-13T09:00:00-0500');
    const scheduleDateEnd = DateTime.fromISO('2023-03-13T09:45:00-0500');
    const scheduleDates = fixDateInDaylightSaving(
      scheduleDateStart,
      scheduleDateEnd,
    );

    expect(scheduleDates.startDate.hour).toEqual(scheduleDateStart.hour - 1);
    expect(scheduleDates.endDate.hour).toEqual(scheduleDateEnd.hour - 1);
  });

  test('if today is daylight saving and schedule date too, do notting', () => {
    Settings.now = () => new Date(2023, 2, 13, 9, 0, 0, 0).valueOf();

    const scheduleDateStart = DateTime.fromISO('2023-03-13T09:00:00-0500');
    const scheduleDateEnd = DateTime.fromISO('2023-03-13T09:45:00-0500');
    const scheduleDates = fixDateInDaylightSaving(
      scheduleDateStart,
      scheduleDateEnd,
    );

    expect(scheduleDates.startDate.hour).toEqual(scheduleDateStart.hour);
    expect(scheduleDates.endDate.hour).toEqual(scheduleDateEnd.hour);
  });
});
