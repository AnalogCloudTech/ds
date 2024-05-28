import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Upload, UploadDocument } from '@/uploads/schemas/upload.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateUploadDto } from '@/uploads/dto/create-upload.store.dto';

export class UploadsRepository {
  constructor(
    @InjectModel(Upload.name)
    private readonly uploadModel: Model<UploadDocument>,
  ) {}

  create(customer: CustomerDocument, createUploadDto: CreateUploadDto) {
    const downloadUrl = createUploadDto.uploadUrl.split('?')[0];
    const upload = new this.uploadModel({
      ...createUploadDto,
      customer: customer._id,
      downloadUrl,
    });
    return upload.save();
  }

  async findAll(customer: CustomerDocument) {
    const uploads = await this.uploadModel.find({
      customer: customer._id,
    });

    if (!uploads) {
      throw new HttpException(
        { message: 'Upload not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return uploads;
  }

  async findOne(uploadId: string, customer: CustomerDocument) {
    const upload = await this.uploadModel.findOne({
      _id: uploadId,
      customer: customer._id,
    });

    if (!upload) {
      throw new HttpException(
        { message: 'Upload not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return upload;
  }
}
