import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import {
  CreateGuideOrderDto,
  UpdateGuideDto,
} from './dto/create-guide-order.dto';
import { GuideOrderDocument } from './schemas/guide-orders.schema';
import { SchemaId } from '@/internal/types/helpers';
import { GuideOrdersRepository } from '@/guides/orders/repositories/guide-orders.repository';
import { OnboardService } from '@/onboard/onboard.service';
import { SessionService } from '@/onboard/services/session.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { get, isEmpty } from 'lodash';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { BookOptionDocument } from '@/onboard/schemas/book-option.schema';
import { Step } from '@/onboard/domain/types';
import { GuideCatalogService } from '@/guides/catalog/guide-catalog.service';
import { Type } from '@/guides/catalog/schemas/guide-catalog.schema';
import { GuideDetailsRepository } from './repositories/guide-details.repository';
import { GuideDetailDocument } from './schemas/guide-details.schema';
import { ContactV1 } from '@/legacy/dis/legacy/hubspot/domain/types';
import { CreateGuideDataDetailsDto } from './validators/guide-details.validator';

@Injectable()
export class GuideOrdersService {
  constructor(
    private readonly repository: GuideOrdersRepository,
    private readonly detailsRepository: GuideDetailsRepository,
    private readonly onboardService: OnboardService,
    private readonly sessionService: SessionService,
    private readonly hubspotService: HubspotService,
    private readonly guideCatalogService: GuideCatalogService,
  ) {}

  getOrderId(count: number) {
    const orderId = count.toString().padStart(10, '0');
    return `GUIDE-${orderId}`;
  }

  async create(dto: CreateGuideOrderDto, customer: CustomerDocument) {
    const hubspotCustomer = await this.hubspotService.getContactDetailsByEmail(
      customer.email,
    );
    const guideDetails = await this.guideCatalogService.findOne(dto.guideId);
    let multiplier = 1;
    if (!dto.sessionId && guideDetails.type === Type.PACKET) {
      multiplier = 3;
    }
    const currentCredits = Number(
      get(hubspotCustomer, ['properties', 'dentist_guide_credits', 'value'], 0),
    );
    if (currentCredits < dto.quantity * multiplier) {
      throw new HttpException(
        { message: 'Not enough credits' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const count = await this.repository.count();
    const orderId = this.getOrderId(count);

    const thumbnail = guideDetails?.thumbnail || dto.thumbnail;
    const params = {
      ...dto,
      orderId,
      thumbnail,
    };
    const result = await this.repository.create(params, customer._id);

    await this.hubspotService.spendDentistCredits(
      customer.email,
      dto.quantity * multiplier,
    );

    const email = customer.email;
    await this.hubspotService.createGuideOrderTicket(dto, orderId, email);

    if (dto.sessionId) {
      const session = await this.onboardService.findSession(dto.sessionId);
      if (!session) {
        throw new Error(`Session with id ${dto.sessionId} not found`);
      }
      await this.sessionService.update(<SchemaId>session._id, {
        guideOrdered: true,
        currentStep: Step.YOUR_GUIDE,
        guideOrder: result,
      });

      return await this.onboardService.findSession(dto.sessionId);
    }

    return result;
  }

  async getContactDetailsByEmail(email: string): Promise<ContactV1> {
    return this.hubspotService.getContactDetailsByEmail(email);
  }

  async getStoredDetailsByCusId(
    customerId: SchemaId,
  ): Promise<GuideDetailDocument> {
    const findQuery: FilterQuery<GuideDetailDocument> = {
      customer: customerId,
    };
    return this.detailsRepository.first(findQuery);
  }

  async getOnboardData(customerId: SchemaId): Promise<GuideDetailDocument> {
    const record = await this.getStoredDetailsByCusId(customerId);
    if (isEmpty(record)) {
      throw new HttpException('No record found', HttpStatus.NOT_FOUND);
    }
    return record;
  }

  async storeOnboardData(
    dto: CreateGuideDataDetailsDto,
    email: string,
    customerId: SchemaId,
  ): Promise<GuideDetailDocument> {
    const hubspotCustomer = await this.getContactDetailsByEmail(email);

    if (!hubspotCustomer) {
      throw new HttpException('Customer not found in HS', HttpStatus.NOT_FOUND);
    }

    const record = await this.getStoredDetailsByCusId(customerId);

    if (isEmpty(record)) {
      const params = {
        ...dto,
        customer: customerId,
      };
      return this.detailsRepository.store(params);
    } else {
      return record;
    }
  }

  async insertMany(
    dto: CreateGuideOrderDto[],
    sessionId: string,
    customer: CustomerDocument,
  ) {
    const hubspotCustomer = await this.hubspotService.getContactDetailsByEmail(
      customer.email,
    );
    const currentCredits = Number(
      get(hubspotCustomer, ['properties', 'dentist_guide_credits', 'value'], 0),
    );

    let totalQuantity = 0;
    const count = await this.repository.count();
    const dataPromise = dto.map(async (item, index) => {
      const orderId = this.getOrderId(count + index);
      totalQuantity += item.quantity;
      const guideDetails = await this.guideCatalogService.findOne(item.guideId);
      const thumbnail = guideDetails?.thumbnail;
      return {
        ...item,
        customer: customer._id,
        orderId,
        thumbnail,
      };
    });

    const params = await Promise.all(dataPromise);

    if (currentCredits < totalQuantity) {
      throw new HttpException(
        { message: 'Not enough credits' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const session = await this.onboardService.findSession(sessionId);
    if (!session) {
      throw new Error(`Session with id ${sessionId} not found`);
    }

    const guides = await this.repository.insertMany(params);
    const email = customer.email;
    const tickets = params.map(async (data) => {
      return await this.hubspotService.createGuideOrderTicket(
        data,
        data.orderId,
        email,
      );
    });

    await Promise.all(tickets);

    await this.hubspotService.spendDentistCredits(
      customer.email,
      totalQuantity,
    );
    await this.sessionService.update(<SchemaId>session._id, {
      guideOrdered: true,
      currentStep: Step.YOUR_GUIDE,
      guideOrder: guides,
    });
    return await this.onboardService.findSession(sessionId);
  }

  async find(id: SchemaId): Promise<GuideOrderDocument> {
    return this.repository.findById(id);
  }

  async orders(
    customerId: SchemaId,
    page: number,
    perPage: number,
  ): Promise<PaginatorSchematicsInterface<GuideOrderDocument>> {
    return this.repository.findByCustomerId(customerId, page, perPage);
  }

  async guideDetails(guideId: string): Promise<BookOptionDocument> {
    const bookOption = await this.onboardService.getBookOptionByBookId(guideId);
    if (!bookOption) {
      throw new HttpException(
        { message: 'GuideOrders not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    return bookOption;
  }

  async getLatestOrder(
    customerId: SchemaId,
    guideId: string,
  ): Promise<GuideOrderDocument> {
    return this.repository.getLatestOrder(customerId, guideId);
  }

  remove(id: SchemaId): Promise<GuideOrderDocument> {
    return this.repository.delete(id);
  }

  async update(id: SchemaId, dto: UpdateGuideDto): Promise<GuideOrderDocument> {
    return this.repository.update(id, dto);
  }
}
