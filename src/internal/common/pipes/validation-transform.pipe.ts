import { ValidationPipe } from '@nestjs/common';
import { ValidationPipeOptions } from '@nestjs/common/pipes/validation.pipe';

export class ValidationTransformPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    if (!options) {
      options = <ValidationPipeOptions>{
        transform: true,
      };
    } else {
      options = {
        ...options,
        transform: true,
      };
    }

    super(options);
  }
}
