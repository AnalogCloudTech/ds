import { IsNotEmpty } from 'class-validator';

export class CreateCampaignDto {
  @IsNotEmpty()
  campaignName: string;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  contenId: string;

  @IsNotEmpty()
  customerId: string;
}
