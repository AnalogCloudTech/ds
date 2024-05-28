import { DateTime } from 'luxon';
import { groupBy, map } from 'lodash';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { GoogleService } from '@/legacy/dis/legacy/google/google.service';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { BusySlot, CalendarDto, DaySlots } from './dto/calendar.dto';
import { CreateMeetingDto } from './dto/createMeetting.dto';
import { isWeekend } from '@/internal/utils/date';
import { SchedulingOnBusySlotException } from '@/legacy/dis/legacy/calendar/Exceptions/scheduling-on-busy-slot.exception';

@Injectable()
export class CalendarService {
  constructor(
    @Inject('SCHEDULE_COACH_DURATION')
    private readonly scheduleCoachDuration: number,
    private hubspotService: HubspotService,
    private googleService: GoogleService,
  ) {}

  /**
   *
   * @throws SchedulingOnBusySlotException
   */
  async createMeeting(meetingData: CreateMeetingDto) {
    // this is disabled to use Hubspot own calendar integration, this code is left here in case we need the integration back on
    // await this.hubspotService.createMeetingEngagement(meetingData);

    const events = await this.googleService.getBusySlots(
      meetingData.calendarId,
      meetingData.startTime,
      meetingData.endTime,
    );

    if (events.length > 0) {
      throw new SchedulingOnBusySlotException();
    }

    return this.googleService.insertEvent(meetingData);
  }

  async getBusySlots(
    email: string,
    date: string,
    outputTimezone: string,
  ): Promise<CalendarDto> {
    const startDateAmerica = DateTime.fromISO(date)
      .set({ hour: 12 })
      .setZone('America/New_York')
      .set({ hour: 9 });

    const startDate = startDateAmerica.setZone('UTC');

    if (startDate['invalid']) {
      throw new HttpException(
        { message: 'Invalid date format' },
        HttpStatus.BAD_REQUEST,
      );
    }

    let dateRange = 5;
    let dateToCheck = startDate;
    for (let i = 1; i < 7; i++) {
      if (isWeekend(dateToCheck)) {
        dateRange++;
      }
      dateToCheck = dateToCheck.plus({ day: 1 });
    }
    const endDate = startDateAmerica
      .plus({ days: dateRange })
      .set({ hour: 18 })
      .setZone('UTC');

    const startDateIso = startDate.toISO();
    const endDateIso = endDate.endOf('day').toISO();

    let calendarEvents = await this.googleService.getBusySlots(
      email,
      startDateIso,
      endDateIso,
    );

    //remove weekend slots
    calendarEvents = calendarEvents.filter((calendarEvent) => {
      return !isWeekend(DateTime.fromISO(calendarEvent.start));
    });

    const busySlots = map(calendarEvents, (event) => {
      const slots: BusySlot = {
        meetingStart: event.start,
        meetingEnd: event.end,
      };
      return slots;
    });

    const busySlotsMap = groupBy(busySlots, (slot) =>
      DateTime.fromISO(slot.meetingStart).toFormat('yyyy-MM-dd'),
    );

    const freeTimeSlots: Array<DaySlots> = [];

    for (const date in busySlotsMap) {
      freeTimeSlots.push(
        this.generateFreeTimeSlots(DateTime.fromISO(date), busySlotsMap[date]),
      );
    }

    return {
      email: email,
      calendarDateStart: startDateIso,
      calendarDateEnd: endDateIso,
      BusySlots: busySlots,
      outputTimezone,
      freeTimeSlots: freeTimeSlots
        .filter(({ slots }) => slots.length > 0)
        .map(({ day, slots }) => {
          return {
            day,
            slots: slots.map((date) => date.setZone(outputTimezone)),
          };
        }),
    };
  }

  /**
   * Generate all possible slots between a time range
   * @param start
   * @param end
   */
  public generateSlots(start: DateTime, end: DateTime): Array<DateTime> {
    const slots: Array<DateTime> = [];
    do {
      slots.push(start);
      start = start.plus({ minutes: this.scheduleCoachDuration });
    } while (start < end);

    return slots;
  }

  protected removePastSlots(slots: Array<DateTime>): Array<DateTime> {
    return slots.filter(
      (slot) => slot > DateTime.now().setZone('UTC').plus({ hour: 2 }),
    );
  }

  public generateFreeTimeSlots(
    day: DateTime,
    busySlots: Array<BusySlot>,
  ): DaySlots {
    const startDate = day
      .set({ hour: 12 })
      .setZone('America/New_York')
      .set({
        hour: 9,
        minute: 0,
      })
      .setZone('UTC');
    const endDate = day
      .set({ hour: 12 })
      .setZone('America/New_York')
      .set({
        hour: 18,
        minute: 0,
      })
      .setZone('UTC');
    let slots = this.generateSlots(startDate, endDate);
    slots = this.removePastSlots(slots);

    slots = slots.filter((freeSlotStart) => {
      const freeSlotEnd = freeSlotStart.plus({
        minutes: this.scheduleCoachDuration,
      });

      let slotIsFree = true;
      busySlots.forEach((busySlot) => {
        const busyStart = DateTime.fromISO(busySlot.meetingStart);
        const busyEnd = DateTime.fromISO(busySlot.meetingEnd);
        // A ∩ B - Set Theory if A intercepts B, timeslot is not available
        // A = FreeSlot
        // B = BusySlot
        // const overlapped = !(
        //   freeSlotStart >= busyEnd || freeSlotEnd <= busyStart
        // );
        const overlapped = freeSlotStart < busyEnd && freeSlotEnd > busyStart;
        if (overlapped) {
          slotIsFree = false;
        }
      });

      return slotIsFree;
    });

    return <DaySlots>{
      day: startDate.toISO(),
      slots,
    };
  }
}
