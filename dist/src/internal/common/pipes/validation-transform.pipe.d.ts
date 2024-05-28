import { ValidationPipe } from '@nestjs/common';
import { ValidationPipeOptions } from '@nestjs/common/pipes/validation.pipe';
export declare class ValidationTransformPipe extends ValidationPipe {
    constructor(options?: ValidationPipeOptions);
}
