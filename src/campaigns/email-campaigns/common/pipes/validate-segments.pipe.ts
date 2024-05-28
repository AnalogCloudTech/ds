import { BadRequestException, PipeTransform } from '@nestjs/common';
import { get } from 'lodash';
import { SegmentsDto } from '@/internal/common/dtos/segments.dto';

export class ValidateSegmentsPipe implements PipeTransform {
  transform(dto: SegmentsDto): SegmentsDto {
    if (dto.allSegments) {
      dto.segments = [];
    }

    const hasError = !dto.allSegments && !get(dto, ['segments', 'length']);
    if (hasError) {
      throw new BadRequestException([
        'If allSegments is equal to "false", segments cannot be empty',
      ]);
    }

    return dto;
  }
}
