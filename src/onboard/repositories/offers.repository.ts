import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { Offer, OfferDocument } from '@/onboard/schemas/offer.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OffersRepository extends GenericRepository<OfferDocument> {
  constructor(
    @InjectModel(Offer.name)
    protected readonly model: Model<OfferDocument>,
  ) {
    super(model);
  }
}
