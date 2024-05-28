import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCampaignDto {
  @IsNotEmpty()
  @IsOptional()
  campaignName?: string;

  @IsNotEmpty()
  @IsOptional()
  startDate?: Date;

  @IsNotEmpty()
  @IsOptional()
  status: string;

  @IsNotEmpty()
  @IsOptional()
  contenId: string;

  @IsNotEmpty()
  @IsOptional()
  customerId: string;
}
