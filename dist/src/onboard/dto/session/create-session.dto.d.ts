import { SchemaId } from '@/internal/types/helpers';
import { Step } from '@/onboard/domain/types';
export declare class CreateSessionDTO {
    offer: SchemaId;
    currentStep: Step;
    steps: Array<string>;
    customer?: SchemaId;
    marketingParameters?: any;
    salesParameters?: any;
}
