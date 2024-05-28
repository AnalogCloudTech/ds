import { Logger } from '@nestjs/common';
import { StepResult } from '@/onboard/schemas/session.schema';
import { LoggerPayload } from '@/internal/utils/logger';
import { DateTime } from 'luxon';
import { CONTEXT_ERROR } from '@/internal/common/contexts';
import { Step } from '@/onboard/domain/types';

export class StepResultException extends Error {
  public logger = new Logger(StepResultException.name);

  constructor(currentStep: Step, stepResult: StepResult) {
    const message = `Step ${currentStep} failed`;
    super(message);

    const { name, stack } = this;

    const payload: LoggerPayload = {
      usageDate: DateTime.now(),
      exception: StepResultException.name,
      error: name,
      message,
      stack,
      stepResult,
    };

    this.logger.error({ payload }, stack, CONTEXT_ERROR);
  }
}
