import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../utils/db.handler';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { MockCustomerPipe } from '../../../utils/mock.user';
import { Test } from '@nestjs/testing';
import { MagazinesModule } from '../../../../src/referral-marketing/magazines/magazines.module';

describe('Magazines', () => {
  let app: INestApplication;
  const baseUrl = '/referral-marketing/magazine';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MagazinesModule],
    })
      .overridePipe(CustomerPipeByIdentities)
      .useClass(MockCustomerPipe)
      .compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  describe('POST /', () => {
    it('Should receive 400 because magazineId doesnt exists in CMS', async () => {
      await request(app.getHttpServer())
        .post(baseUrl)
        .send({
          magazineId: 1,
        })
        .expect(400);
    });
  });

  describe('GET /', () => {
    it('should receive an empty list', async () => {
      const response = await request(app.getHttpServer())
        .get(baseUrl)
        .expect(200);
      expect(response.body).toHaveLength(0);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
