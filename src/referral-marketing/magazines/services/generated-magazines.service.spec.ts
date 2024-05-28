import { Test } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../../test/utils/db.handler';
import { MagazinesModule } from '@/referral-marketing/magazines/magazines.module';
import { GeneratedMagazinesService } from '@/referral-marketing/magazines/services/generated-magazines.service';
import { MagazineDocument } from '@/referral-marketing/magazines/schemas/magazine.schema';
import { MagazinesService } from '@/referral-marketing/magazines/services/magazines.service';
import { CustomersService } from '@/customers/customers/customers.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { GenerationStatus } from '../schemas/generated-magazine.schema';
import { cmsMagazineResponseMock } from '@/cms/cms/mocks/data.mocked';
import { SnsService } from '@/internal/libs/aws/sns/sns.service';
import { SnsServiceMock } from '@/internal/libs/aws/sns/mocks/sns.service.mock';
import { ConfigModule } from '@nestjs/config';
import { CustomersModule } from '@/customers/customers/customers.module';
import { CmsService } from '@/cms/cms/cms.service';
import { CmsServiceMock } from '@/cms/cms/mocks/cms.service.mock';

describe('Referral Marketing - GeneratedMagazine', () => {
  let generatedMagazineService: GeneratedMagazinesService;
  let magazinesService: MagazinesService;
  let customersService: CustomersService;
  let magazine: MagazineDocument;
  let customer: CustomerDocument;

  const MONTH = cmsMagazineResponseMock.attributes.month;
  const YEAR = cmsMagazineResponseMock.attributes.year;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
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
        MagazinesModule,
        CustomersModule,
      ],
    })
      .overrideProvider(SnsService)
      .useClass(SnsServiceMock)
      .overrideProvider(CmsService)
      .useClass(CmsServiceMock)
      .compile();

    generatedMagazineService = module.get<GeneratedMagazinesService>(
      GeneratedMagazinesService,
    );
    magazinesService = module.get<MagazinesService>(MagazinesService);
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
    });
    magazine = await magazinesService.create(customer, { magazineId: 1 });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should define generatedMagazineService', () => {
    expect(generatedMagazineService).toBeDefined();
  });

  describe('GeneratedMagazine - Create', () => {
    it('should create a new generated magazine', async () => {
      const generatedMagazine = await generatedMagazineService.create(
        customer,
        { year: YEAR, month: MONTH },
      );

      expect(generatedMagazine).toBeDefined();
      expect(generatedMagazine.active).toBe(true);
      expect(generatedMagazine.url).toBe('');
      expect(typeof generatedMagazine.magazine).toBe('object');
      expect(generatedMagazine.magazine).toBeDefined();
      expect(generatedMagazine.status).toEqual(GenerationStatus.PENDING);
      expect(generatedMagazine.createdByAutomation).toBe(false);
    });

    it('should not create generatedMagazines with invalid magazine', async () => {
      await expect(
        generatedMagazineService.create(customer, {
          year: YEAR,
          month: 'december',
        }),
      ).rejects.toThrow('magazine not found');
    });

    it('should create generatedMagazine with created by automation as true', async () => {
      const generatedMagazine = await generatedMagazineService.create(
        customer,
        { year: YEAR, month: MONTH, createdByAutomation: true },
      );

      expect(generatedMagazine).toBeDefined();
      expect(generatedMagazine.active).toBe(true);
      expect(generatedMagazine.url).toBe('');
      expect(typeof generatedMagazine.magazine).toBe('object');
      expect(generatedMagazine.magazine).toBeDefined();
      expect(generatedMagazine.status).toEqual(GenerationStatus.PENDING);
      expect(generatedMagazine.createdByAutomation).toBe(true);
    });
  });

  // TODO: implement findone

  describe('GeneratedMagazine - List', () => {
    it('should list of generatedMagazines', async () => {
      const generatedMagazines = await generatedMagazineService.findAll(
        customer,
      );
      expect(generatedMagazines).toBeDefined();
      expect(generatedMagazines).toHaveLength(1);
    });
  });

  describe('GeneratedMagazine - Update', () => {
    it('should update generatedMagazine with additional information', async () => {
      const generatedMagazines = await generatedMagazineService.findAll(
        customer,
      );
      expect(generatedMagazines.length).toBeGreaterThan(0);

      const generatedMagazine = generatedMagazines.find(
        (gm) => gm.active === true,
      );
      expect(generatedMagazine).toBeDefined();

      const updateResponse = await generatedMagazineService.update(
        customer,
        { additionalInformation: 'some important information' },
        YEAR,
        MONTH,
      );
      expect(updateResponse).toBeDefined();
      expect(updateResponse.additionalInformation).toEqual(
        'some important information',
      );
      expect(updateResponse.active).toBeTruthy();
    });
  });

  describe('GeneratedMagazine - StatusUpdate', () => {
    it('should update GeneratedMagazine status', async () => {
      const generatedMagazines = await generatedMagazineService.findAll(
        customer,
      );
      expect(generatedMagazines.length).toBeGreaterThan(0);

      const generatedMagazine = generatedMagazines.find(
        (gm) => gm.active === true,
      );
      expect(generatedMagazine).toBeDefined();

      const response = await generatedMagazineService.updateStatus(
        generatedMagazine._id.toString(),
        { status: GenerationStatus.DONE },
      );
      expect(response).toBeDefined();
      expect(response.status).toBe(GenerationStatus.DONE);

      const updatedGeneratedMagazine = await generatedMagazineService.findOne(
        customer,
        YEAR,
        MONTH,
      );

      expect(updatedGeneratedMagazine.active).toBe(true);
      expect(updatedGeneratedMagazine.status).toBe(GenerationStatus.DONE);
    });
  });
});
