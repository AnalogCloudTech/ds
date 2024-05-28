import { Injectable } from '@nestjs/common';
import { GuideCatalogRepository } from '@/guides/catalog/repositories/guide-catalog.repository';
import { CreateGuideCatalogDto } from '@/guides/catalog/dto/create-guide-catalog.dto';

@Injectable()
export class GuideCatalogService {
  constructor(private readonly repository: GuideCatalogRepository) {}

  async create(dto: CreateGuideCatalogDto) {
    return this.repository.store(dto);
  }

  async findAll() {
    return this.repository.findAll({}, { sort: { position: 'asc' } });
  }

  async findOne(guideId: string) {
    return this.repository.first({ guideId });
  }
}
