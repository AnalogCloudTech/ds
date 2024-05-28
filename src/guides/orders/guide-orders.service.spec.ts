import { Test } from '@nestjs/testing';
import { CustomersService } from '@/customers/customers/customers.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../test/utils/db.handler';
import { CustomersModule } from '@/customers/customers/customers.module';
import { ConfigModule } from '@nestjs/config';
import { GuideOrdersModule } from './guide-orders.module';
import { GuideOrdersService } from './guide-orders.service';
import { GuideDetailDocument } from './schemas/guide-details.schema';
import { CreateGuideDetailsDto } from './dto/create-guide-details.dto';
import { Types } from 'mongoose';
import { ContactV1 } from '@/legacy/dis/legacy/hubspot/domain/types';
import { faker } from '@faker-js/faker';
import { SchemaId } from '@/internal/types/helpers';

describe('Guide Order Services', () => {
  let guideOrderService: GuideOrdersService;
  let customersServices: CustomersService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        GuideOrdersModule,
        CustomersModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => {
              return {
                env: 'test',
                aws: {
                  msk: {
                    kafka: {
                      brokers: '',
                    },
                  },
                },
              };
            },
          ],
        }),
      ],
    }).compile();

    guideOrderService = module.get<GuideOrdersService>(GuideOrdersService);
    customersServices = module.get<CustomersService>(CustomersService);
  });

  const createRecordData = async (
    data: CreateGuideDetailsDto,
    email: string,
    mockCustomerId: SchemaId,
  ): Promise<Array<GuideDetailDocument>> => {
    const promises: Array<Promise<GuideDetailDocument>> = [];
    promises.push(
      guideOrderService.storeOnboardData(data, email, mockCustomerId),
    );
    return Promise.all(promises);
  };

  it('should be defined', () => {
    expect(guideOrderService).toBeDefined();
    expect(customersServices).toBeDefined();
  });

  it('should create a record for onboard data', async () => {
    const data = {
      frontCover: [
        {
          image: faker.image.imageUrl(),
          name: 'shantest1',
          title: 'DDS',
        },
      ],
      practiceName: faker.company.name(),
      practiceAddress: {
        addressLine1: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        pincode: faker.address.zipCode(),
        country: faker.address.country(),
      },
      practicePhone: faker.phone.number(),
      practiceLogo: faker.image.imageUrl(),
      practiceWebsite: faker.internet.url(),
      practiceEmail: faker.internet.email(),
      shippingAddress: {
        addressLine1: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        pincode: faker.address.zipCode(),
        country: faker.address.country(),
      },
    };

    const mockCustomerId = new Types.ObjectId();

    const mockContact: ContactV1 = {
      vid: 123,
      'canonical-vid': 123,
      'merged-vids': [],
      properties: {
        name: {
          value: 'John Doe',
          versions: [
            {
              value: 'John Doe',
              'source-type': 'internal',
              timestamp: Date.now(),
              selected: true,
            },
          ],
        },
        email: {
          value: 'john@example.com',
          versions: [
            {
              value: 'john@example.com',
              'source-type': 'internal',
              timestamp: Date.now(),
              selected: true,
            },
          ],
        },
        age: {
          value: '30',
          versions: [
            {
              value: '30',
              'source-type': 'internal',
              timestamp: Date.now(),
              selected: true,
            },
          ],
        },
      },
      'form-submissions': [],
      'list-memberships': [],
      'identity-profiles': [],
      'merge-audits': [],
    };

    jest
      .spyOn(guideOrderService, 'getContactDetailsByEmail')
      .mockImplementation(() => {
        return Promise.resolve(<ContactV1>(<unknown>{ mockContact }));
      });

    const result = await createRecordData(
      data,
      'test@gmail.com',
      mockCustomerId,
    );

    expect(guideOrderService.getContactDetailsByEmail).toBeCalled();
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
