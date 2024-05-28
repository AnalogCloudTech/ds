import { PipeTransform } from '@nestjs/common';
import { SegmentsDto } from '@/internal/common/dtos/segments.dto';
export declare class ValidateSegmentsPipe implements PipeTransform {
    transform(dto: SegmentsDto): SegmentsDto;
}
