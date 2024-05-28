import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
export declare class DateComparisonRule implements ValidatorConstraintInterface {
    validate(value: Date, validationArguments?: ValidationArguments): boolean;
    defaultMessage(validationArguments?: ValidationArguments): string;
}
export declare function DateComparison(compareWith: string, maxDateDiff?: number): (object: any, propertyName: string) => void;
