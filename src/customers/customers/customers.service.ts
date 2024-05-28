import {
  PaginatorSchema,
  PaginatorSchematicsInterface,
} from '@/internal/utils/paginator';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Uuid4 } from 'id128';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { DisService } from '@/legacy/dis/dis.service';
import { CustomersRepository } from '@/customers/customers/customers.repository';
import { UpdateCustomerFlippingBookPreferences } from '@/customers/customers/dto/update-customer.dto';
import { CreateCustomerSubscriptionDto } from '@/customers/customers/dto/create-customer-subscription.dto';
import { CustomerSubscriptionDocument } from '@/customers/customers/schemas/customer-subscription.schema';
import { UnsubscriptionReportDto } from '@/customers/customers/dto/unsubscription-report.dto';
import { CustomerId, Status } from './domain/types';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateBookPreferencesDto } from './dto/update-book-preferences.dto';
import {
  Customer,
  CustomerDocument,
  LandingPageWebsite,
} from './schemas/customer.schema';
import { UpdateLandingPageProfileDto } from './dto/update-landing-page-profile.dto';
import { CreateAttributesDto } from './dto/attributesDto';
import { isNull } from 'lodash';
import { SubscriptionsRepository } from './repositories/subscriptions.repository';
import { SchemaId } from '@/internal/types/helpers';
import { SEARCH_UNIQUE_FIELD_DEFAULT_LIMIT } from '@/internal/common/repository/types';
import { LoggerPayload } from '@/internal/utils/logger';
import { DateTime } from 'luxon';
import { CONTEXT_CUSTOMER_SUBSCRIPTION } from '@/internal/common/contexts';
import { FindCustomerByQueryDto } from '@/customers/customers/dto/find-customer-by-query.dto';

@Injectable()
export class CustomersService {
  private readonly logger: Logger;

  constructor(
    @InjectModel(Customer.name)
    private model: Model<CustomerDocument>,
    private readonly disService: DisService,
    private readonly customersRepository: CustomersRepository,
    private readonly customerSubscriptionRepository: SubscriptionsRepository,
  ) {
    this.logger = new Logger(CustomersService.name);
  }

  public async findAll(
    filter: FilterQuery<CustomerDocument> = {},
    options: QueryOptions = { lean: true },
  ) {
    return this.customersRepository.findAll(filter, options);
  }

  async getAllCustomers(
    page = 0,
    perPage = 15,
  ): Promise<PaginatorSchematicsInterface<CustomerDocument>> {
    const skip = page * perPage;
    const total = await this.model.countDocuments().exec();
    const customers: Array<CustomerDocument> = await this.model
      .find()
      .limit(perPage)
      .skip(skip)
      .exec();

    return PaginatorSchema.build<CustomerDocument>(
      total,
      customers,
      page,
      perPage,
    );
  }

  async create(dto: CreateCustomerDto): Promise<CustomerDocument> {
    return new this.model(dto).save();
  }

  async syncCustomer(
    dto: CreateCustomerDto,
    status: Status,
    customerEntity?: CustomerDocument,
  ): Promise<CustomerDocument> {
    if (!customerEntity) {
      const customerData = { status, ...dto };
      customerEntity = await new this.model(customerData).save();
    }

    const forceUpdate = status === Status.PENDING;

    const isMissingDependencies = this.isMissingDependencies(customerEntity);
    if (isMissingDependencies || forceUpdate) {
      const loginToken = Uuid4.generate().toCanonical();
      let passwordEncrypted: string;
      if (dto.password?.length) {
        passwordEncrypted = await bcrypt.hash(dto.password, 10);
      }
      const dependencies = await this.disService.syncDependencies(
        dto,
        loginToken,
        passwordEncrypted,
      );
      customerEntity = await this.model.findByIdAndUpdate(
        customerEntity._id,
        { ...dependencies, ...dto },
        { new: true },
      );
    }

    return customerEntity;
  }

  async findByEmail(email: string): Promise<CustomerDocument> {
    const filter = {
      email: { $eq: email },
    };
    return this.model.findOne(filter).exec();
  }

  async landingPageDetailsByEmail(hubSpotEmails: string[]) {
    const result = await this.model.find({ email: { $in: hubSpotEmails } });
    return result;
  }

  async findByIdentities(identities: Array<string>): Promise<CustomerDocument> {
    return this.model.findOne({ email: { $in: identities } }).exec();
  }

  findById(id: CustomerId): Promise<CustomerDocument> {
    return this.model.findById(id).exec();
  }

  findOne(
    filter: FilterQuery<CustomerDocument>,
    options = <QueryOptions>{ lean: true },
  ): Promise<CustomerDocument> {
    return this.model.findOne(filter, {}, options).exec();
  }

  async authenticate(email: string, password: string): Promise<boolean> {
    return this.disService.authenticateCustomerThroughHubspot(email, password);
  }

  saveLandingPageProfile(
    id: CustomerId,
    dto: UpdateLandingPageProfileDto,
  ): Promise<CustomerDocument> {
    return this.model
      .findByIdAndUpdate(id, { landingPageProfile: dto }, { new: true })
      .exec();
  }

  saveCampaignAttributes(
    id: CustomerId,
    dto: CreateAttributesDto | null,
  ): Promise<CustomerDocument> {
    return this.model
      .findByIdAndUpdate(id, { attributes: dto }, { new: true })
      .exec();
  }

