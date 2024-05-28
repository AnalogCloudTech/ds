import { SchemaId } from '@/internal/types/helpers';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class SetCustomerPasswordDTO {
  @IsMongoId()
  @IsNotEmpty()
  sessionId: SchemaId;

  @IsNotEmpty()
  password: string;
}
