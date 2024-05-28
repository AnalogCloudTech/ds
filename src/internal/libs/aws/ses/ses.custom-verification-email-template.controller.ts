import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCustomVerificationEmailDto } from '@/internal/libs/aws/ses/dto/create-custom-verification-email.dto';
import { SesService } from '@/internal/libs/aws/ses/ses.service';
import { UpdateCustomVerificationEmailDto } from '@/internal/libs/aws/ses/dto/update-custom-verification-email.dto';

@Controller({ path: 'ses/custom-verification-email-template', version: '1' })
export class SesCustomVerificationEmailTemplateController {
  constructor(private readonly sesService: SesService) {}

  @Post()
  public async create(
    @Body(ValidationPipe) dto: CreateCustomVerificationEmailDto,
  ) {
    return this.sesService.createDefaultCustomVerificationEmailTemplate(dto);
  }

  @Get(':name')
  public async get(@Param('name') name: string) {
    return this.sesService.getCustomVerificationEmailTemplate(name);
  }

  @Patch(':name')
  public async update(
    @Param('name') name: string,
    @Body(ValidationPipe) dto: UpdateCustomVerificationEmailDto,
  ) {
    return this.sesService.updateDefaultCustomVerificationEmailTemplate(
      name,
      dto,
    );
  }
}
