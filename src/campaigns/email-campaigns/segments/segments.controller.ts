import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SegmentQueryFilters } from '@/campaigns/email-campaigns/segments/types';
import { SegmentsService } from '@/campaigns/email-campaigns/segments/segments.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { Event } from '@/cms/cms/types/webhook';
import { inspect } from 'util';

@Controller({ path: 'email-campaigns/segments', version: '1' })
export class SegmentsController {
  constructor(
    private readonly service: SegmentsService,
    private readonly logger: Logger,
  ) {}

  @Get()
  index(@Request() request) {
    const filters = <SegmentQueryFilters>request.query;
    return this.service.list(filters);
  }

  @Get('with-leads-count')
  withLeadsCount(
    @Request() request,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    const filters = <SegmentQueryFilters>request.query;
    return this.service.listWithCustomerLeadsCount(customer, filters);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async webhook(@Body() event: Event): Promise<any> {
    this.logger.log(`Received webhook: ${inspect(event)}`);
    return this.service.handleWebhook(event);
  }
}
