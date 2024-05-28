import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { first, get } from 'lodash';

@ValidatorConstraint({ name: 'EqualTo' })
export class EqualToRule implements ValidatorConstraintInterface {
  validate(value?: any, validationArguments?: ValidationArguments) {
    const { object, constraints } = validationArguments;
    return value === get(object, first(constraints));
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const { property, constraints } = validationArguments;
    return `value of ${property} must be equals to ${constraints}`;
  }
}

export function EqualTo(compareWith: string) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'EqualTo',
      target: object.constructor,
      propertyName,
      constraints: [compareWith],
      validator: EqualToRule,
    });
  };
}
