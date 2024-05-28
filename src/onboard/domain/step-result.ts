import { Step, StepStatus } from './types';

export class StepResult {
  step: Step;
  status: StepStatus;
  description?: string;
}
