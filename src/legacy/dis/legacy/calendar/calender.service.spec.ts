import { CalendarService } from '@/legacy/dis/legacy/calendar/calendar.service';
import {
  BusySlot,
  DaySlots,
} from '@/legacy/dis/legacy/calendar/dto/calendar.dto';
import { DateTime } from 'luxon';

function nextYear() {
  return DateTime.now().year + 1;
}

function isoDateTime(ds: DaySlots) {
  const slots = ds.slots;
  return slots.map((d) => d.toISO());
}
describe.skip('Calendar', () => {
  let calendarService: CalendarService;

  beforeAll(() => {
    calendarService = new CalendarService(45, null, null);
  });

  it('CalendarService should be defined', () => {
    expect(calendarService).toBeDefined();
  });

  it('should have all slots available', () => {
    const year = nextYear();

    const day: DateTime = DateTime.fromISO(`${year}-01-01T09:00:00.000Z`, {
      zone: 'UTC',
    });
    const busySlots: Array<BusySlot> = [];

    const ds = calendarService.generateFreeTimeSlots(day, busySlots);
    const isoSlots = isoDateTime(ds);
    expect(isoSlots).toHaveLength(12);
    expect(new Set(isoSlots).size).toEqual(12);
  });

  it('should not have 14:00-14:45 available', () => {
    const year = nextYear();

    const day: DateTime = DateTime.fromISO(`${year}-01-01T09:00:00.000Z`);
    const busySlots: Array<BusySlot> = [
      {
        meetingStart: `${year}-01-01T14:00:00.000Z`,
        meetingEnd: `${year}-01-01T14:45:00.000Z`,
      },
    ];
    const ds = calendarService.generateFreeTimeSlots(day, busySlots);
    const isoSlots = isoDateTime(ds);

    expect(isoSlots).toHaveLength(11);
    expect(new Set(isoSlots).size).toEqual(11);
    expect(isoSlots.includes(`${year}-01-01T14:00:00.000Z`)).toBeFalsy();
    expect(isoSlots.includes(`${year}-01-01T14:45:00.000Z`)).toBeTruthy();
  });

  it('should not have 14:00-14:45 available with time within that timeslot', () => {
    const year = nextYear();

    const day: DateTime = DateTime.fromISO(`${year}-01-01T09:00:00.000Z`);

    // blocking 1 minute after 14h to 14h44
    // this shouldnt block 14:45 slot
    // this should block 14:00 slot
    const busySlots: Array<BusySlot> = [
      {
        meetingStart: `${year}-01-01T14:01:00.000Z`,
        meetingEnd: `${year}-01-01T14:44:00.000Z`,
      },
    ];
    const ds = calendarService.generateFreeTimeSlots(day, busySlots);
    const isoSlots = isoDateTime(ds);

    expect(isoSlots).toHaveLength(11);
    expect(new Set(isoSlots).size).toEqual(11);
    expect(isoSlots.includes('2024-01-01T14:00:00.000Z')).toBeFalsy();
    expect(isoSlots.includes('2024-01-01T14:45:00.000Z')).toBeTruthy();
  });

  it('should not have 14:00 and 14:45 slots available', () => {
    const year = nextYear();

    const day: DateTime = DateTime.fromISO(`${year}-01-01T09:00:00.000Z`);

    // blocking 1 minute before 14h to 14h46
    // this should block 14:45 slot
    // this should block 14:00 slot
    const busySlots: Array<BusySlot> = [
      {
        meetingStart: `${year}-01-01T13:59:00.000Z`,
        meetingEnd: `${year}-01-01T14:46:00.000Z`,
      },
    ];
    const ds = calendarService.generateFreeTimeSlots(day, busySlots);
    const isoSlots = isoDateTime(ds);

    expect(isoSlots).toHaveLength(10);
    expect(new Set(isoSlots).size).toEqual(10);
    expect(isoSlots.includes('2024-01-01T14:00:00.000Z')).toBeFalsy();
    expect(isoSlots.includes('2024-01-01T14:45:00.000Z')).toBeFalsy();
  });

  it('should block 14 and 14:45 slots', () => {
    const year = nextYear();

    const day: DateTime = DateTime.fromISO(`${year}-01-01T09:00:00.000Z`);

    // this should block 14:45 slot
    // this should block 14:00 slot
    const busySlots: Array<BusySlot> = [
      {
        meetingStart: `${year}-01-01T14:44:59.000Z`,
        meetingEnd: `${year}-01-01T14:45:01.000Z`,
      },
    ];
    const ds = calendarService.generateFreeTimeSlots(day, busySlots);
    const isoSlots = isoDateTime(ds);

    expect(isoSlots).toHaveLength(10);
    expect(new Set(isoSlots).size).toEqual(10);
    expect(isoSlots.includes('2024-01-01T14:00:00.000Z')).toBeFalsy();
    expect(isoSlots.includes('2024-01-01T14:45:00.000Z')).toBeFalsy();
  });

  it('should not block any time outside 14h-23h slots', () => {
    const year = nextYear();

    const day: DateTime = DateTime.fromISO(`${year}-01-01T09:00:00.000Z`);

    // blocking outside work hours
    const busySlots: Array<BusySlot> = [
      {
        meetingStart: `${year}-01-01T23:00:00.000Z`,
        meetingEnd: `${year}-01-01T23:30:00.000Z`,
      },
    ];
    const ds = calendarService.generateFreeTimeSlots(day, busySlots);
    const isoSlots = isoDateTime(ds);

    expect(isoSlots).toHaveLength(12);
    expect(new Set(isoSlots).size).toEqual(12);
  });

  it('should not have 14, 14:45, 15:30 timeslots available', () => {
    const year = nextYear();

    const day: DateTime = DateTime.fromISO(`${year}-01-01T09:00:00.000Z`);

    // blocking multiple timeslots
    // this should block 14:00 slot
    // this should block 14:45 slot
    // this should block 15:30 slot
    // this shouldn't block 16:15 slot
    const busySlots: Array<BusySlot> = [
      {
        meetingStart: `${year}-01-01T14:25:00.000Z`,
        meetingEnd: `${year}-01-01T15:45:00.000Z`,
      },
    ];
    const ds = calendarService.generateFreeTimeSlots(day, busySlots);
    const isoSlots = isoDateTime(ds);

    expect(isoSlots).toHaveLength(9);
    expect(new Set(isoSlots).size).toEqual(9);
    expect(isoSlots.includes('2024-01-01T14:00:00.000Z')).toBeFalsy();
    expect(isoSlots.includes('2024-01-01T14:45:00.000Z')).toBeFalsy();
    expect(isoSlots.includes('2024-01-01T15:30:00.000Z')).toBeFalsy();
    expect(isoSlots.includes('2024-01-01T16:15:00.000Z')).toBeTruthy();
  });

  it('', () => {
    const year = nextYear();

    const day: DateTime = DateTime.fromISO(`${year}-01-01T09:00:00.000Z`);

    // blocking multiple timeslots
    // this should block 14:00 slot
    // this shouldnt block 14:45 slot
    // this should block 15:30 slot
    const busySlots: Array<BusySlot> = [
      {
        meetingStart: `${year}-01-01T14:00:00.000Z`,
        meetingEnd: `${year}-01-01T14:45:00.000Z`,
      },
      {
        meetingStart: `${year}-01-01T15:30:00.000Z`,
        meetingEnd: `${year}-01-01T16:15:00.000Z`,
      },
    ];
    const ds = calendarService.generateFreeTimeSlots(day, busySlots);
    const isoSlots = isoDateTime(ds);

    expect(isoSlots).toHaveLength(10);
    expect(new Set(isoSlots).size).toEqual(10);
    expect(isoSlots.includes('2024-01-01T14:00:00.000Z')).toBeFalsy();
    expect(isoSlots.includes('2024-01-01T14:45:00.000Z')).toBeTruthy();
    expect(isoSlots.includes('2024-01-01T15:30:00.000Z')).toBeFalsy();
  });

  it('', () => {
    const year = nextYear();

    const day: DateTime = DateTime.fromISO(`${year}-01-01T09:00:00.000Z`);

    // blocking multiple timeslots
    const busySlots: Array<BusySlot> = [
      {
        meetingStart: `${year}-01-01T14:25:00.000Z`,
        meetingEnd: `${year}-01-01T14:50:00.000Z`,
      },
      {
        meetingStart: `${year}-01-01T15:10:00.000Z`,
        meetingEnd: `${year}-01-01T16:10:00.000Z`,
      },
    ];
    const ds = calendarService.generateFreeTimeSlots(day, busySlots);
    const isoSlots = isoDateTime(ds);

    expect(isoSlots).toHaveLength(9);
    expect(new Set(isoSlots).size).toEqual(9);
    expect(isoSlots.includes('2024-01-01T14:00:00.000Z')).toBeFalsy();
    expect(isoSlots.includes('2024-01-01T14:45:00.000Z')).toBeFalsy();
    expect(isoSlots.includes('2024-01-01T15:30:00.000Z')).toBeFalsy();
    expect(isoSlots.includes('2024-01-01T16:15:00.000Z')).toBeTruthy();
  });
});
