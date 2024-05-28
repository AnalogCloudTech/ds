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
exports.GoogleService = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
const googleapis_1 = require("googleapis");
const uuid_1 = require("uuid");
const afy_logger_service_1 = require("../../../../integrations/afy-logger/afy-logger.service");
let GoogleService = class GoogleService {
    constructor(googleCalendar, googleAuthInput, afyLoggerService) {
        this.googleCalendar = googleCalendar;
        this.googleAuthInput = googleAuthInput;
        this.afyLoggerService = afyLoggerService;
        this.googleAuth = new googleapis_1.google.auth.JWT((0, lodash_1.get)(this.googleAuthInput, ['client_email']), null, (0, lodash_1.get)(this.googleAuthInput, ['private_key']), (0, lodash_1.get)(this.googleAuthInput, ['SCOPES']));
    }
    async getBusySlots(calendarEmail, startDate, endDate) {
        const freeBusyOptions = {
            auth: this.googleAuth,
            requestBody: {
                timeMin: startDate,
                timeMax: endDate,
                timeZone: 'UTC',
                items: [
                    {
                        id: calendarEmail,
                    },
                ],
            },
        };
        const request = await this.googleCalendar.freebusy.query(freeBusyOptions);
        const freeBusyList = (0, lodash_1.get)(request, ['data', 'calendars', calendarEmail, 'busy'], []);
        return freeBusyList;
    }
    async insertEvent(eventData) {
        const { title, body, startTime, endTime, coachEmail, coachName, calendarId, contactEmail, contactName, } = eventData;
        const jwt = new googleapis_1.google.auth.JWT((0, lodash_1.get)(this.googleAuthInput, ['client_email']), null, (0, lodash_1.get)(this.googleAuthInput, ['private_key']), (0, lodash_1.get)(this.googleAuthInput, ['SCOPES']), coachEmail);
        const requestBody = {
            summary: title,
            description: body,
            start: {
                dateTime: startTime,
                timeZone: 'UTC',
            },
            end: {
                dateTime: endTime,
                timeZone: 'UTC',
            },
            attendees: [
                {
                    displayName: contactName,
                    email: contactEmail,
                },
                {
                    displayName: coachName,
                    email: coachEmail,
                },
            ],
            location: eventData.location,
        };
        const event = {
            auth: jwt,
            calendarId: calendarId,
            requestBody,
            sendUpdates: 'all',
        };
        await this.afyLoggerService.sendLog({
            event: { name: 'schedule-coach-call', namespace: 'onboard' },
            source: 'digital-services',
            customer: { email: contactEmail, name: contactName },
            trace: (0, uuid_1.v4)(),
            tags: [`coach-email:${coachEmail}`, `coach-name:${coachName}`],
        });
        return this.googleCalendar.events.insert(event);
    }
    async getCalendarEvents(options, nextPageToken) {
        const requestOptions = Object.assign(Object.assign({}, options), { nextPageToken });
        const request = await this.googleCalendar.events.list(requestOptions);
        const events = request.data.items;
        return events;
    }
};
GoogleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('GoogleCalendar')),
    __param(1, (0, common_1.Inject)('GoogleAuthInput')),
    __metadata("design:paramtypes", [googleapis_1.calendar_v3.Calendar, Object, afy_logger_service_1.default])
], GoogleService);
exports.GoogleService = GoogleService;
//# sourceMappingURL=google.service.js.map