import { Test, TestingModule } from '@nestjs/testing';
import { PaymentChargifyService } from './payments.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../test/utils/db.handler';
import { PaymentsChargifyModule } from './payments.module';
import { ConfigModule } from '@nestjs/config';
import { CustomersModule } from '@/customers/customers/customers.module';
import { Customer, PaymentProfiles } from '../chargify/domain/types';
import { faker } from '@faker-js/faker';

const mockCustomerInfo = () =>
  Promise.resolve(<Customer>{
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    cc_emails: null,
    organization: null,
    reference: null,
    id: faker.datatype.uuid(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
    address: faker.address.streetAddress(),
    address_2: null,
    city: faker.address.city(),
    state: faker.address.state(),
    state_name: faker.address.state(),
    zip: faker.address.zipCode(),
    country: faker.address.country(),
    country_name: faker.address.country(),
    phone: faker.phone.number(),
    verified: false,
    portal_customer_created_at: null,
    portal_invite_last_sent_at: null,
    portal_invite_last_accepted_at: null,
    tax_exempt: false,
    vat_number: null,
    parent_id: null,
    locale: null,
  });

const generateMockPaymentProfile = () => {
  return {
    id: faker.datatype.number(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    masked_card_number: faker.finance.creditCardNumber('visa'),
    card_type: 'visa',
    expiration_month: faker.datatype.number({ min: 1, max: 12 }),
    expiration_year: faker.datatype.number({ min: 2022, max: 2055 }),
    customer_id: faker.datatype.number(),
    current_vault: 'bogus',
    vault_token: faker.random.alphaNumeric(5),
    billing_address: null,
    billing_city: null,
    billing_state: null,
    billing_zip: null,
    billing_country: null,
    customer_vault_token: null,
    billing_address_2: null,
    site_gateway_setting_id: null,
    payment_type: 'credit_card',
    disabled: false,
    gateway_handle: null,
  };
};

describe('PaymentChargifyService', () => {
  let service: PaymentChargifyService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        CustomersModule,
        PaymentsChargifyModule,
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
    service = module.get(PaymentChargifyService);
  });

  it('Payment service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return payment list successfully', async () => {
    jest.spyOn(service, 'getCustomerInfoFromEmail').mockImplementation(() => {
      return mockCustomerInfo();
    });

    jest
      .spyOn(service, 'getPaymentProfilesFromChargify')
      .mockImplementation(() => {
        return Promise.resolve([
          { payment_profile: generateMockPaymentProfile() },
        ]);
      });

    const result = await service.getPaymentProfilesListFromEmail(
      'johndoe@authorify.com',
    );
    expect(service.getCustomerInfoFromEmail).toBeCalled();
    expect(service.getPaymentProfilesFromChargify).toBeCalled();
    expect(result).toHaveLength(1);
  });

  it('should return payment list without duplicate payment profiles', async () => {
    jest
      .spyOn(service, 'getCustomerInfoFromEmail')
      .mockImplementation(() => mockCustomerInfo());

    jest
      .spyOn(service, 'getPaymentProfilesFromChargify')
      .mockImplementation(() => {
        return Promise.resolve([
          { payment_profile: generateMockPaymentProfile() },
          { payment_profile: generateMockPaymentProfile() },
        ]);
      });

    const result = await service.getPaymentProfilesListFromEmail(
      'johndoe@authorify.com',
    );
    expect(service.getCustomerInfoFromEmail).toBeCalled();
    expect(service.getPaymentProfilesFromChargify).toBeCalled();
    expect(result).toHaveLength(2);
  });

  it('should return empty array if no payment profiles', async () => {
    jest.spyOn(service, 'getCustomerInfoFromEmail').mockImplementation(() => {
      return mockCustomerInfo();
    });

    jest
      .spyOn(service, 'getPaymentProfilesFromChargify')
      .mockImplementation(() => {
        return Promise.resolve(<PaymentProfiles[]>[]);
      });

    const result = await service.getPaymentProfilesListFromEmail(
      'johndoe@authorify.com',
    );
    expect(service.getCustomerInfoFromEmail).toBeCalled();
    expect(service.getPaymentProfilesFromChargify).toBeCalled();
    expect(result).toEqual([]);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
