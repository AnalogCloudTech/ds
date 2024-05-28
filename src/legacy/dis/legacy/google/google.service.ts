import { Inject, Injectable } from '@nestjs/common';
import { get } from 'lodash';
import { Auth as GoogleAuth, calendar_v3, google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';
import { CreateMeetingDto } from '@/legacy/dis/legacy/calendar/dto/createMeetting.dto';
import AfyLoggerService from '@/integrations/afy-logger/afy-logger.service';

@Injectable()
export class GoogleService {
  private googleAuth: GoogleAuth.JWT;
  constructor(
    @Inject('GoogleCalendar')
    private readonly googleCalendar: calendar_v3.Calendar,
    @Inject('GoogleAuthInput')
    private readonly googleAuthInput: GoogleAuth.JWTInput,
    private readonly afyLoggerService: AfyLoggerService,
  ) {
    this.googleAuth = new google.auth.JWT(
      get(this.googleAuthInput, ['client_email']),
      null,
      get(this.googleAuthInput, ['private_key']),
      get(this.googleAuthInput, ['SCOPES']),
    );
  }
  async getBusySlots(
    calendarEmail: string,
    startDate: string,
    endDate: string,
  ) {
    const freeBusyOptions: calendar_v3.Params$Resource$Freebusy$Query = {
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
    const freeBusyList: calendar_v3.Schema$TimePeriod[] = get(
      request,
      ['data', 'calendars', calendarEmail, 'busy'],
      [],
    );
    return freeBusyList;
  }

  async insertEvent(eventData: CreateMeetingDto) {
    const {
      title,
      body,
      startTime,
      endTime,
      coachEmail,
      coachName,
      calendarId,
      contactEmail,
      contactName,
    } = eventData;
    const jwt = new google.auth.JWT(
      get(this.googleAuthInput, ['client_email']),
      null,
      get(this.googleAuthInput, ['private_key']),
      get(this.googleAuthInput, ['SCOPES']),
      coachEmail,
    );
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
      trace: uuidv4(),
      tags: [`coach-email:${coachEmail}`, `coach-name:${coachName}`],
    });
    return this.googleCalendar.events.insert(event);
  }

  // future proofing method
  private async getCalendarEvents(
    options,
    nextPageToken?: string | undefined,
  ): Promise<calendar_v3.Schema$Event[]> {
    const requestOptions = { ...options, nextPageToken };
    const request = await this.googleCalendar.events.list(requestOptions);
    const events = request.data.items;
    return events;
  }
}
