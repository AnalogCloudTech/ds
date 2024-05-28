import { FileUploadService } from './file-upload.service';
import {
  Controller,
  HttpException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '@/auth/auth.service';

@Public()
@Controller({ path: 'upload', version: '1' })
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      return await this.fileUploadService.uploadPublicFile(
        file.buffer,
        file.mimetype,
      );
    } catch (error) {
      if (error instanceof Error) {
        //@ts-ignore
        throw new HttpException(error.response.data, error.response.status);
      }
    }
  }
}
