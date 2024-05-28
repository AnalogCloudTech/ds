import { SchemaId } from '@/internal/types/helpers';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  PaymentProviders,
  PaymentStatus,
} from '@/onboard/upsell/schemas/tw-upsell.schema';

export class CreateUpsellReportDto {
  @IsNotEmpty()
  customer: object;

  @IsString()
  @IsNotEmpty()
  customerEmail: string;

  @IsNotEmpty()
  offer: object;

  @IsString()
  @IsNotEmpty()
  offerName: string;

  @IsEnum(PaymentProviders)
  @IsNotEmpty()
  paymentProvider: PaymentProviders;

  @IsEnum(PaymentStatus)
  @IsNotEmpty()
  paymentStatus: PaymentStatus;

  @IsMongoId()
  @IsNotEmpty()
  sessionId: SchemaId;

  @IsString()
  @IsOptional()
  channel?: string;

  @IsString()
  @IsOptional()
  utmSource?: string;

  @IsString()
  @IsOptional()
  utmMedium?: string;

  @IsString()
  @IsOptional()
  utmContent?: string;

  @IsString()
  @IsOptional()
  utmTerm?: string;
}
