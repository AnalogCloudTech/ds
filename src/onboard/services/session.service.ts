import { Injectable } from '@nestjs/common';
import { SessionRepository } from '@/onboard/repositories/session.repository';
import { SessionDocument } from '@/onboard/schemas/session.schema';
import { CoachDocument } from '@/onboard/coaches/schemas/coach.schema';
import { SchemaId } from '@/internal/types/helpers';
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import {
  DefaultSteps,
  MarketingParameters,
  SalesParameters,
  SessionCustomerHubspot,
  Step,
} from '@/onboard/domain/types';
import { OfferDocument } from '@/onboard/schemas/offer.schema';
import { isEmpty } from 'lodash';
import { CreateSessionDTO } from '@/onboard/dto/session/create-session.dto';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { SEARCH_UNIQUE_FIELD_DEFAULT_LIMIT } from '@/internal/common/repository/types';

@Injectable()
export class SessionService {
  constructor(private readonly repository: SessionRepository) {}

  public pushDeclinedCoach(
    session: SessionDocument,
    coach: CoachDocument,
  ): Promise<SessionDocument> {
    const update = {
      $addToSet: {
        declinedCoaches: coach._id,
      },
    };
    return this.repository.update(<SchemaId>session._id, update);
  }

  public getSessionsToUpdateCustomerLastStepHubspot(
    filter: FilterQuery<SessionDocument>,
  ): Promise<Array<SessionCustomerHubspot>> {
    return this.repository.getSessionsToUpdateCustomerLastStepHubspot(filter);
  }

  public async startSessionForUpSell(
    offer: OfferDocument,
    currentStep: Step,
    customer: CustomerDocument,
    marketingParameters?: MarketingParameters,
    salesParameters?: SalesParameters,
  ) {
    const steps = isEmpty(offer.steps) ? DefaultSteps : offer.steps;

    return this.repository.store<CreateSessionDTO>({
      offer: offer._id,
      currentStep,
      steps,
      customer: customer._id,
      marketingParameters,
      salesParameters,
    });
  }

  public async findById(id: SchemaId, options?: QueryOptions) {
    return this.repository.findById(id, options);
  }

  public async update(id: SchemaId, update: UpdateQuery<SessionDocument>) {
    return this.repository.update(id, update);
  }

  public async onboardSalesReport(
    match: FilterQuery<SessionDocument> = {},
    skip = 0,
    perPage = 15,
  ) {
    return this.repository.onboardSalesReport(match, skip, perPage);
  }

  public async onboardSalesReportCount(
    match: FilterQuery<SessionDocument> = {},
  ) {
    return this.repository.onboardSalesReportCount(match);
  }

  searchUniqueField(
    keyword: string,
    field: string,
    limit = SEARCH_UNIQUE_FIELD_DEFAULT_LIMIT,
  ) {
    return this.repository.searchUniqueField(keyword, field, limit);
  }
}
