import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import { GeneratedMagazineDomain } from '@/referral-marketing/magazines/domain/generated-magazine';
import { ReferralMarketingAdminsService } from '@/referral-marketing/magazines/services/referral-marketing-admins.service';
import { IsAdminGuard } from '@/internal/common/guards/is-admin.guard';
import { CreateMagazineAdminDto } from '@/referral-marketing/magazines/dto/create-magazine-admin.dto';
import { UploadCustomMagazineDto } from '@/referral-marketing/magazines/dto/upload-custom-magazine.dto';
import {
  CurrentMagazineMonthDate,
  TurnMonthDto,
} from '@/referral-marketing/magazines/dto/turn-month.dto';
import { UpdateMagazinesAdminDto } from '@/referral-marketing/magazines/dto/update-magazines-admin.dto';
import { UpdateMagazineAdminDto } from '@/referral-marketing/magazines/dto/update-magazine-admin.dto';
import { UpdateMagazineDto } from '../dto/update-magazine.dto';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CustomerId } from '@/customers/customers/domain/types';

@UseGuards(IsAdminGuard)
@Controller({
  path: 'admin/referral-marketing',
  version: '1',
})
export class ReferralMarketingAdminsController {
  constructor(private readonly adminsService: ReferralMarketingAdminsService) {}

  @Post('generate-magazine')
  @Serialize(GeneratedMagazineDomain)
  generateMagazine(@Body(ValidationPipe) dto: CreateMagazineAdminDto) {
    const { createTicket, isPreview, userEmail, customerId, ...rest } = dto;
    return this.adminsService.generateMagazine(
      rest,
      createTicket || false,
      isPreview || false,
      userEmail,
      customerId,
    );
  }

  @Post('upload-custom-cover')
  uploadCustomCover(@Body(ValidationPipe) dto: UploadCustomMagazineDto) {
    return this.adminsService.uploadCustomCover(dto);
  }

  @Post('many-magazines-send-to-print')
  sendMagazinesToPrint(@Body(ValidationPipe) dto: UpdateMagazinesAdminDto) {
    return this.adminsService.manySendForPrinting(dto);
  }

  @Post('single-magazine-send-to-print')
  sendMagazineToPrint(@Body(ValidationPipe) dto: UpdateMagazineAdminDto) {
    return this.adminsService.singleSendForPrinting(dto);
  }

  @Post('monthly-turn-over')
  startMonthlyTurnOver(@Body(ValidationPipe) dto: TurnMonthDto) {
    return this.adminsService.scheduleMonthlyTurnOver(dto);
  }

  @Get('monthly-turn-over')
  getMonthlyTurnOverStatus() {
    return this.adminsService.getMonthlyTurnOverQueueCount();
  }

  @Post('permanent-link-turn-over')
  schedulePermanentLinkTurnOver(
    @Body(ValidationPipe) dto: CurrentMagazineMonthDate,
  ) {
    return this.adminsService.schedulePermanentLinksTurnOver(dto);
  }

  @Get('permanent-link-turn-over')
  getSchedulePermanentLinkTurnOver() {
    return this.adminsService.getPermanentQueueCount();
  }

  @Get('generated-magazines/:year/:month/:customerId')
  @Serialize(GeneratedMagazineDomain)
  getGeneratedMagazine(
    @Param('year') year: string,
    @Param('month') month: string,
    @Param('customerId') customerId: CustomerId,
  ) {
    return this.adminsService.getGeneratedMagazine(customerId, year, month);
  }

  @Get(':year/:month/:customerId')
  getMagazine(
    @Param('year') year: string,
    @Param('month') month: string,
    @Param('customerId') customerId: CustomerId,
  ) {
    return this.adminsService.getMagazine(customerId, year, month);
  }

  @Patch(':year/:month/:customerId')
  @UsePipes(ValidationTransformPipe)
  updateMagazine(
    @Param('year') year: string,
    @Param('month') month: string,
    @Param('customerId') customerId: CustomerId,
    @Body() dto: UpdateMagazineDto,
  ) {
    return this.adminsService.updateMagazine(customerId, year, month, dto);
  }

  @Post(':id/:customerId/create-ticket')
  createTicket(
    @Param('id') id: string,
    @Param('customerId') customerId: CustomerId,
    @Param(CustomerPipeByIdentities) admin: CustomerDocument,
  ) {
    return this.adminsService.createTicket(id, customerId, admin);
  }
}
