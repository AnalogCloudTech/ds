import { SchemaId } from '@/internal/types/helpers';
import { MarketingParameters, SalesParameters } from '../types/types';
export declare class MarketingAndSalesParamsDTO {
    sessionId: SchemaId;
    marketingParameters: MarketingParameters;
    salesParameters: SalesParameters;
}
