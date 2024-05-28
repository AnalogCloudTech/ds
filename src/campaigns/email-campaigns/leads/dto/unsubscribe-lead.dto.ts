import { SchemaId } from '@/internal/types/helpers';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UnsubscribeLeadDTO {
  @IsMongoId()
  @IsNotEmpty()
  id: SchemaId;
}
