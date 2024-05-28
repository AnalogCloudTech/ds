import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { OnDemandEmailsService } from '../on-demand-emails.service';
import { CreateOnDemandEmailDto } from '../dto/create-on-demand-email.dto';
import { UpdateOnDemandEmailDto } from '../dto/update-on-demand-email.dto';
import { ValidateScheduleDateTransformPipe } from '@/campaigns/email-campaigns/on-demand-emails/pipes/validate-schedule-date.pipe';
import { OnDemandEmail as OnDemandEmailDomain } from '@/campaigns/email-campaigns/on-demand-emails/domain/on-demand-email';
import { VerifiedEmailGuard } from '@/campaigns/email-campaigns/common/guards/verified-email-guard.service';
import { CanBeChangedPipe } from '@/campaigns/email-campaigns/on-demand-emails/pipes/can-be-changed-pipe.service';
import { Paginator, PaginatorTransformPipe } from '@/internal/utils/paginator';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';

@Controller({ path: 'email-campaigns/on-demand-emails', version: '1' })
export class OnDemandEmailsController {
  constructor(private readonly onDemandEmailsService: OnDemandEmailsService) {}

  @Serialize(OnDemandEmailDomain)
  @Post()
  @UseGuards(VerifiedEmailGuard)
  async create(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Body(ValidationPipe, ValidateScheduleDateTransformPipe)
    createOnDemandEmailDto: CreateOnDemandEmailDto,
  ) {
    return this.onDemandEmailsService.create(customer, createOnDemandEmailDto);
  }

  @Serialize(OnDemandEmailDomain)
  @Get()
  async findAll(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
  ) {
    return this.onDemandEmailsService.findAllPaginated(customer, page, perPage);
  }

  @Serialize(OnDemandEmailDomain)
  @Get(':onDemandEmailId')
  async findOne(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Param('onDemandEmailId') id: string,
  ) {
    return this.onDemandEmailsService.findOneByUser(customer, id);
  }

  @Serialize(OnDemandEmailDomain)
  @Patch(':onDemandEmailId')
  async update(
    @Param('onDemandEmailId', CanBeChangedPipe) id: string,
    @Body() updateOnDemandEmailDto: UpdateOnDemandEmailDto,
  ) {
    return this.onDemandEmailsService.update(id, updateOnDemandEmailDto);
  }

  @Serialize(OnDemandEmailDomain)
  @Delete(':onDemandEmailId')
  async remove(@Param('onDemandEmailId', CanBeChangedPipe) id: string) {
    return this.onDemandEmailsService.remove(id);
  }
}
