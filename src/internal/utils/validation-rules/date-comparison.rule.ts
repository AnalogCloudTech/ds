import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DateTime, Interval } from 'luxon';

@ValidatorConstraint({ name: 'DateComparison' })
export class DateComparisonRule implements ValidatorConstraintInterface {
  validate(value: Date, validationArguments?: ValidationArguments): boolean {
    const { object, constraints } = validationArguments;
    const [fieldToCompare, maxDateDiff] = constraints;
    const targetDate: Date = object[fieldToCompare];

    const diff = Interval.fromDateTimes(
      DateTime.fromJSDate(value),
      DateTime.fromJSDate(targetDate),
    );

    if (!diff.isValid) {
      return false;
    }

    const diffInDays = diff.length('day');
    return diffInDays <= maxDateDiff;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const { property, constraints } = validationArguments;
    const [fieldToCompare, maxDateDiff] = constraints;
    return `The difference between ${property} and ${fieldToCompare} must be a maximum of ${maxDateDiff} days`;
  }
}

export function DateComparison(compareWith: string, maxDateDiff = 90) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'DateComparison',
      target: object.constructor,
      propertyName,
      constraints: [compareWith, maxDateDiff],
      validator: DateComparisonRule,
    });
  };
}
