import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { MonthsNumber, MonthsType } from '@/internal/utils/date';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { GeneratedMagazinesRepository } from '@/referral-marketing/magazines/repositories/generated-magazines.repository';
import { MagazinesService } from '@/referral-marketing/magazines/services/magazines.service';
import { CreateGeneratedMagazineDto } from '@/referral-marketing/magazines/dto/create-generated-magazine.dto';
import { SnsService } from '@/internal/libs/aws/sns/sns.service';
import { ConfigService } from '@nestjs/config';
import { UpdateGeneratedMagazineStatusDto } from '@/referral-marketing/magazines/dto/update-generated-magazine-status.dto';
import { UpdateGeneratedMagazineDto } from '@/referral-marketing/magazines/dto/update-generated-magazine.dto';
import { DateTime } from 'luxon';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import {
  GeneratedMagazine,
  GeneratedMagazineDocument,
  GenerationStatus,
} from '@/referral-marketing/magazines/schemas/generated-magazine.schema';
import {
  MagazineDocument,
  MagazineStatus,
} from '@/referral-marketing/magazines/schemas/magazine.schema';
import { MagazinesRepository } from '@/referral-marketing/magazines/repositories/magazines.repository';
import { PreviewMagazineDto } from '../dto/preview-magazine.dto';
import { FilterQuery, QueryOptions } from 'mongoose';
import { MagazineIds } from '../domain/types';
import { CustomersService } from '@/customers/customers/customers.service';
import { CmsService } from '@/cms/cms/cms.service';
import {
  CreateMagazineCoverLeadDto,
  LeadCoversDto,
  LeadDto,
} from '../dto/create-magazine-cover-lead.dto';
import { LoggerPayload } from '@/internal/utils/logger';

@Injectable()
export class GeneratedMagazinesService {
  constructor(
    @Inject(forwardRef(() => MagazinesService))
    private readonly magazinesService: MagazinesService,
    private readonly generatedMagazinesRepository: GeneratedMagazinesRepository,
    private readonly magazinesRepository: MagazinesRepository,
    private readonly snsService: SnsService,
    private readonly configService: ConfigService,
    private readonly hubSpotService: HubspotService,
    private readonly cmsService: CmsService,
    private readonly customerService: CustomersService,
    @Inject('logger')
    private readonly logger: Logger,
  ) {}

  async find(
    filter: FilterQuery<GeneratedMagazineDocument>,
    options?: QueryOptions,
  ) {
    return this.generatedMagazinesRepository.findGM(filter, options);
  }

  async findOneGM(
    filter: FilterQuery<GeneratedMagazineDocument>,
    options?: QueryOptions,
  ) {
    return this.generatedMagazinesRepository.findOneGM(filter, options);
  }

  async updateGM(
    filter: FilterQuery<GeneratedMagazineDocument>,
    update: Partial<GeneratedMagazine>,
    options?: QueryOptions,
  ) {
    return this.generatedMagazinesRepository.updateGM(filter, update, options);
  }

