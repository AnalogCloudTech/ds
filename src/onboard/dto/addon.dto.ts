import { IsBoolean, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { OfferCode } from '../domain/types';

export class AddonDto {
  @IsString()
  @Expose()
  code: OfferCode;

  @IsBoolean()
  @Expose()
  accepted: boolean;
}
