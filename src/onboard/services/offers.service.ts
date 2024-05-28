import { OffersRepository } from '@/onboard/repositories/offers.repository';
import { FilterQuery, QueryOptions } from 'mongoose';
import { OfferDocument } from '@/onboard/schemas/offer.schema';
import { Injectable } from '@nestjs/common';
import { SEARCH_UNIQUE_FIELD_DEFAULT_LIMIT } from '@/internal/common/repository/types';

@Injectable()
export class OffersService {
  constructor(private readonly repository: OffersRepository) {}

  findOne(filter?: FilterQuery<OfferDocument>) {
    return this.repository.first(filter);
  }

  findAll(filter?: FilterQuery<OfferDocument>, options?: QueryOptions) {
    return this.repository.findAll(filter, options);
  }

  searchUniqueField(
    keyword: string,
    field: string,
    limit = SEARCH_UNIQUE_FIELD_DEFAULT_LIMIT,
  ) {
    return this.repository.searchUniqueField(keyword, field, limit);
  }
}
