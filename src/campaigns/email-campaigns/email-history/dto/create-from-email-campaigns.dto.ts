import { SchemaId } from '@/internal/types/helpers';

export class CreateFromEmailCampaignsDto {
  lead: SchemaId;
  status: string;
  relationId: SchemaId;
  relationType: string;
}
