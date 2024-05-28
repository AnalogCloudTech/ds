import { PipeTransform } from '@nestjs/common';

export class CustomerEmailLowerCasePipe implements PipeTransform {
  transform(object: { customerEmail: string }): object {
    if (!object.hasOwnProperty('customerEmail')) {
      return object;
    }

    return {
      ...object,
      customerEmail: object?.customerEmail?.toLowerCase(),
    };
  }
}
