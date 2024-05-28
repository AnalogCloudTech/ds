import {
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
  Scope,
} from '@nestjs/common';
import { ImportLeadDto } from '@/campaigns/email-campaigns/leads/dto/import-lead.dto';
import { REQUEST } from '@nestjs/core';
import { get } from 'lodash';
import { extension } from 'mime-types';

@Injectable({ scope: Scope.REQUEST })
export class SetFileTransformValidatePipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request) {}

  transform(dto: ImportLeadDto): ImportLeadDto {
    dto.file = <Express.Multer.File>get(this.request, 'file');

    if (!dto.file) {
      throw new BadRequestException('file is Required');
    }

    const possibleExtensions = ['csv', 'xls', 'xlsx'];
    const possibleExtensionsString = possibleExtensions.join(', ');
    const fileExtension = <string>extension(dto.file.mimetype);
    const isValidExtension = possibleExtensions.includes(fileExtension);

    if (!isValidExtension) {
      throw new BadRequestException(
        `the file must be in ${possibleExtensionsString} type, ${fileExtension} provided`,
      );
    }

    return dto;
  }
}
