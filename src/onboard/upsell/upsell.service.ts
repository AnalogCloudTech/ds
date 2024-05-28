import { Injectable } from '@nestjs/common';
import { SessionService } from '@/onboard/services/session.service';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { SetCustomerPasswordDTO } from '@/onboard/upsell/dto/set-customer-password.dto';
import { MarketingAndSalesParamsDTO } from '@/onboard/upsell/dto/market-and-sales-params.dto';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import * as bcrypt from 'bcryptjs';
import { ContactDto } from '@/legacy/dis/legacy/hubspot/dto/contact.dto';
import { SessionDocument, SessionType } from '../schemas/session.schema';
import { TwUpsellRepository } from '@/onboard/upsell/upsell.repository';
import { CreateUpsellReportDto } from '@/onboard/upsell/dto/create-upsell-report.dto';
import { OfferDocument } from '@/onboard/schemas/offer.schema';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import {
  PaymentProviders,
  PaymentStatus,
  TWUpsellDocument,
} from '@/onboard/upsell/schemas/tw-upsell.schema';
import {
  ColumnFilterDto,
  FindUpsellReportDto,
  UniqueSearchDto,
  UpsellCSVExportDTO,
} from '@/onboard/upsell/dto/find-upsell-report.dto';
import { SchemaId } from '@/internal/types/helpers';
import { FilterQuery } from 'mongoose';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { UPSELL_REPORT_QUEUE } from '@/onboard/upsell/constant';
import { formatUpsellCSV } from '@/onboard/upsell/utils/upsell-csv';
import { CreateUpsellDto } from '@/onboard/upsell/controllers/validators/create-upsell.validator';
import { OffersService } from '@/onboard/services/offers.service';
import { OfferNotFound } from '@/onboard/upsell/services/exceptions/offer-not-found';
import { ObjectId } from 'mongodb';

@Injectable()
export class UpsellService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly hubspotService: HubspotService,
    private readonly twUpsellRepository: TwUpsellRepository,
    private readonly offerService: OffersService,
    @InjectQueue(UPSELL_REPORT_QUEUE) private csvSenderQueue: Queue,
  ) {}

  public async setCustomerPassword(dto: SetCustomerPasswordDTO) {
    const session = await this.sessionService.findById(dto.sessionId, {
      populate: 'customer',
    });
    const passwordEncrypted = await bcrypt.hash(dto.password, 10);
    const customer = <CustomerDocument>session.customer;
    const hubspotDto: ContactDto = {
      email: customer.email,
      afy_password: dto.password,
      afy_password_encrypted: passwordEncrypted,
    };

    return this.hubspotService.createOrUpdateContact(hubspotDto);
  }

  public async updateSessionWithParams(
    dto: MarketingAndSalesParamsDTO,
  ): Promise<SessionDocument> {
    const session = await this.sessionService.findById(dto.sessionId, {
      populate: ['customer', 'offer'],
    });

    const offer = session.offer as OfferDocument;
    const customer = session.customer as CustomerDocument;

    const upsellReport: CreateUpsellReportDto = {
      customer: customer.toObject(),
      customerEmail: customer.email,
      offer: offer.toObject(),
      offerName: offer?.title,
      sessionId: dto.sessionId,
      paymentProvider: PaymentProviders.CHARGIFY,
      paymentStatus: PaymentStatus.SUCCESS,
      ...dto.marketingParameters,
    };

    await this.twUpsellRepository.store(upsellReport);

    return this.sessionService.update(dto.sessionId, {
      marketingParameters: dto.marketingParameters,
      sessionType: SessionType.UPSELL,
    });
  }

  async create(dto: CreateUpsellDto): Promise<TWUpsellDocument> {
    const offer = await this.offerService.findOne({
      _id: new ObjectId(dto.offerId),
    });

    if (!offer) {
      throw new OfferNotFound();
    }

    delete dto.offerId;
    return this.twUpsellRepository.store({
      ...dto,
      offer: offer._id,
      offerName: offer.title,
    });
  }

  async createMany(dtos: CreateUpsellReportDto[]): Promise<TWUpsellDocument[]> {
    return this.twUpsellRepository.storeMany(dtos);
  }

  async findAllPaginated(
    dto: FindUpsellReportDto,
    filter: ColumnFilterDto,
    page: number,
    perPage: number,
  ): Promise<PaginatorSchematicsInterface<TWUpsellDocument>> {
    const { search, startDate, endDate, sortBy } = dto;
    let regexFilter: FilterQuery<TWUpsellDocument> = {};
    let isUpsellQuery = {};

    if (filter.isUpsell !== undefined) {
      isUpsellQuery = { sessionId: { $exists: filter.isUpsell } };
    }

    const filterFields = [
      'customerEmail',
      'offerName',
      'channel',
      'utmSource',
      'utmMedium',
      'utmContent',
      'utmTerm',
    ];

    regexFilter = filterFields.reduce((filterFields, field) => {
      const value = filter[field] as string[];
      if (typeof value === 'object' && value?.length > 0) {
        filter[field] = {
          $in: value.map((keyword) => new RegExp(keyword, 'i')),
        };
      }
      return filter;
    }, {});

    Object.keys(regexFilter).forEach((key) => {
      if (!filterFields.includes(key)) {
        delete regexFilter[key];
      }
    });

    let query: FilterQuery<TWUpsellDocument> = {
      ...regexFilter,
      ...isUpsellQuery,
      createdAt: { $gte: startDate, $lte: endDate },
    };
    if (search) {
      query = {
        ...query,
        $or: [
          { offerName: { $regex: search, $options: 'i' } },
          { customerEmail: { $regex: search, $options: 'i' } },
          {
            channel: { $regex: search, $options: 'i' },
          },
          {
            utmSource: { $regex: search, $options: 'i' },
          },
          {
            utmMedium: { $regex: search, $options: 'i' },
          },
          {
            utmContent: { $regex: search, $options: 'i' },
          },
          {
            utmTerm: { $regex: search, $options: 'i' },
          },
        ],
      };
    }
    const options = {
      skip: page * perPage,
      limit: perPage,
      sort: sortBy,
      lean: true,
    };

    return this.twUpsellRepository.findAllPaginated(query, options);
  }

  async deleteRecord(id: SchemaId) {
    return this.twUpsellRepository.delete(id);
  }

  async searchUniqueField(dto: UniqueSearchDto) {
    return this.twUpsellRepository.searchUniqueField(dto.keyword, dto.field);
  }

  async searchUniqueFieldPaginated(
    dto: UniqueSearchDto,
    isUpsell?: boolean,
    page?: number,
    perPage?: number,
  ) {
    return this.twUpsellRepository.searchUniqueFieldPaginated(
      dto.keyword,
      dto.field,
      perPage,
      page,
      isUpsell,
    );
  }

  async sendCsvToEmail(dto: UpsellCSVExportDTO, filter: ColumnFilterDto = {}) {
    let data: TWUpsellDocument[];
    if (dto?.reportIds?.length) {
      data = await this.twUpsellRepository.findByIds(dto.reportIds);
    } else {
      const paginated = await this.findAllPaginated(dto, filter, 0, 10000);
      data = paginated.data;
    }
    const formattedData = formatUpsellCSV(data);

    const jobData = {
      formattedData,
      email: dto.email,
    };
    const opts = { removeOnComplete: true, removeOnFail: true };
    await this.csvSenderQueue.add(jobData, opts);
    return jobData;
  }
}
