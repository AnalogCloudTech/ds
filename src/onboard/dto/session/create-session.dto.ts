import { SchemaId } from '@/internal/types/helpers';
import { Step } from '@/onboard/domain/types';

export class CreateSessionDTO {
  offer: SchemaId;
  currentStep: Step;
  steps: Array<string>;
  customer?: SchemaId;
  marketingParameters?: any;
  salesParameters?: any;
}
