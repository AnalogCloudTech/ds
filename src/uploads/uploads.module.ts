import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Upload, UploadSchema } from '@/uploads/schemas/upload.schema';
import { S3Module } from '@/internal/libs/aws/s3/s3.module';
import { UploadsRepository } from '@/uploads/uploads.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Upload.name, schema: UploadSchema }]),
    S3Module,
  ],
  controllers: [UploadsController],
  providers: [UploadsService, UploadsController, UploadsRepository],
  exports: [UploadsService],
})
export class UploadsModule {}
