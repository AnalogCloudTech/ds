import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { CreateLeadFromPagesteadDto } from './dto/create-lead-from-pagestead.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { get } from 'lodash';
import { ImportLeadDto } from '@/campaigns/email-campaigns/leads/dto/import-lead.dto';
import { SetFileTransformValidatePipe } from '@/campaigns/email-campaigns/leads/pipes/transform/setFileTransformValidate.pipe';
import {
  Paginator,
  PaginatorSchematicsInterface,
  PaginatorTransformPipe,
} from '@/internal/utils/paginator';
import { CustomerEmailTransformPipe } from '@/campaigns/email-campaigns/common/pipes/customer-email-transform.pipe';
import { ValidateSegmentsPipe } from '@/campaigns/email-campaigns/common/pipes/validate-segments.pipe';
import { PopulateSegmentsFromBookIdPipeTransform } from '@/campaigns/email-campaigns/leads/pipes/transform/populate-segments-from-bookId.pipe.transform';
import { Public } from '@/auth/auth.service';
import { InheritDataPipe } from '@/campaigns/email-campaigns/leads/pipes/transform/inherit-data.pipe';
import { EmailLowerCasePipe } from '@/internal/common/pipes/email-lower-case.pipe';
import { Response } from 'express';
import { Lead as DomainLead } from '@/campaigns/email-campaigns/leads/domain/lead';
import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import { Sortable } from '@/internal/utils/sortable/sortable';
import { LeadsSortableFields } from '@/internal/utils/sortable/leads-sortable-fields';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { LeadDocument } from '@/campaigns/email-campaigns/leads/schemas/lead.schema';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';
import { LeadsFiltersDTO } from '@/campaigns/email-campaigns/leads/dto/leads-filters.dto';
import { UnsubscribeLeadDTO } from '@/campaigns/email-campaigns/leads/dto/unsubscribe-lead.dto';
import { ZodValidationPipe } from '@/guides/orders/validators/zod-validation.pipe';
import {
  BulkDeleteDTO,
  bulkDeleteValidatorSchema,
} from '@/campaigns/email-campaigns/leads/controller/validators/bulk-delete.validator';

@Controller({ path: 'email-campaigns/leads', version: '1' })
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Serialize(DomainLead)
  @Get()
  async findAll(
    @Request() req,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
    @Query('filters', ValidationTransformPipe) filters: LeadsFiltersDTO,
    @Query() { sort }: Sortable<LeadsSortableFields>,
  ): Promise<PaginatorSchematicsInterface> {
    const identities = <Array<string>>get(req, ['user', 'identities']);

    return await this.leadsService.findAllPaginated(
      identities,
      customer,
      page,
      perPage,
      filters,
      sort,
    );
  }

  @Serialize(DomainLead)
  @Post()
  async create(
    @Request() req,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Body(
      ValidationTransformPipe,
      EmailLowerCasePipe,
      CustomerEmailTransformPipe,
      ValidateSegmentsPipe,
      InheritDataPipe,
    )
    dto: CreateLeadDto,
  ) {
    return this.leadsService.create(dto, customer);
  }

  @Serialize(DomainLead)
  @Public()
  @Post('/public')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createLandingPage(
    @Request() req,
    @Body(EmailLowerCasePipe, ValidateSegmentsPipe, InheritDataPipe)
    dto: CreateLeadDto,
  ) {
    return this.leadsService.create(dto);
  }

  @Serialize(DomainLead)
  @Public()
  @Post('create-from-pagestead')
  createFromPagestead(
    @Body(
      EmailLowerCasePipe,
      PopulateSegmentsFromBookIdPipeTransform,
      InheritDataPipe,
    )
    createLeadFromPagesteadDto: CreateLeadFromPagesteadDto,
  ) {
    return this.leadsService.createFromPagestead(createLeadFromPagesteadDto);
  }

  @Post('bulk-delete')
  async removeBulk(
    @Body(new ZodValidationPipe(bulkDeleteValidatorSchema)) dto: BulkDeleteDTO,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    return this.leadsService.bulkRemoveCustomerLeads(customer, dto);
  }

  @Serialize(DomainLead)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Request() req,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Param('id') id: string,
    @Body(EmailLowerCasePipe, ValidateSegmentsPipe)
    updateLeadDto: UpdateLeadDto,
  ) {
    const identities = get(req, ['user', 'identities']);
    return this.leadsService.updateUserLead(
      customer,
      identities,
      id,
      updateLeadDto,
    );
  }

  @Serialize(DomainLead)
  @Delete(':id')
  remove(
    @Request() req,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Param('id') id: string,
  ) {
    const identities = get(req, ['user', 'identities']);
    return this.leadsService.removeUserLead(customer, identities, id);
  }

  @Post('import-list')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FileInterceptor('file'))
  importList(
    @Body(CustomerEmailTransformPipe, SetFileTransformValidatePipe)
    dto: ImportLeadDto,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    return this.leadsService.batchStoreFromFile(dto, customer);
  }

  @Get('exportLeads')
  async downloadLeads(
    @Request() req,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Res() res: Response,
  ) {
    const user = req.user;
    const report = await this.leadsService.exportLeads(user, customer);
    res.type('csv');
    return res.send(report);
  }

  @Public()
  @Get(':id/unsubscribe')
  async unsubscribe(
    @Param(ValidationPipe) dto: UnsubscribeLeadDTO,
  ): Promise<LeadDocument | null> {
    return this.leadsService.unsubscribe(dto.id);
  }
}
