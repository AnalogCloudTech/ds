import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CmsService } from '@/cms/cms/cms.service';

@ValidatorConstraint({ name: 'ExistsInCms', async: true })
export class ExistsInCmsRule implements ValidatorConstraintInterface {
  constructor(private readonly cmsService: CmsService) {}

  async validate(value?: number, validationArguments?: ValidationArguments) {
    try {
      const methodName = validationArguments.constraints[0];
      await this.cmsService[methodName](value);
      return true;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.property} doesn't exists in CMS`;
  }
}

export function ExistsInCms(constraints?: any[]) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'ExistsInCms',
      target: object.constructor,
      propertyName: propertyName,
      constraints: constraints,
      validator: ExistsInCmsRule,
    });
  };
}
