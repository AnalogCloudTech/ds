import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSmsCampaignDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Max(160)
  text: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  templateId: number;

  @ValidateIf((self: CreateSmsCampaignDto) => !self.allSegments)
  @IsOptional()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  segments: Array<number>;

  @IsNotEmpty()
  @IsBoolean()
  allSegments: boolean;
}
