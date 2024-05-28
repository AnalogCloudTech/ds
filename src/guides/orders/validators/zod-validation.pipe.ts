import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  logger = new Logger(ZodValidationPipe.name);

  constructor(private schema: ZodSchema) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.schema.parse(value);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Validation Failed');
    }
  }
}
