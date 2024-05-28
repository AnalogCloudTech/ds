import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CampaignStatus, ContentId, Segments } from '../domain/types';
import { ExistsInCms } from '@/cms/cms/validation-rules/exists-in-cms';
import { SegmentsDto } from '@/internal/common/dtos/segments.dto';
import { ObjectId } from 'mongoose';

export class CreateCampaignDto implements SegmentsDto {
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  allowWeekend: boolean;

  @IsDateString()
  startDate: string;

  @IsEnum(CampaignStatus)
  status: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ExistsInCms(['contentDetails'])
  contentId: ContentId;

  @IsBoolean()
  allSegments: boolean;

  @ValidateIf((self) => !self.allSegments)
  @IsArray()
  @IsOptional()
  @ArrayUnique()
  @ExistsInCms(['allSegmentsExists'])
  segments: Segments;

  @IsMongoId()
  @IsOptional()
  customerId: ObjectId;
}

export class UpdateCampaignDto {
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  allowWeekend?: boolean;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsEnum(CampaignStatus)
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ExistsInCms(['contentDetails'])
  @IsOptional()
  contentId?: ContentId;

  @IsBoolean()
  @IsOptional()
  allSegments?: boolean;

  @ValidateIf((self) => !self.allSegments)
  @IsArray()
  @IsOptional()
  @ArrayUnique()
  @ExistsInCms(['allSegmentsExists'])
  segments?: Segments;

  @IsMongoId()
  @IsOptional()
  customerId?: ObjectId;
}

export class UpdateCampaignStatusDto {
  @IsNotEmpty()
  @IsEnum(CampaignStatus)
  status: CampaignStatus;
}
