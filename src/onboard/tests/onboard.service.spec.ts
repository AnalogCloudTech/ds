import { Test, TestingModule } from '@nestjs/testing';
import { rootMongooseTestModule } from '../../../test/utils/db.handler';
import { ConfigModule } from '@nestjs/config';
import { OnboardModule } from '@/onboard/onboard.module';
import { CustomersModule } from '@/customers/customers/customers.module';
import { CoachDocument } from '@/onboard/coaches/schemas/coach.schema';
import { CoachesService } from '@/onboard/coaches/coaches.service';
import { SessionService } from '@/onboard/services/session.service';
import { OnboardService } from '@/onboard/onboard.service';
import { SessionDocument } from '@/onboard/schemas/session.schema';
import { SchemaId } from '@/internal/types/helpers';
import { GoogleService } from '@/legacy/dis/legacy/google/google.service';
import { calendar_v3 } from 'googleapis';
import { DateTime } from 'luxon';
import { NoAvailableCoachesException } from '@/onboard/exceptions/no-available-coaches.exception';
import { get } from 'lodash';
import {
  createCoach,
  createOffer,
  setAllCoachesSchedulingPoints,
} from '@/onboard/tests/helpers';

describe.skip('Onboard Services', () => {
  let coachesService: CoachesService = null;
  let sessionService: SessionService = null;
  let onboardService: OnboardService = null;
  let googleService: GoogleService = null;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => {
              return {
                aws: {
                  region: '',
                  accessKeyId: '',
                  secretAccessKey: '',
                },
                twilio: {
                  accountSid: 'ACusername',
                  authToken: 'token',
                },
                chargify: {
                  api_key: '',
                },
                google: {
                  key: '{}',
                },
                onboardSettings: {
                  scheduleCoachDuration: 45,
                },
              };
            },
          ],
        }),
        CustomersModule,
        OnboardModule,
      ],
    }).compile();

    coachesService = module.get<CoachesService>(CoachesService);
    sessionService = module.get<SessionService>(SessionService);
    onboardService = module.get<OnboardService>(OnboardService);
    googleService = module.get<GoogleService>(GoogleService);
  });

  const createCoaches = async (
    numberOfCoach = 1,
  ): Promise<Array<CoachDocument>> => {
    const promises: Array<Promise<CoachDocument>> = [];
    for (let i = 0; i < numberOfCoach; i++) {
      promises.push(createCoach(coachesService));
    }

    return Promise.all(promises);
  };

  it('should [coachesService, sessionService, onboardService, googleService] be defined', () => {
    expect(coachesService).toBeDefined();
    expect(sessionService).toBeDefined();
    expect(onboardService).toBeDefined();
    expect(googleService).toBeDefined();
  });

  it('should createCoaches create n coaches', async () => {
    const numberOfCoaches = 10;
    await createCoaches(numberOfCoaches);
    const totalCoaches = await coachesService.count();
    expect(numberOfCoaches).toEqual(totalCoaches);
  });

  it('should Joseph not be next RR coach', async () => {
    const joseph = await createCoach(coachesService, { name: 'Joseph' });
    await coachesService.incrementScheduling(joseph._id);
    const notJoseph = await coachesService.getNextCoachInRR();
    expect(notJoseph._id).not.toEqual(joseph._id);
  });

  it('should Joseph be next RR coach', async () => {
    await setAllCoachesSchedulingPoints(coachesService);
    const joseph = await createCoach(coachesService, {
      name: 'Joseph',
      schedulingPoints: 0,
    });

    const nextRRCoach = await coachesService.getNextCoachInRR();

    expect(joseph._id.toString()).toBe(nextRRCoach._id.toString());
  });

  it('should Joseph be ignored by coachesToSkip', async () => {
    await setAllCoachesSchedulingPoints(coachesService);
    const joseph = await createCoach(coachesService, {
      name: 'Joseph',
      schedulingPoints: 0,
    });
    const nextRRCoach = await coachesService.getNextCoachInRR([joseph._id]);

    expect(joseph._id.toString()).not.toBe(nextRRCoach._id.toString());
  });

  it('should session has Joseph just one time inside declined session coaches', async () => {
    const offer = await createOffer(onboardService);
    const session: SessionDocument = await onboardService.createSession(offer);
    const sessionId = <SchemaId>session._id;
    const joseph = await createCoach(coachesService, { name: 'Joseph' });
    const maria = await createCoach(coachesService, { name: 'Maria' });
    await Promise.all([
      sessionService.pushDeclinedCoach(session, joseph),
      sessionService.pushDeclinedCoach(session, joseph),
      sessionService.pushDeclinedCoach(session, maria),
      sessionService.pushDeclinedCoach(session, maria),
    ]);
    const newSession = await onboardService.findSession(sessionId.toString());

    expect(newSession.declinedCoaches.length).toBe(2);
  });

  it('should have no available free slots at all and all coaches should be declined', async () => {
    const start = DateTime.now().startOf('day');
    const end = start.plus({ month: 1 });
    const mockedBusy: Promise<calendar_v3.Schema$TimePeriod[]> =
      Promise.resolve([
        {
          start: start.setZone('UTC').toISO(),
          end: end.setZone('UTC').toISO(),
        },
      ]);

    jest
      .spyOn(googleService, 'getBusySlots')
      .mockImplementation(() => mockedBusy);

    // Mocking google API response
    expect(await mockedBusy).toBe(
      await googleService.getBusySlots(
        'jose@gmail.com',
        start.toISO(),
        end.toISO(),
      ),
    );

    const offer = await createOffer(onboardService, { code: 'offer-1099' });
    const session = await onboardService.createSession(offer);

    try {
      await onboardService.getScheduleCoachingSlots(
        session,
        start.toISO(),
        'America/New_York',
      );
    } catch (error) {
      expect(NoAvailableCoachesException.name).toBe(
        get(error, ['response', 'exception']),
      );
    }

    const totalCoaches = await coachesService.count();
    const sessionId = <SchemaId>session._id;
    const finalSession = await onboardService.findSession(sessionId.toString());

    expect(finalSession.declinedCoaches.length).toBe(totalCoaches);
  });
});
