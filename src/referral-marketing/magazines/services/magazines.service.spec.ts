import { Test } from '@nestjs/testing';
import { MagazinesModule } from '@/referral-marketing/magazines/magazines.module';
import { MagazinesService } from '@/referral-marketing/magazines/services/magazines.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../../test/utils/db.handler';
import { CustomersModule } from '@/customers/customers/customers.module';
import { CustomersService } from '@/customers/customers/customers.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { ConfigModule } from '@nestjs/config';
import { CmsService } from '@/cms/cms/cms.service';
import { CmsServiceMock } from '@/cms/cms/mocks/cms.service.mock';
import { cmsMagazineResponseMock } from '@/cms/cms/mocks/data.mocked';
import { CreateCustomerDto } from '@/customers/customers/dto/create-customer.dto';

describe.skip('Referral Marketing - Magazine', () => {
  let magazinesService: MagazinesService;
  let customersService: CustomersService;
  let customer: CustomerDocument;
  let extraCustomer: CustomerDocument;

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
      .overrideProvider(CmsService)
      .useClass(CmsServiceMock)
      .compile();

    magazinesService = module.get<MagazinesService>(MagazinesService);
    customersService = module.get<CustomersService>(CustomersService);

    customer = await customersService.create(<CreateCustomerDto>{
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

    extraCustomer = await customersService.create(<CreateCustomerDto>{
      email: 'johndoe@authorify.com',
      firstName: 'john',
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
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should define magazineService', () => {
    expect(magazinesService).toBeDefined();
  });

  describe('MagazineService - Create', () => {
    it('Should create a new magazine', async () => {
      const magazine = await magazinesService.create(customer, {
        magazineId: 1,
      });

      expect(magazine).toBeDefined();
      expect(magazine.customer).toBe(customer._id);
      expect(magazine.magazineId).toBe(1);
      expect(magazine.createdByAutomation).toBe(false);
    });

    it('Should throw error when trying to create magazine with duplicated magazineId', async () => {
      await expect(
        magazinesService.create(customer, {
          magazineId: 1,
        }),
      ).rejects.toThrow('magazine already created');
    });

    it('Should be able to create magazine with different customer', async () => {
      const magazine = await magazinesService.create(extraCustomer, {
        magazineId: 1,
      });

      expect(magazine).toBeDefined();
      expect(magazine.customer).toBe(extraCustomer._id);
      expect(magazine.magazineId).toBe(1);
    });

    it('should receive created by automation as true', async () => {
      const magazine = await magazinesService.create(extraCustomer, {
        magazineId: 2,
        createdByAutomation: true,
      });

      expect(magazine).toBeDefined();
      expect(magazine.customer).toBe(extraCustomer._id);
      expect(magazine.magazineId).toBe(2);
      expect(magazine.createdByAutomation).toBe(true);
    });
  });

  describe('MagazineService - FindAll', () => {
    it('Should return all magazines', async () => {
      const magazines = await magazinesService.findAll({ customer });

      expect(magazines).toBeDefined();
      expect(magazines.length).toBe(1);
    });

    it('Should not receive magazine from other customer', async () => {
      const extraMagazines = await magazinesService.findAll({
        customer: extraCustomer,
      });
      expect(extraMagazines).toBeDefined();
      expect(extraMagazines.length).toBe(2);

      const magazines = await magazinesService.findAll({ customer });
      expect(magazines).toBeDefined();
      expect(magazines.length).toBe(1);
    });
  });

  describe('MagazineService - FindOne', () => {
    it('Should return magazine', async () => {
      const {
        month,
        year,
        customer: customerId,
      } = await magazinesService.create(customer, {
        magazineId: 2,
      });

      const magazine = await magazinesService.findOne(customer, YEAR, MONTH);

      expect(magazine).toBeDefined();
      expect(year).toEqual(YEAR);
      expect(month).toEqual('JUN');
      expect(magazine.customer.toString()).toBe(customerId.toString());
    });

    it('Should throw error when trying to find magazine with invalid id', async () => {
      await expect(
        magazinesService.findOne(customer, YEAR, 'december'),
      ).rejects.toThrow('magazine not found');
    });

    it('Should throw error when trying to find magazine with invalid customer', async () => {
      await magazinesService.create(extraCustomer, {
        magazineId: 3,
      });

      await expect(
        magazinesService.findOne(customer, YEAR, 'december'),
      ).rejects.toThrow('magazine not found');
    });
  });

  describe('MagazineService - Update', () => {
    it('should update an existing magazine', async () => {
      const magazine = await magazinesService.create(customer, {
        magazineId: 4,
      });
      expect(magazine).toBeDefined();

      const page = 0;
      const formKeyword = 'backInsideCover-option-3';
      const updateResponse = await magazinesService.update(
        customer,
        YEAR,
        MONTH,
        {
          selection: {
            page,
            formKeyword,
            dynamicFields: [],
          },
        },
      );
      expect(updateResponse).toBeDefined();

      const updatedMagazine = await magazinesService.findOne(
        customer,
        YEAR,
        MONTH,
      );
      expect(updatedMagazine).toBeDefined();
      expect(updatedMagazine.selections).toHaveLength(1);
      expect(updatedMagazine.selections[0]).toBeDefined();
      expect(updatedMagazine.selections[0].page).toEqual(page);
      expect(updatedMagazine.selections[0].formKeyword).toEqual(formKeyword);
      expect(updatedMagazine.covers).toHaveLength(1);
      expect(updatedMagazine.covers[0]).toBeDefined();
      expect(updatedMagazine.covers[0].order).toEqual(page);
      expect(updatedMagazine.covers[0].name).toEqual(formKeyword);
    });

    it('should add a new selection to selection array on update', async () => {
      const page = 1;
      const formKeyword = 'frontCover-option-3';
      const updateResponse = await magazinesService.update(
        customer,
        YEAR,
        MONTH,
        {
          selection: {
            page,
            formKeyword,
            dynamicFields: [],
          },
        },
      );
      expect(updateResponse).toBeDefined();

      const updatedMagazine = await magazinesService.findOne(
        customer,
        YEAR,
        MONTH,
      );

      expect(updatedMagazine).toBeDefined();
      expect(updatedMagazine.selections).toHaveLength(2);
      expect(updatedMagazine.selections[1]).toBeDefined();
      expect(updatedMagazine.selections[1].page).toEqual(page);
      expect(updatedMagazine.selections[1].formKeyword).toEqual(formKeyword);
      expect(updatedMagazine.covers).toHaveLength(2);
      expect(updatedMagazine.covers[1]).toBeDefined();
      expect(updatedMagazine.covers[1].order).toEqual(page);
      expect(updatedMagazine.covers[1].name).toEqual(formKeyword);
    });

    it('should override duplicated pages', async () => {
      const page = 1;
      const formKeyword = 'frontCover-option-1';
      const updateResponse = await magazinesService.update(
        customer,
        YEAR,
        MONTH,
        {
          selection: {
            page,
            formKeyword,
            dynamicFields: [],
          },
        },
      );
      expect(updateResponse).toBeDefined();

      const updatedMagazine = await magazinesService.findOne(
        customer,
        YEAR,
        MONTH,
      );

      expect(updatedMagazine).toBeDefined();
      expect(updatedMagazine.selections).toHaveLength(2);
      expect(updatedMagazine.selections[1]).toBeDefined();
      expect(updatedMagazine.selections[1].page).toEqual(page);
      expect(updatedMagazine.selections[1].formKeyword).toEqual(formKeyword);
      expect(updatedMagazine.covers).toHaveLength(2);
      expect(updatedMagazine.covers[1]).toBeDefined();
      expect(updatedMagazine.covers[1].order).toEqual(page);
      expect(updatedMagazine.covers[1].name).toEqual(formKeyword);
    });
  });
});
