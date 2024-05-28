import { Test } from '@nestjs/testing';
import { MagazinesModule } from '../magazines.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../../test/utils/db.handler';
import { MagazinesRepository } from './magazines.repository';
import { ConfigModule } from '@nestjs/config';
import { CustomersService } from '@/customers/customers/customers.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CustomersModule } from '@/customers/customers/customers.module';
import {
  getError,
  NoErrorThrownError,
} from '../../../../test/utils/error.handler';
import { HttpException } from '@nestjs/common';

describe.skip('Magazine Repository', () => {
  let magazinesRepository: MagazinesRepository;
  let customersService: CustomersService;
  let customer: CustomerDocument;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MagazinesModule,
        CustomersModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => {
              return {
                aws: {
                  sns: {
                    topics: {
                      RM_MAGAZINE_GENERATION: 'RM_MAGAZINE_GENERATION',
                    },
                  },
                },
              };
            },
          ],
        }),
      ],
    }).compile();
    magazinesRepository = module.get<MagazinesRepository>(MagazinesRepository);
    customersService = module.get<CustomersService>(CustomersService);

    customer = await customersService.create({
      email: 'janedoe@authorify.com',
      firstName: 'jane',
      lastName: 'doe',
      phone: '5599999999',
      password: 'testeteste2',
      billing: {
        state: '',
        country: 'BR',
        zip: '849999999',
        city: 'test',
        address1: '',
      },
      attributes: null,
      smsPreferences: {
        schedulingCoachReminders: true,
      },
      avatar: '',
      chargifyToken: '',
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should repository be defined', () => {
    expect(magazinesRepository).toBeDefined();
  });

  it('should create a magazine', async () => {
    const magazine = await magazinesRepository.create({
      month: 'January',
      year: '2021',
      magazineId: 1,
      customer: customer._id,
      contentUrl: 'http://google.com',
    });
    expect(magazine).toBeDefined();
    expect(magazine.month).toBe('JAN');
    expect(magazine.year).toBe('2021');
    expect(magazine.magazineId).toBe(1);
    expect(magazine.customer).toBe(customer._id);
  });

  it('should not create a magazine when magazine is already created for that month', async () => {
    const error: HttpException = await getError(async () => {
      await magazinesRepository.create({
        month: 'January',
        year: '2021',
        magazineId: 1,
        customer: customer._id,
        contentUrl: 'http://google.com',
      });
    });
    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toBeInstanceOf(HttpException);
    expect(error.message).toEqual('magazine already created');
  });

  it('should create a magazine with last month data', async () => {
    const lastMonthMagazine = await magazinesRepository.create({
      month: 'November',
      year: '2021',
      magazineId: 2,
      customer: customer._id,
      contentUrl: 'http://google.com',
    });
    expect(lastMonthMagazine).toBeDefined();

    const lastMonthMagazineUpdated = await magazinesRepository.update(
      lastMonthMagazine._id,
      {
        selections: [
          {
            page: 1,
            formKeyword: 'test',
            dynamicFields: { keyword: 'test', value: 'test' },
          },
        ],
      },
    );
    expect(lastMonthMagazineUpdated).toBeDefined();

    const magazine = await magazinesRepository.create({
      month: 'December',
      year: '2021',
      magazineId: 3,
      customer: customer._id,
      contentUrl: 'http://google.com',
    });
    expect(magazine).toBeDefined();
    expect(magazine.month).toBe('DEC');
    expect(magazine.year).toBe('2021');
    expect(magazine.magazineId).toBe(3);
    expect(magazine.customer).toBe(customer._id);
    expect(magazine.selections).toHaveLength(1);
  });

  it('should not create a magazine when month couldnt be parsed', async () => {
    const error: HttpException = await getError(async () => {
      await magazinesRepository.create({
        month: 'January1',
        year: '2022',
        magazineId: 4,
        customer: customer._id,
        contentUrl: 'http://google.com',
      });
    });
    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toBeInstanceOf(HttpException);
    expect(error.message).toEqual('could not parse month');
  });
});
