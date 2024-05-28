import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pagevisits, PageVisitsDocument } from '../schemas/pagevisits.schema';

@Injectable()
export class PagevisitsRepository extends GenericRepository<PageVisitsDocument> {
  constructor(
    @InjectModel(Pagevisits.name)
    protected readonly model: Model<PageVisitsDocument>,
  ) {
    super(model);
  }
}
