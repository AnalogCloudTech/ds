import { Segments } from '@/campaigns/email-campaigns/leads/domain/types';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { SegmentsDto } from '@/internal/common/dtos/segments.dto';
import { ObjectId } from 'mongoose';
import { ExistsInCms } from '@/cms/cms/validation-rules/exists-in-cms';

export class CreateOnDemandEmailDto implements SegmentsDto {
  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ExistsInCms(['templateDetails'])
  templateId: number;

  @ValidateIf((self) => !self.allSegments)
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  segments: Segments;

  @IsNotEmpty()
  @IsBoolean()
  allSegments: boolean;

  @IsMongoId()
  @IsOptional()
  customer: ObjectId;

  @IsOptional()
  @IsBoolean()
  sendImmediately: boolean;

  @ValidateIf((self) => !self.sendImmediately)
  @IsOptional()
  @IsDateString()
  scheduleDate: string;

  @IsNotEmpty()
  @IsString()
  timezone: string;
}
