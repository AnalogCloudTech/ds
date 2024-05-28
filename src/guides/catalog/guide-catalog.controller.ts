import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { GuideCatalogService } from '@/guides/catalog/guide-catalog.service';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';
import { CreateGuideCatalogDto } from '@/guides/catalog/dto/create-guide-catalog.dto';
import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import { GuideCatalog } from '@/guides/catalog/domain/guide-catalog';

@Controller({ path: 'guide-catalog', version: '1' })
export class GuideCatalogController {
  constructor(private readonly service: GuideCatalogService) {}

  @UsePipes(ValidationTransformPipe)
  @Post()
  create(@Body() dto: CreateGuideCatalogDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Serialize(GuideCatalog)
  @Get('/filter')
  find(@Query('guideId') guideId: string) {
    return this.service.findOne(guideId);
  }
}
