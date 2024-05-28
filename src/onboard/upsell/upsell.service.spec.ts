import { UpsellService } from '@/onboard/upsell/upsell.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UpsellModule } from '@/onboard/upsell/upsell.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../test/utils/db.handler';
import { ConfigModule } from '@nestjs/config';
import { CustomersModule } from '@/customers/customers/customers.module';
import { CreateUpsellReportDto } from '@/onboard/upsell/dto/create-upsell-report.dto';
import {
  PaymentProviders,
  PaymentStatus,
} from '@/onboard/upsell/schemas/tw-upsell.schema';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import { OffersService } from '@/onboard/services/offers.service';

describe('Upsell Report', () => {
  let service: UpsellService;
  let module: TestingModule;
  let offersService: OffersService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        UpsellModule,
        CustomersModule,
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
    service = module.get<UpsellService>(UpsellService);
    offersService = module.get<OffersService>(OffersService);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('Should define service', () => {
    expect(service).toBeDefined();
  });

  it('Should return at least one upsell report', async () => {
    const upsellReport = {
      customerEmail: faker.internet.email(),
      offerCode: faker.lorem.word(),
      paymentProvider: PaymentProviders.CHARGIFY,
      paymentStatus: PaymentStatus.SUCCESS,
    };

    offersService.findOne = jest.fn().mockResolvedValue([
      {
        _id: new Types.ObjectId(),
        title: upsellReport.offerCode,
        code: upsellReport.offerCode,
      },
    ]);
    await service.create(upsellReport);

    const result = await service.findAllPaginated(
      {
        startDate: '2023-01-18T18:13:59.256Z',
        endDate: '2999-01-18T18:13:59.256Z',
      },
      {},
      0,
      10,
    );
    expect(result).toBeDefined();
    expect(result.data.length).toBeGreaterThan(0);
  });

  it('Should return according to pagination options', async () => {
    const upsellReports: CreateUpsellReportDto[] = [];
    for (let i = 0; i < 25; i++) {
      upsellReports.push({
        customerEmail: faker.internet.email(),
        offer: {},
        offerName: faker.lorem.word(),
        sessionId: new Types.ObjectId(),
        paymentProvider: PaymentProviders.CHARGIFY,
        paymentStatus: PaymentStatus.SUCCESS,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      });
    }
    await service.createMany(upsellReports);

    const test1 = await service.findAllPaginated(
      {
        startDate: '2023-01-18T18:13:59.256Z',
        endDate: '2025-01-18T18:13:59.256Z',
      },
      {},
      2,
      5,
    );

    expect(test1).toBeDefined();
    expect(test1.meta.perPage).toBe(5);
    expect(test1.meta.currentPage).toBe(2);

    const test2 = await service.findAllPaginated(
      {
        startDate: '2023-01-18T18:13:59.256Z',
        endDate: '2025-01-18T18:13:59.256Z',
      },
      {},
      1,
      15,
    );

    expect(test2).toBeDefined();
    expect(test2.meta.perPage).toBe(15);
    expect(test2.meta.currentPage).toBe(1);
  });

  it('Should return according to filter options', async () => {
    const upsellReports: CreateUpsellReportDto[] = [];
    for (let i = 0; i < 6; i++) {
      upsellReports.push({
        customer: {},
        customerEmail: faker.internet.email(),
        offer: {},
        offerName: i >= 3 ? 'MaGiC' : faker.lorem.word(),
        sessionId: new Types.ObjectId(),
        paymentProvider: PaymentProviders.CHARGIFY,
        paymentStatus: PaymentStatus.SUCCESS,
      });
    }

    await service.createMany(upsellReports);

    const testData = await service.findAllPaginated(
      {
        startDate: '2023-01-18T18:13:59.256Z',
        endDate: '2025-01-18T18:13:59.256Z',
      },
      {
        offerName: ['magic'],
      },
      1,
      15,
    );

    expect(testData).toBeDefined();
    expect(testData.meta.total).toBe(3);
  });

  it('Should return according to sort options', async () => {
    const testData = await service.findAllPaginated(
      {
        startDate: '2023-01-18T18:13:59.256Z',
        endDate: '2025-01-18T18:13:59.256Z',
        sortBy: {
          offerName: 1,
        },
      },
      {},
      1,
      20,
    );
    expect(testData).toBeDefined();

    const sortedData = testData.data.sort((a, b) => {
      if (a.offerName > b.offerName) return 1;
      if (a.offerName < b.offerName) return -1;
      return 0;
    });

    expect(testData.data).toEqual(sortedData);
  });

  it('Should return results as array of string for search', async () => {
    const upsellReports: CreateUpsellReportDto[] = [];
    for (let i = 0; i < 6; i++) {
      upsellReports.push({
        customer: {},
        customerEmail: faker.internet.email(),
        offer: {},
        offerName: i >= 3 ? 'MaGiC' : faker.lorem.word(),
        sessionId: new Types.ObjectId(),
        paymentProvider: PaymentProviders.CHARGIFY,
        paymentStatus: PaymentStatus.SUCCESS,
      });
    }
    await service.createMany(upsellReports);
    const testData = await service.searchUniqueField({
      keyword: 'magic',
      field: 'offerName',
    });
    expect(testData).toBeDefined();
    expect(testData.length).toEqual(1);
  });
});
