import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  ParseBoolPipe,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export default class BooleanTransformPipe implements PipeTransform {
  constructor(private readonly parseBoolPipe: ParseBoolPipe) {}
  async transform(
    value: string | undefined,
    metadata: ArgumentMetadata,
  ): Promise<boolean | undefined> {
    if (value === undefined) {
      return undefined;
    }

    try {
      return await this.parseBoolPipe.transform(value, metadata);
    } catch (error) {
      throw new BadRequestException(`Invalid boolean value`);
    }
  }
}
