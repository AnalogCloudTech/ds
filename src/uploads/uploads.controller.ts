import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { UploadDomain } from '@/uploads/domain/upload';
import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import { S3Service } from '@/internal/libs/aws/s3/s3.service';

@Controller({ path: 'uploads', version: '1' })
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  @Serialize(UploadDomain)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Body() createUploadDto: CreateUploadDto,
  ) {
    const { path = '', ext, bucket, contentType } = createUploadDto;
    const uploadUrl = this.s3Service.preSignedUploadWithCustomer({
      bucket,
      path,
      ext,
      contentType,
      customer,
    });

    return this.uploadsService.create(customer, createUploadDto, uploadUrl);
  }

  @Get(':id')
  @Serialize(UploadDomain)
  findOne(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Param('id') id: string,
  ) {
    return this.uploadsService.findOne(customer, id);
  }

  @Get()
  @Serialize(UploadDomain)
  findAll(@Param(CustomerPipeByIdentities) customer: CustomerDocument) {
    return this.uploadsService.findAll(customer);
  }
}
