import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { GeneratedMagazinesService } from '@/referral-marketing/magazines/services/generated-magazines.service';
import { MagazinesService } from '@/referral-marketing/magazines/services/magazines.service';
import { CustomersService } from '@/customers/customers/customers.service';
import { CmsService } from '@/cms/cms/cms.service';
import { UploadCustomMagazineDto } from '@/referral-marketing/magazines/dto/upload-custom-magazine.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import {
  MONTHLY_TURN_OVER_MAGAZINE_QUEUE,
  PERMANENT_LINKS_TURN_OVER,
} from '@/referral-marketing/magazines/constants';
import { CurrentMagazineMonthDate } from '@/referral-marketing/magazines/dto/turn-month.dto';
import { UpdateMagazineAdminDto } from '@/referral-marketing/magazines/dto/update-magazine-admin.dto';
import {
  MagazineDocument,
  MagazineStatus,
} from '@/referral-marketing/magazines/schemas/magazine.schema';
import { UpdateMagazinesAdminDto } from '../dto/update-magazines-admin.dto';
import { CreateGeneratedMagazineDto } from '../dto/create-generated-magazine.dto';
import { UpdateMagazineDto } from '../dto/update-magazine.dto';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { GeneratedMagazinesRepository } from '../repositories/generated-magazines.repository';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { MagazinesRepository } from '../repositories/magazines.repository';
import { CustomerId } from '@/customers/customers/domain/types';

interface TurnMonthDto {
  currentData: {
    year: string;
    month: string;
  };
  lastData: {
    year: string;
    month: string;
  };
}

@Injectable()
export class ReferralMarketingAdminsService {
  constructor(
    private readonly generatedMagazinesService: GeneratedMagazinesService,
    private readonly magazinesService: MagazinesService,
    private readonly customersService: CustomersService,
    private readonly hubSpotService: HubspotService,
    private readonly generatedMagazinesRepository: GeneratedMagazinesRepository,
    private readonly magazinesRepository: MagazinesRepository,
    private readonly cmsService: CmsService,
    @Inject('logger')
    private readonly logger: Logger,
    @InjectQueue(MONTHLY_TURN_OVER_MAGAZINE_QUEUE) private magazineQueue: Queue,
    @InjectQueue(PERMANENT_LINKS_TURN_OVER) private permanentLinkQueue: Queue,
  ) {}

