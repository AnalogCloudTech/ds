import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { rootMongooseTestModule } from '../../utils/db.handler';
import { CustomerEventsModule } from '@/customers/customer-events/customer-events.module';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { MockCustomerPipe } from '../../utils/mock.user';
import * as request from 'supertest';
import { CustomerEventDocument } from '@/customers/customer-events/schemas/customer-events.schema';
import { Events } from '@/customers/customer-events/domain/types';

describe('Customer Events', () => {
  let app: INestApplication;
  const baseUrl = '/customer-events';

  const createEvent = async (): Promise<request.Test> => {
    const response = await request(app.getHttpServer())
      .post(`${baseUrl}/auto-login-success`)
      .send();
    return response;
  };

  const getEvents = async (): Promise<request.Test> => {
    const response = await request(app.getHttpServer()).get(baseUrl).send();
    return response;
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), CustomerEventsModule],
    })
      .overridePipe(CustomerPipeByIdentities)
      .useClass(MockCustomerPipe)
      .compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  describe('POST /auto-login-success', function () {
    it('Should receive 201 and a new CustomerEventDocument with auto-login Event', async () => {
      const response = await createEvent();
      expect(response.status).toEqual(201);

      const customerEventDocument: CustomerEventDocument = response.body;

      expect(customerEventDocument.event).toEqual(Events.AUTO_LOGIN_SUCCESS);
      expect(customerEventDocument.metadata).toBeNull();
    });
  });

  describe('GET /', function () {
    it('Get all events from current customer', async () => {
      const response = await getEvents();
      expect(response.status).toEqual(200);

      const customerEventsDocuments: Array<CustomerEventDocument> =
        response.body.data;
      const pagination = response.body.meta;

      expect(customerEventsDocuments).toHaveLength(1);
      expect(pagination.total).toEqual(1);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
