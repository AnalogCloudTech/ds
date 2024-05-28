import { ExistsInCms } from '@/cms/cms/validation-rules/exists-in-cms';
import { Segments } from '@/campaigns/email-campaigns/leads/domain/types';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class UpdateOnDemandEmailDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  subject?: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ExistsInCms(['templateDetails'])
  @IsOptional()
  templateId?: number;

  @ValidateIf((self) => !self.allSegments)
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  @IsOptional()
  segments?: Segments;

  @IsNotEmpty()
  @IsBoolean()
  @IsOptional()
  allSegments?: boolean;

  @IsOptional()
  @IsBoolean()
  @IsOptional()
  sendImmediately?: boolean;

  @ValidateIf((self) => !self.sendImmediately)
  @IsOptional()
  @IsDateString()
  @IsOptional()
  scheduleDate?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  timezone?: string;
}
