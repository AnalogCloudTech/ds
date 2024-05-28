import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { PagevisitsService } from './pagevisits.service';
import { CreatePageVisitsFromPagesteadDto } from './dto/create-pagevisits-from-pagestead.dto';
import { CustomerEmailLowerCasePipe } from '@/internal/common/pipes/customer-email-lower-case.pipe';
import { ApiKeyOnly } from '@/auth/auth.service';

@Controller({ path: 'page-visits', version: '1' })
export class PagevisitsController {
  constructor(private readonly pagevisitsService: PagevisitsService) {}

  @ApiKeyOnly()
  @Post('create-pagevisits')
  async createPageVisitsFromPagestead(
    @Body(ValidationPipe, CustomerEmailLowerCasePipe)
    createPageVisitsFromPagesteadDto: CreatePageVisitsFromPagesteadDto,
  ): Promise<CreatePageVisitsFromPagesteadDto> {
    return this.pagevisitsService.createVisits(
      createPageVisitsFromPagesteadDto,
    );
  }
}
