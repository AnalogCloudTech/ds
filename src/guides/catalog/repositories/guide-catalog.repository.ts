import { Injectable } from '@nestjs/common';
import {
  GuideCatalog,
  GuideCatalogDocument,
} from '@/guides/catalog/schemas/guide-catalog.schema';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GuideCatalogRepository extends GenericRepository<GuideCatalogDocument> {
  constructor(
    @InjectModel(GuideCatalog.name)
    protected readonly model: Model<GuideCatalogDocument>,
  ) {
    super(model);
  }
}
