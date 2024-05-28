import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CustomerTemplatesModule } from '@/campaigns/email-campaigns/customer-templates/customer-templates.module';

describe.skip('Customer Templates', () => {
  let app: INestApplication;
  // let service: CustomerTemplatesService;
  const baseUrl = '/email-campaigns/customer-templates';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CustomerTemplatesModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('GET /', () => {
    return request(app.getHttpServer())
      .get(baseUrl)
      .expect(200)
      .expect('This action returns all customerTemplates');
  });

  afterAll(async () => {
    await app.close();
  });
});
