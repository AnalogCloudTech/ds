import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { transformSortBy } from '@/campaigns/email-campaigns/email-history/domain/types';

export class CampaignMetricsQueryParams {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  start?: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  end?: Date;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  textSearch?: string;

  // expect the following format:
  // sortBy: 'createdAt:-1,updatedAt:1'
  @IsNotEmpty()
  @IsOptional()
  @Transform(transformSortBy)
  sortBy?: { [key: string]: number };
}
