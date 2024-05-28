import { IsOptional, IsString } from 'class-validator';

export class ListTrackingPixelsDTO {
  @IsOptional()
  @IsString()
  offerCode?: string;
}