  async generateMagazine(
    dto: CreateGeneratedMagazineDto,
    createTicket = false,
    isPreview = false,
    customerEmail?: string,
    customerId?: CustomerId,
  ) {
    const customerQuery: FilterQuery<CustomerDocument> = {
      $or: [{ email: customerEmail }, { _id: customerId }],
    };

    const customer = await this.customersService.findOne(customerQuery);

    if (!customer) {
      throw new HttpException(
        { message: 'customer not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const magazine = await this.magazinesService.findOne(
      customer,
      dto.year,
      dto.month,
    );
    if (!magazine) {
      throw new HttpException(
        { message: 'magazine not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const magazineInfo = await this.cmsService.magazineDetails(
      magazine.magazineId,
    );

    const { selections } = magazine;
    const baseReplacers = await this.magazinesService.getBaseReplacers(
      magazine._id,
      customer._id,
    );

    const covers = await Promise.all(
      selections.map(async (selection) =>
        this.magazinesService.processCover(selection, magazineInfo),
      ),
    );

    await this.magazinesService.updateMag(
      magazine._id,
      {
        covers,
        baseReplacers,
        contentUrl: magazineInfo.attributes.pdf.data.attributes.url,
      },
      { new: true },
    );

    await this.generatedMagazinesService.updateGM(
      { customer, magazine, active: true },
      { active: false },
      { new: true },
    );

    return this.generatedMagazinesService.create(
      customer,
      dto,
      isPreview,
      createTicket,
    );
  }

  async uploadCustomCover(dto: UploadCustomMagazineDto) {
    const { userEmail, month, year, coversURL, magazineURL } = dto;

    const customer = await this.customersService.findByEmail(userEmail);

    if (!customer) {
      throw new HttpException(
        { message: 'customer not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const magazine = await this.magazinesService.first({
      customer: customer._id,
      month,
      year,
    });

    if (!magazine) {
      throw new HttpException(
        { message: 'magazine not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const generatedMagazines = await this.generatedMagazinesService.find({
      customer: customer._id,
      magazine: magazine._id,
      active: true,
    });
    const generatedMagazine = generatedMagazines.pop();

    if (!generatedMagazine) {
      throw new HttpException(
        {
          message:
            'customer does not have a generated magazine to be overridden',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return this.generatedMagazinesService.updateGM(
      { _id: generatedMagazine._id },
      { coversOnlyUrl: coversURL, url: magazineURL },
      { new: true },
    );
  }

  /**
   * @returns - The Generated Magazine of the member for the given month and year
   */
  async getGeneratedMagazine(
    customerId: CustomerId,
    year: string,
    month: string,
  ) {
    const customer = await this.customersService.findById(customerId);

    const magazine = await this.magazinesService.findOne(customer, year, month);

    if (!magazine) {
      throw new HttpException(
        { message: 'magazine not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return this.generatedMagazinesRepository.findOne(customer, magazine);
  }

  /**
   * @returns - The Magazine of the member for the given month and year
   */
  async getMagazine(customerId: CustomerId, year: string, month: string) {
    const customer = await this.customersService.findById(customerId);

    if (!customer) {
      throw new HttpException(
        { message: 'customer not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const magazine = await this.magazinesService.findOne(customer, year, month);

    if (!magazine) {
      throw new HttpException(
        { message: 'magazine not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return magazine;
  }

  /**
   * Patch the Magazine of the member for the given month and year
   * @returns - Updated Magazine of the member for the given month and year
   */
  async updateMagazine(
    customerId: CustomerId,
    year: string,
    month: string,
    dto: UpdateMagazineDto,
  ) {
    const customer = await this.customersService.findById(customerId);

    if (!customer) {
      throw new HttpException(
        { message: 'customer not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return this.magazinesService.update(customer, year, month, dto);
  }

  async createTicket(
    generatedMagazineId: string,
    customerId: CustomerId,
    adminUser: CustomerDocument,
  ) {
    const customer = await this.customersService.findById(customerId);
    const admin = await this.customersService.findById(adminUser._id);

    if (!customer) {
      throw new HttpException(
        { message: 'customer not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const generatedMagazine = await this.generatedMagazinesRepository.findById(
      generatedMagazineId,
      customer,
    );

    const {
      coversOnlyUrl,
      magazine,
      additionalInformation,
      customer: customerData,
      pageUrl,
    } = generatedMagazine;

    const { month: magazineMonth } = <MagazineDocument>magazine;

    const { email } = <CustomerDocument>customerData;
    const { firstName, lastName } = admin;
    const adminFullName = `${firstName} ${lastName}`;
    const ticket = await this.hubSpotService.createPrintQueueTicket({
      email,
      coverUrl: coversOnlyUrl,
      magazineMonth,
      additionalInformation,
      rmProofLink: customer.flippingBookPreferences.publicationUrl ?? '',
      rmMemberSiteLink: pageUrl ?? '',
      rmShippedMagazineLink:
        customer.flippingBookPreferences.permanentPublicationUrl ?? '',
      adminFullName,
    });

    if (!ticket.ticketId) {
      throw new HttpException(
        { message: 'error creating ticket' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return generatedMagazine;
  }

  /**
   * Returns the number of magazine which were scheduled for creation
   *
   *
   * @param dto - Object with current month, current year, last month and last year
   *
   * @returns - Number of jobs scheduled
   */
  public async scheduleMonthlyTurnOver(dto: TurnMonthDto) {
    try {
      const magazinesMap =
        await this.magazinesService.getMagazineCustomerWithoutMagazine(dto);

      const jobs = magazinesMap.map((data) => {
        return {
          data: {
            ...data,
            month: dto.currentData.month,
            year: dto.currentData.year,
          },
          opts: {
            removeOnComplete: true,
          },
        };
      });

      await this.magazineQueue.addBulk(jobs);

      return {
        message: 'jobs scheduled',
        jobs: jobs.length,
      };
    } catch (err) {
      this.logger.error(err);
      throw new HttpException(
        {
          message: 'error scheduling monthly turn over',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Returns the number of magazine which were scheduled for creation
   * the number of currently active jobs and the number of failed jobs
   *
   * @returns - Number of jobs scheduled, active and failed
   */
  public async getMonthlyTurnOverQueueCount() {
    const [count, active, failed] = await Promise.all([
      this.magazineQueue.count(),
      this.magazineQueue.getActiveCount(),
      this.magazineQueue.getFailedCount(),
    ]);

    return { count, active, failed };
  }

  /**
   * Update and return magazines with status sentToPrint
   *
   * @returns - Returns magazines updated to sentToPrint
   */
  public async manySendForPrinting({ month, year }: UpdateMagazinesAdminDto) {
    return this.magazinesService.updateMany(
      { month, year },
      { status: MagazineStatus.SENT_FOR_PRINTING },
      { new: true },
    );
  }

  /**
   * Update and return magazine with status sentToPrint
   *
   * @returns - Returns magazine updated to sentToPrint
   */
  public async singleSendForPrinting({
    month,
    year,
    customer,
  }: UpdateMagazineAdminDto) {
    return this.magazinesService.updateOne(
      { month, year, customer },
      { status: MagazineStatus.SENT_FOR_PRINTING },
      { new: true },
    );
  }

  /**
   * Schedule magazines for permanent link change
   *
   * @param dto - Object with month and year of the magazine
   *
   * @returns - Returns the number of magazines which were scheduled for permanent link change
   */
  public async schedulePermanentLinksTurnOver({
    month,
    year,
  }: CurrentMagazineMonthDate) {
    const magazines = await this.magazinesService.find(
      {
        month,
        year,
      },
      { populate: ['customer'], batchSize: 1000 },
    );
    const jobs = magazines.map((magazine) => {
      return {
        data: {
          magazine,
        },
        opts: {
          removeOnComplete: true,
        },
      };
    });

    await this.permanentLinkQueue.addBulk(jobs);

    return {
      message: 'magazine permanent link changes scheduled',
      jobs: jobs.length,
    };
  }

  /**
   * Returns the number of magazine which were scheduled for permanent link change
   * the number of currently active jobs and the number of failed jobs
   *
   * @returns - Number of jobs scheduled, active and failed
   */
  public async getPermanentQueueCount() {
    const [count, active, failed] = await Promise.all([
      this.permanentLinkQueue.count(),
      this.permanentLinkQueue.getActiveCount(),
      this.permanentLinkQueue.getFailedCount(),
    ]);

    return { count, active, failed };
  }
}
