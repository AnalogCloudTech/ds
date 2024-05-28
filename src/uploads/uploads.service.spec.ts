import { Test } from '@nestjs/testing';
import { UploadsService } from '@/uploads/uploads.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/utils/db.handler';
import { UploadsModule } from '@/uploads/uploads.module';
import { ConfigModule } from '@nestjs/config';
import { CustomersService } from '@/customers/customers/customers.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CustomersModule } from '@/customers/customers/customers.module';

describe('Uploads - UploadService', () => {
  let uploadsService: UploadsService;
  let customerService: CustomersService;
  let customer: CustomerDocument;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => {
              return {};
            },
          ],
        }),
        UploadsModule,
        CustomersModule,
      ],
    }).compile();

    uploadsService = module.get<UploadsService>(UploadsService);
    customerService = module.get<CustomersService>(CustomersService);

    customer = await customerService.create({
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
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should define uploadService', () => {
    expect(uploadsService).toBeDefined();
  });

  describe('UploadService - Create', () => {
    it('should create a new upload', async () => {
      const upload = await uploadsService.create(
        customer,
        {
          ext: 'jpg',
          bucket: 'bucket',
          contentType: 'image/jpeg',
          context: 'afy-ui',
          isPrivate: false,
        },
        'mybucketurl?mykey=mykey',
      );
      expect(upload).toBeDefined();
    });
  });

  describe('UploadService - FindAll', () => {
    it.skip('should find all uploads', () => null);
    it.skip('should find all and filter by context', () => null);
    it.skip('should find all and filter by extension', () => null);
    it.skip('should find all and filter by private', () => null);
  });

  describe('UploadService - FindOne', () => {
    it.skip('should find one upload', () => null);
  });
});
