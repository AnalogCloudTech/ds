import { Injectable } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UploadsRepository } from '@/uploads/uploads.repository';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';

@Injectable()
export class UploadsService {
  constructor(private readonly uploadRepository: UploadsRepository) {}

  create(
    customer: CustomerDocument,
    createUploadDto: CreateUploadDto,
    uploadUrl: string,
  ) {
    return this.uploadRepository.create(customer, {
      ...createUploadDto,
      uploadUrl,
    });
  }

  findAll(customer: CustomerDocument) {
    return this.uploadRepository.findAll(customer);
  }

  findOne(customer: CustomerDocument, uploadId: string) {
    return this.uploadRepository.findOne(uploadId, customer);
  }
}
