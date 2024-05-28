import { LeadsService } from '@/campaigns/email-campaigns/leads/leads.service';
import { Test } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../../test/utils/db.handler';
import { LeadsModule } from '@/campaigns/email-campaigns/leads/leads.module';
import { CreateLeadDto } from '@/campaigns/email-campaigns/leads/dto/create-lead.dto';
import { LeadDocument } from '@/campaigns/email-campaigns/leads/schemas/lead.schema';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { FilterQuery, Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { UpdateLeadDto } from '@/campaigns/email-campaigns/leads/dto/update-lead.dto';
import { CustomersModule } from '@/customers/customers/customers.module';
import { ConfigModule } from '@nestjs/config';
import { SegmentsService } from '@/campaigns/email-campaigns/segments/segments.service';

describe('Leads Services', () => {
  let leadsService: LeadsService;
  const mockAttachSegments = jest.fn((leads) => Promise.resolve(leads));

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        CustomersModule,
        LeadsModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => {
              return {};
            },
          ],
        }),
      ],
    })
      .overrideProvider(SegmentsService)
      .useValue({ attachSegments: mockAttachSegments })
      .compile();

    leadsService = module.get<LeadsService>(LeadsService);
  });

  const createLead = async (
    numberOfLeads = 1,
    toOverride?: Partial<CreateLeadDto>,
  ): Promise<Array<LeadDocument>> => {
    const promises: Array<Promise<LeadDocument>> = [];
    const customerEmail = faker.internet.email();
    const id = new Types.ObjectId();
    for (let i = 0; i < numberOfLeads; i++) {
      const customer = <CustomerDocument>{
        _id: id,
        email: customerEmail,
      };
      const data: CreateLeadDto = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        segments: [1, 2],
        allSegments: false,
        customerEmail,
        address: {
          address1: faker.address.streetAddress(),
          address2: faker.address.secondaryAddress(),
          city: faker.address.city(),
          country: faker.address.country(),
          zip: faker.address.countryCode(),
          state: faker.address.state(),
        },
        bookId: '123',
        isValid: true,
        phone: faker.phone.number(),
        unsubscribed: false,
        ...toOverride,
      };
      promises.push(leadsService.create(data, customer));
    }

    return Promise.all(promises);
  };

  it('Leads service should be defined', () => {
    expect(leadsService).toBeDefined();
  });

  it('All new leads should be valid', async () => {
    const numberOfLeads = 5;
    const leads = await createLead(numberOfLeads);
    const countValidLeads = leads.filter((lead) => lead.isValid).length;
    expect(numberOfLeads).toEqual(leads.length);
    expect(numberOfLeads).toEqual(countValidLeads);
  });

  it('If some lead are invalid, the next should be invalid too, even if try to create as a valid', async () => {
    const [newLead] = await createLead(1, { isValid: true });
    expect(newLead.isValid).toBeTruthy();

    const updatedLead = await leadsService.update(newLead._id, <UpdateLeadDto>{
      isValid: false,
    });

    expect(updatedLead.isValid).toBeFalsy();

    const [newInvalidLead] = await createLead(1, {
      isValid: true,
      email: updatedLead.email,
    });

    expect(newInvalidLead.isValid).toBeFalsy();
  });

  it('If Some lead get bounced, everyone with same email should bounce too', async () => {
    const email = faker.internet.email();
    const numberOfLeads = 5;
    await createLead(numberOfLeads, { email });
    await leadsService.updateMany({ email }, { isValid: false });

    const allBounced = await leadsService.findLeadsByEmail(email);
    const bounceCount = allBounced.filter((lead) => !lead.isValid).length;

    expect(numberOfLeads).toBe(bounceCount);
  });

  it('Should lead start with deletedAt equals null ', async () => {
    const [newLead] = await createLead(1);
    expect(newLead.deletedAt).toBeNull();
  });

  it('Should soft deleted lead not be found and also deleted in cascade', async () => {
    const [newLead] = await createLead(1);
    const customer = <CustomerDocument>{
      _id: newLead.customer,
    };
    await leadsService.removeUserLead(customer, [], newLead._id.toString());

    const leads = await leadsService.find({
      email: newLead.email,
      customer: newLead.customer,
    });

    expect(leads).toHaveLength(0);
  });

  it('Should all soft deleted leads be found by trashed method', async () => {
    const email = faker.internet.email();
    const numberOfLeads = 5;
    const all = await createLead(numberOfLeads, { email });
    const lead = all[0];

    const customer = <CustomerDocument>{
      _id: lead.customer,
    };

    await leadsService.removeUserLead(customer, [], lead._id.toString());
    const trashedFilter: FilterQuery<LeadDocument> = {
      deletedAt: { $ne: null },
      email: { $eq: email },
    };
    const leadsTrashed = await leadsService.find(trashedFilter);
    expect(leadsTrashed).toHaveLength(numberOfLeads);
  });

  it('Should findAllPaginated do not return deleted leads', async () => {
    const numberOfLeads = 5;
    const all = await createLead(numberOfLeads);
    const lead = all[0];

    const customer = <CustomerDocument>{
      _id: lead.customer,
    };

    await leadsService.removeUserLead(customer, [], lead._id.toString());
    const leads = await leadsService.findAllPaginated([], customer, 0, 10);
    expect(mockAttachSegments).toHaveBeenCalled();
    expect(leads.data).toHaveLength(numberOfLeads - 1);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
