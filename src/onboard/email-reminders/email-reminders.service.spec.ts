import { EmailRemindersService } from '@/onboard/email-reminders/email-reminders.service';
import { Test, TestingModule } from '@nestjs/testing';
import { EmailRemindersModule } from '@/onboard/email-reminders/email-reminders.module';
import { ConfigModule } from '@nestjs/config';
import { CreateEmailReminderDto } from '@/onboard/email-reminders/dto/create-email-reminder.dto';
import { Types } from 'mongoose';
import { EmailReminderDocument } from '@/onboard/email-reminders/schemas/email-reminder.schema';
import { DateTime } from 'luxon';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CoachDocument } from '@/onboard/coaches/schemas/coach.schema';
import { SessionDocument } from '@/onboard/schemas/session.schema';
import { SchemaId } from '@/internal/types/helpers';
import { rootMongooseTestModule } from '../../../test/utils/db.handler';
import { faker } from '@faker-js/faker';
import { CustomersModule } from '@/customers/customers/customers.module';
import { checkAllowedSms } from './helpers/check-allowed';

describe.skip('Email Reminders', () => {
  let service: EmailRemindersService;

  const createReminder = (
    override: Partial<CreateEmailReminderDto> = {},
  ): Promise<EmailReminderDocument> => {
    const relations = setupDummyRelations();
    const dto: CreateEmailReminderDto = {
      customer: relations.customer._id,
      session: <SchemaId>relations.session._id,
      coach: relations.coach._id,
      date: DateTime.now().toJSDate(),
      meetingDate: DateTime.now().toJSDate(),
      subject: faker.lorem.lines(1),
      timezone: 'America/New_York',
      meetingLink: faker.internet.url(),
    };
    return service.create({ ...dto, ...override });
  };

  const setupDummyRelations = () => {
    const customer = <CustomerDocument>{
      _id: new Types.ObjectId(),
      firstName: faker.name.firstName(),
    };

    const coach = <CoachDocument>{
      _id: new Types.ObjectId(),
      meetingLink: faker.internet.url(),
    };

    const session = <SessionDocument>{
      _id: new Types.ObjectId(),
    };

    return { customer, coach, session };
  };

  const setupAllReminder = (
    date: DateTime,
    isRescheduling = false,
  ): Promise<Array<EmailReminderDocument>> => {
    const { customer, coach, session } = setupDummyRelations();

    const timezone = 'EST';

    return service.sendAllRemindersEmail(
      customer,
      coach,
      session,
      date,
      timezone,
      isRescheduling,
    );
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        EmailRemindersModule,
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
              };
            },
          ],
        }),
        CustomersModule,
      ],
    }).compile();

    service = module.get<EmailRemindersService>(EmailRemindersService);
  });

  it('Should define service', () => {
    expect(service).toBeDefined();
  });

  it('Should send all reminders and create 4 reminders', async () => {
    const date = DateTime.now().set({
      hour: 9,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const isRescheduling = false;

    const reminders = await setupAllReminder(date, isRescheduling);

    expect(reminders.length).toEqual(4);
  });

  it('Reschedule reminders should create 3 reminders', async () => {
    const date = DateTime.now().set({
      hour: 9,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const isRescheduling = true;
    const reminders = await setupAllReminder(date, isRescheduling);

    expect(reminders.length).toEqual(3);
  });

  it('Formatted meeting date should be equals to "1/1/2023, 9:00 AM (America/New_York)"', async () => {
    const override = <CreateEmailReminderDto>{
      meetingDate: DateTime.fromISO('2023-01-01T14:00:00-0000').toJSDate(),
    };
    const reminder: EmailReminderDocument = await createReminder(override);
    expect(reminder).toBeDefined();
    expect(reminder.meetingDateFormatted).toEqual(
      '1/1/2023, 9:00 AM (America/New_York)',
    );
  });

  it('Should block sending SMS between 6PM and 9AM EST', async () => {
    const dt = DateTime.now().setZone('America/New_York');
    const est5am = dt.set({ hour: 5, minute: 0, second: 0, millisecond: 0 });
    const est2pm = dt.set({ hour: 14, minute: 0, second: 0, millisecond: 0 });

    const override1 = <CreateEmailReminderDto>{
      date: est5am.toJSDate(),
    };

    const override2 = <CreateEmailReminderDto>{
      date: est2pm.toJSDate(),
    };

    const reminder1: EmailReminderDocument = await createReminder(override1);
    const reminder2: EmailReminderDocument = await createReminder(override2);

    const sms1 = checkAllowedSms(reminder1);
    const sms2 = checkAllowedSms(reminder2);

    expect(sms1).toBeFalsy();
    expect(sms2).toBeTruthy();
  });
});