  async create(
    customer: CustomerDocument,
    { year, month, createdByAutomation = false }: CreateGeneratedMagazineDto,
    isPreview = false,
    createTicket = false,
  ) {
    const magazine = await this.magazinesService.findOne(customer, year, month);

    if (!magazine) {
      this.logger.debug(`magazine not found: ${year}-${month}`);
      throw new HttpException(
        { message: 'magazine not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const generatedMagazine = await this.generatedMagazinesRepository.upsert(
      customer,
      magazine,
      isPreview,
      !!createdByAutomation,
    );

    try {
      const topic = this.configService.get<string>(
        'aws.sns.topics.RM_MAGAZINE_GENERATION',
      );
      await this.snsService.publish(
        {
          generatedMagazine: generatedMagazine,
          isPreview,
          createTicket,
        },
        topic,
      );
      this.logger.log({
        payload: {
          message: 'sent magazine generation request',
          generatedMagazine,
          isPreview,
          usageDate: DateTime.now(),
        },
      });
      return generatedMagazine;
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error({
          payload: <LoggerPayload>{
            message: 'error while publishing sns message',
            err: err?.message,
            stack: err?.stack,
            usageDate: DateTime.now(),
          },
        });
        throw new HttpException(
          {
            message: 'error publishing on SNS',
            err: err?.message,
            stack: err?.stack,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async createMagazineCoverForLeads(
    dto: CreateMagazineCoverLeadDto,
  ): Promise<LeadDto[]> {
    const customer = await this.customerService.findByEmail(dto.customerEmail);
    if (!customer) {
      throw new HttpException(
        { message: 'customer not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    const result = await Promise.all(
      dto.leads.map(async (lead) =>
        this.generateMagazineCoverForLead(lead, dto, customer),
      ),
    );
    return result;
  }

  async generateMagazineCoverForLead(
    lead: LeadDto,
    dto: CreateMagazineCoverLeadDto,
    customer: CustomerDocument,
  ): Promise<LeadDto> {
    const magazine = await this.magazinesRepository.findOne(
      dto.year,
      dto.month,
      customer._id,
    );

    if (!magazine) {
      throw new HttpException(
        { message: 'magazine not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    magazine.customer = customer;
    magazine.baseReplacers[0]['leadName'] = lead?.name;
    magazine.baseReplacers[0]['leadEmail'] = lead?.email;
    magazine.baseReplacers[0]['leadPhoneNumber'] = lead?.phone;
    magazine.baseReplacers[0]['leadAddress'] = lead?.address;

    if (magazine?.covers?.length > 0) {
      try {
        const topic = this.configService.get<string>(
          'aws.sns.topics.RM_MAGAZINE_GENERATION_COVERS_FOR_LEAD',
        );
        await this.snsService.publish(
          {
            magazine,
            lead,
          },
          topic,
        );
        this.logger.log({
          payload: {
            message: 'sent magazine covers generation request',
            magazine,
            lead,
            usageDate: DateTime.now(),
          },
        });
        return lead;
      } catch (err) {
        if (err instanceof Error) {
          this.logger.error({
            payload: <LoggerPayload>{
              message: 'error while publishing sns message',
              err: err?.message,
              stack: err?.stack,
              usageDate: DateTime.now(),
            },
          });
          throw new HttpException(
            {
              message: 'error publishing on SNS',
              err: err?.message,
              stack: err?.stack,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    }
  }

  // TODO: add filter of active and status
  findAll(customer: CustomerDocument, isActive = true) {
    return this.generatedMagazinesRepository.find(customer, isActive);
  }

  async findOne(customer: CustomerDocument, year: string, month: string) {
    const magazine = await this.magazinesService.findOne(customer, year, month);

    if (!magazine) {
      throw new HttpException(
        { message: 'magazine not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return this.generatedMagazinesRepository.findOne(customer, magazine);
  }

  async update(
    customer: CustomerDocument,
    {
      flippingBookUrl,
      pageUrl,
      bookUrl,
      additionalInformation,
    }: UpdateGeneratedMagazineDto,
    year: string,
    month: string,
  ) {
    const magazine = await this.magazinesService.findOne(customer, year, month);

    if (!magazine) {
      throw new HttpException(
        { message: 'magazine not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return this.generatedMagazinesRepository.update(
      customer,
      {
        flippingBookUrl,
        pageUrl,
        bookUrl,
        additionalInformation,
      },
      magazine,
    );
  }

  updateLeadCoversForMagazine(
    generatedMagazineId: string,
    dto: LeadCoversDto,
  ): Promise<GeneratedMagazineDocument> {
    return this.generatedMagazinesRepository.updateLeadCoversById(
      generatedMagazineId,
      dto,
    );
  }

  updateStatus(
    generatedMagazineId: string,
    dto: UpdateGeneratedMagazineStatusDto,
  ) {
    return this.generatedMagazinesRepository.updateById(
      generatedMagazineId,
      dto,
    );
  }

  async getGeneratedMagazineStatusById(
    generatedMagazineId: string,
  ): Promise<GeneratedMagazineDocument> {
    return this.generatedMagazinesRepository.findByMagazineId(
      generatedMagazineId,
    );
  }

  async sendToPrint(generatedMagazineId: string, _customer?: CustomerDocument) {
    const {
      status,
      coversOnlyUrl,
      magazine,
      additionalInformation,
      customer,
      pageUrl,
    } = await this.generatedMagazinesRepository.findById(
      generatedMagazineId,
      _customer,
    );

    if (coversOnlyUrl && status !== GenerationStatus.DONE) {
      throw new HttpException(
        {
          message: `magazine status is ${status} it should be DONE to be printed`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const { _id: magazineId, month: magazineMonth } = <MagazineDocument>(
      magazine
    );

    const { email } = <CustomerDocument>customer;
    const ticket = await this.hubSpotService.createPrintQueueTicket({
      email,
      coverUrl: coversOnlyUrl,
      magazineMonth,
      additionalInformation,
      rmProofLink: _customer.flippingBookPreferences.publicationUrl ?? '',
      rmMemberSiteLink: pageUrl ?? '',
      rmShippedMagazineLink:
        _customer.flippingBookPreferences.permanentPublicationUrl ?? '',
    });

    if (!ticket.ticketId) {
      throw new HttpException(
        { message: 'error creating ticket' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.magazinesRepository.update(magazineId, {
      status: MagazineStatus.SENT_FOR_PRINTING,
    });

    this.logger.log({
      ticket,
      magazineId,
      email,
      coversOnlyUrl,
      magazineMonth,
      usageDate: DateTime.now(),
    });

    return this.generatedMagazinesRepository.updateById(generatedMagazineId, {
      status: GenerationStatus.SENT_FOR_PRINTING,
    });
  }

  public async getMagazinePreview(dto: PreviewMagazineDto) {
    return this.generatedMagazinesRepository.getMagazinePreview(dto);
  }

  async count(magazineIds: MagazineIds[]): Promise<number> {
    return this.generatedMagazinesRepository.count(magazineIds);
  }

  public async getAllGeneratedMagazinesMetrics(
    page: number,
    perPage: number,
    year: string,
    month: string,
    status: string,
  ) {
    let filterQuery: FilterQuery<GeneratedMagazineDocument>;

    const monthNumber = <number>MonthsNumber[month];
    const yearNumber = +year;

    const startDate = DateTime.fromObject({
      year: yearNumber,
      month: monthNumber,
    });

    const endDate = startDate.endOf('month');

    if (year && month) {
      filterQuery = {
        createdAt: { $gte: startDate, $lte: endDate },
      };
    }

    const skip = page * perPage;

    return this.generatedMagazinesRepository.getAllGeneratedMagazinesMetrics(
      page,
      perPage,
      skip,
      filterQuery,
      status,
    );
  }

  public async getCountAllGeneratedMagazinesMetrics(
    year: string,
    month: MonthsType,
  ) {
    let filterQuery: FilterQuery<GeneratedMagazineDocument>;
    const monthNumber = <number>MonthsNumber[month];
    const yearNumber = +year;

    const startDate = DateTime.fromObject({
      year: yearNumber,
      month: monthNumber,
    });

    const endDate = startDate.endOf('month');

    if (year && month) {
      filterQuery = {
        createdAt: { $gte: startDate, $lte: endDate },
      };
    }

    return this.generatedMagazinesRepository.getCountAllGeneratedMagazinesMetrics(
      filterQuery,
    );
  }
}
