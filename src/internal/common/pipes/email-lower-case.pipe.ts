import { PipeTransform } from '@nestjs/common';

export class EmailLowerCasePipe implements PipeTransform {
  transform(object: { email: string }): object {
    if (!object.hasOwnProperty('email')) {
      return object;
    }

    return {
      ...object,
      email: object?.email?.toLowerCase(),
    };
  }
}
