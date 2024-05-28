import { IsArray, IsOptional, IsString, validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
export class OnboardMetricsDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  'customerInfo.email'?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  'customerInfo.firstName'?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  'customerInfo.lastName'?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  'coachInfo.email'?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  'coachInfo.name'?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  'offerDetails.title'?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  'marketingParameters.channel'?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  'marketingParameters.utmSource'?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  'marketingParameters.utmMedium'?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  'marketingParameters.utmContent'?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  'marketingParameters.utmTerm'?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  'marketingParameters.affiliateId'?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  'salesParameters.orderSystem'?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  'salesParameters.salesAgent'?: string[];
}

export class MarketingKeysDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  'marketingParameters.channel'?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  'marketingParameters.utmSource'?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  'marketingParameters.utmMedium'?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  'marketingParameters.utmContent'?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  'marketingParameters.utmTerm'?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  'marketingParameters.affiliateId'?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  'salesParameters.orderSystem'?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  'salesParameters.salesAgent'?: string[];
}

export class SearchSuggestionsDto {
  @IsOptional()
  @IsString()
  'customerInfo.email'?: string;

  @IsOptional()
  @IsString()
  'customerInfo.firstName'?: string;

  @IsOptional()
  @IsString()
  'customerInfo.lastName'?: string;

  @IsOptional()
  @IsString()
  'coachInfo.email'?: string;

  @IsOptional()
  @IsString()
  'coachInfo.name'?: string;

  @IsOptional()
  @IsString()
  'offerDetails.title'?: string;

  @IsOptional()
  @IsString()
  'marketingParameters.channel'?: string;

  @IsOptional()
  @IsString()
  'marketingParameters.utmSource'?: string;

  @IsOptional()
  @IsString()
  'marketingParameters.utmMedium'?: string;

  @IsOptional()
  @IsString()
  'marketingParameters.utmContent'?: string;

  @IsOptional()
  @IsString()
  'marketingParameters.utmTerm'?: string;

  @IsOptional()
  @IsString()
  'marketingParameters.affiliateId'?: string;

  @IsOptional()
  @IsString()
  'salesParameters.orderSystem'?: string;

  @IsOptional()
  @IsString()
  'salesParameters.salesAgent'?: string;

  constructor(data: Partial<SearchSuggestionsDto>) {
    Object.assign(this, plainToClass(SearchSuggestionsDto, data));
  }

  async serialize(): Promise<SearchSuggestionsDto> {
    const errors = await validate(this);
    if (errors.length > 0) {
      throw new Error('Validation failed');
    }
    return this;
  }
}

export class OnBoardMetricsDateRangeDto {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
