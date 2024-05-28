"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarService = void 0;
const luxon_1 = require("luxon");
const lodash_1 = require("lodash");
const common_1 = require("@nestjs/common");
const google_service_1 = require("../google/google.service");
const hubspot_service_1 = require("../hubspot/hubspot.service");
const date_1 = require("../../../../internal/utils/date");
const scheduling_on_busy_slot_exception_1 = require("./Exceptions/scheduling-on-busy-slot.exception");
let CalendarService = class CalendarService {
    constructor(scheduleCoachDuration, hubspotService, googleService) {
        this.scheduleCoachDuration = scheduleCoachDuration;
        this.hubspotService = hubspotService;
        this.googleService = googleService;
    }
    async createMeeting(meetingData) {
        const events = await this.googleService.getBusySlots(meetingData.calendarId, meetingData.startTime, meetingData.endTime);
        if (events.length > 0) {
            throw new scheduling_on_busy_slot_exception_1.SchedulingOnBusySlotException();
        }
        return this.googleService.insertEvent(meetingData);
    }
    async getBusySlots(email, date, outputTimezone) {
        const startDateAmerica = luxon_1.DateTime.fromISO(date)
            .set({ hour: 12 })
            .setZone('America/New_York')
            .set({ hour: 9 });
        const startDate = startDateAmerica.setZone('UTC');
        if (startDate['invalid']) {
            throw new common_1.HttpException({ message: 'Invalid date format' }, common_1.HttpStatus.BAD_REQUEST);
        }
        let dateRange = 5;
        let dateToCheck = startDate;
        for (let i = 1; i < 7; i++) {
            if ((0, date_1.isWeekend)(dateToCheck)) {
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
        let calendarEvents = await this.googleService.getBusySlots(email, startDateIso, endDateIso);
        calendarEvents = calendarEvents.filter((calendarEvent) => {
            return !(0, date_1.isWeekend)(luxon_1.DateTime.fromISO(calendarEvent.start));
        });
        const busySlots = (0, lodash_1.map)(calendarEvents, (event) => {
            const slots = {
                meetingStart: event.start,
                meetingEnd: event.end,
            };
            return slots;
        });
        const busySlotsMap = (0, lodash_1.groupBy)(busySlots, (slot) => luxon_1.DateTime.fromISO(slot.meetingStart).toFormat('yyyy-MM-dd'));
        const freeTimeSlots = [];
        for (const date in busySlotsMap) {
            freeTimeSlots.push(this.generateFreeTimeSlots(luxon_1.DateTime.fromISO(date), busySlotsMap[date]));
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
    generateSlots(start, end) {
        const slots = [];
        do {
            slots.push(start);
            start = start.plus({ minutes: this.scheduleCoachDuration });
        } while (start < end);
        return slots;
    }
    removePastSlots(slots) {
        return slots.filter((slot) => slot > luxon_1.DateTime.now().setZone('UTC').plus({ hour: 2 }));
    }
    generateFreeTimeSlots(day, busySlots) {
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
                const busyStart = luxon_1.DateTime.fromISO(busySlot.meetingStart);
                const busyEnd = luxon_1.DateTime.fromISO(busySlot.meetingEnd);
                const overlapped = freeSlotStart < busyEnd && freeSlotEnd > busyStart;
                if (overlapped) {
                    slotIsFree = false;
                }
            });
            return slotIsFree;
        });
        return {
            day: startDate.toISO(),
            slots,
        };
    }
};
CalendarService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SCHEDULE_COACH_DURATION')),
    __metadata("design:paramtypes", [Number, hubspot_service_1.HubspotService,
        google_service_1.GoogleService])
], CalendarService);
exports.CalendarService = CalendarService;
//# sourceMappingURL=calendar.service.js.map