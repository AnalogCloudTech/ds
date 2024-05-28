import { Expose } from 'class-transformer';
import { IsMongoId, IsString } from 'class-validator';
import { OfferId, OfferType } from './types';

export class Addon {
  @IsMongoId()
  @Expose()
  offer: OfferId;

  @IsString()
  @Expose()
  type: OfferType;

  @IsString()
  @Expose()
  requirements: string;
}