  deleteAttribute(id: CustomerId) {
    return this.model
      .findByIdAndUpdate(id, { attributes: null }, { new: true })
      .exec();
  }

  saveOnboardBookPreferences(
    id: CustomerId,
    preferences: UpdateBookPreferencesDto,
  ): Promise<CustomerDocument> {
    return this.model
      .findByIdAndUpdate(
        id,
        { preferences },
        {
          new: true,
        },
      )
      .exec();
  }

  private isMissingDependencies(customer: CustomerDocument): boolean {
    return !Boolean(customer.hubspotId) || !Boolean(customer.stripeId);
  }

  updateFlippingBookPreferences(
    id: SchemaId,
    dto: UpdateCustomerFlippingBookPreferences,
  ) {
    return this.customersRepository.update(id, {
      flippingBookPreferences: dto,
    });
  }

  async createSubscriptionorUnsubscription(
    email: string,
    subscriptionId: string,
    status: string,
    previousState: string,
  ): Promise<CustomerSubscriptionDocument> {
    const customerExists = await this.customersRepository.findOne({
      email,
    });
    this.logger.log(
      {
        payload: <LoggerPayload>{
          email,
          method: 'createSubscriptionorUnsubscription',
          usageDate: DateTime.now(),
          customerExists,
        },
      },
      CONTEXT_CUSTOMER_SUBSCRIPTION,
    );
    if (!customerExists) {
      throw new HttpException(
        { message: 'customer not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    const dto = <CreateCustomerSubscriptionDto>{
      customer: customerExists._id,
      status: status,
      subscriptionId: subscriptionId,
      previousState: previousState,
    };
    return this.customerSubscriptionRepository.upsertSubscription(dto);
  }

  async unsubscriptionReport(
    dto: UnsubscriptionReportDto,
  ): Promise<Array<CustomerSubscriptionDocument>> {
    return this.customerSubscriptionRepository.unsubscriptionReport(dto);
  }

  async update(customer: CustomerDocument, dto: Partial<CustomerDocument>) {
    if (!customer) {
      throw new HttpException(
        { message: 'missing customer' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.customersRepository.update(customer._id, dto);
  }

  async publicUpdate(email: string, avatar: string) {
    const customerExists = await this.customersRepository.findOne({ email });
    if (!customerExists) {
      throw new HttpException(
        { message: 'customer not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return this.customersRepository.update(customerExists._id, {
      avatar,
    });
  }

  public async listByNameOrEmail(
    nameOrEmail: string,
  ): Promise<Array<Partial<CustomerDocument>> | null> {
    return this.customersRepository.listByNameOrEmail(nameOrEmail);
  }

  public async unsubscribeSMSRemindersByPhoneNumber(
    phone: string,
  ): Promise<Customer | null> {
    const phoneWithoutCode = phone.replace('+1', '');
    const customer = await this.customersRepository.findByPhone(
      phoneWithoutCode,
    );

    const update = {
      $set: {
        'smsPreferences.schedulingCoachReminders': false,
      },
    };

    if (isNull(customer)) {
      return null;
    }

    return this.customersRepository.update(customer._id, update);
  }

  public acceptedReceiveSMSScheduleCoachReminders(
    customer: CustomerDocument,
  ): boolean {
    return Boolean(customer?.smsPreferences?.schedulingCoachReminders);
  }

  public async addLandingPageWebsite(
    customerId: SchemaId,
    dto: LandingPageWebsite,
  ) {
    const customer = await this.customersRepository.findOne({
      _id: customerId,
    });

    if (!customer) {
      throw new Error('customer not found');
    }

    /*
     * If customer do not have property landingPageProfile.generatedWebsites, then we set it as an array with the dto
     * If customer has property landingPageProfile.generatedWebsites, then we check if the dto is already in the array
     * If it is, then we update the dto in the array
     * If it is not, then we add the dto to the array
     */
    let opt: FilterQuery<CustomerDocument> = null;
    const website = customer?.landingPageProfile?.generatedWebsites;
    if (!customer?.landingPageProfile?.generatedWebsites) {
      opt = {
        $set: {
          'landingPageProfile.generatedWebsites': [dto],
        },
      };
    }

    if (!opt && customer?.landingPageProfile?.generatedWebsites && website) {
      const wf = website.find((w) => w.guideId === dto.guideId);
      if (wf) {
        opt = {
          $set: {
            'landingPageProfile.generatedWebsites': website.map((w) => {
              if (w.guideId === dto.guideId) {
                return dto;
              }
              return w;
            }),
          },
        };
      } else {
        opt = {
          $set: {
            'landingPageProfile.generatedWebsites': [...website, dto],
          },
        };
      }
    }

    return await this.customersRepository.update(customerId, opt);
  }

  public async getLandingPageWebsite(customerEmail: string, id: string) {
    const customer = await this.customersRepository.findOne({
      email: customerEmail,
    });

    if (!customer) {
      throw new Error('customer not found');
    }

    return customer?.landingPageProfile?.generatedWebsites?.find(
      (website) => website.guideId === id,
    );
  }

  public async searchUniqueField(
    keyword: string,
    field: string,
    limit = SEARCH_UNIQUE_FIELD_DEFAULT_LIMIT,
  ) {
    return this.customersRepository.searchUniqueField(keyword, field, limit);
  }

  public async findCustomerByQuery(dto: FindCustomerByQueryDto) {
    return this.customersRepository.findByQuery(dto);
  }
}
