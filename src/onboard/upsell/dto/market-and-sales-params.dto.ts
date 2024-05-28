import { SchemaId } from '@/internal/types/helpers';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { MarketingParameters, SalesParameters } from '../types/types';

export class MarketingAndSalesParamsDTO {
  @IsMongoId()
  @IsNotEmpty()
  sessionId: SchemaId;

  marketingParameters: MarketingParameters;

  salesParameters: SalesParameters;
}
