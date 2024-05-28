import { CustomerId } from '@/customers/customers/domain/types';
import {
  IsBoolean,
  IsMongoId,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateMagazineAdminDto {
  @IsString()
  month: string;

  @IsString()
  @Length(4, 4)
  year: string;

  @IsOptional()
  @IsString()
  userEmail?: string;

  @IsOptional()
  @IsMongoId()
  customerId?: CustomerId;

  @IsOptional()
  @IsBoolean()
  createTicket?: boolean;

  @IsOptional()
  @IsBoolean()
  isPreview?: boolean;
}
