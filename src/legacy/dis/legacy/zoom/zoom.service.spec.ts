import { Test, TestingModule } from '@nestjs/testing';
import { ZoomService } from './zoom.service';
import {
  rootMongooseTestModule,
  closeInMongodConnection,
} from '../../../../../test/utils/db.handler';
import { ZoomModule } from './zoom.module';
import { ConfigModule } from '@nestjs/config';
import { ZoomPhoneUserDocument } from './schemas/zoom-phone-user.schema';
import { faker } from '@faker-js/faker';
import { CallLogResponse } from './dto/callLog';

describe('ZoomService', () => {
  let service: ZoomService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        ZoomModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => {
              return {
                env: 'test',
              };
            },
          ],
        }),
      ],
    }).compile();
    service = module.get<ZoomService>(ZoomService);
  });

  const createZoomUser = async (
    email = '',
  ): Promise<Array<ZoomPhoneUserDocument>> => {
    const promises: Array<Promise<ZoomPhoneUserDocument>> = [];
    promises.push(service.zoomPhoneUserAdd({ email }));
    return Promise.all(promises);
  };

  it('Zoom service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the response with coachEmailList if coachRecord exists', async () => {
    const email = 'test@example.com';
    await createZoomUser(email);

    const result = await service.phoneCallZoomUser(email);

    expect(result).toEqual({
      message: 'Team Members successfully sent',
      coachEmailList: [email],
    });
  });

  it('should return the response with All coachEmailList if not email exists', async () => {
    const email = 'test@example.com';

    for (let i = 0; i <= 5; i++) {
      await createZoomUser(faker.internet.email());
    }
    const result = await service.phoneCallZoomUser(email);
    expect(result).toBeDefined();
    expect(result.coachEmailList.length).toBeGreaterThan(0);
  });

  it('should return call log response when API call is successful', async () => {
    jest.spyOn(service, 'getCallLogByEmail').mockImplementation(() => {
      return Promise.resolve(<CallLogResponse>{
        next_page_token: 'zhERqRTQ9J7l7BBpt8hqBm3M7jILACpcLC2',
        page_size: 15,
        total_records: 2642,
        from: '2024-01-03',
        to: '2024-02-02',
        call_logs: [
          {
            id: '52c0f3ba-c6d0-41d0-9a47-9670b638d507',
            call_type: 'pstn',
            caller_number: '1015',
            caller_number_type: 1,
            caller_name: 'Cindy Inoferio',
            callee_number: '+19519703246',
            callee_number_type: 2,
            callee_number_source: 'external',
            callee_location: 'California',
            direction: 'outbound',
            duration: 28,
            result: 'Auto Recorded',
            date_time: '2024-02-01T22:05:06Z',
            recording_id: '52c0f3bac6d041d09a479670b638d507',
            recording_type: 'Automatic',
            has_voicemail: false,
            call_id: '7330758010338410006',
            caller_did_number: '+19044745802',
            caller_country_code: '1',
            caller_country_iso_code: 'US',
            callee_did_number: '+19519703246',
            callee_country_code: '1',
            callee_country_iso_code: 'US',
            call_end_time: '2024-02-01T22:06:06Z',
            department: '',
            cost_center: '',
          },
        ],
      });
    });

    const filter = {
      startDate: '2024-01-01',
      endDate: '2024-01-02',
    };

    await service.getCallLogs('test@email.com', 1, 15, filter, 'first');
    expect(service.getCallLogByEmail).toBeCalled();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
