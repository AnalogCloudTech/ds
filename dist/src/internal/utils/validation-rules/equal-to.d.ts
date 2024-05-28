import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
export declare class EqualToRule implements ValidatorConstraintInterface {
    validate(value?: any, validationArguments?: ValidationArguments): boolean;
    defaultMessage(validationArguments?: ValidationArguments): string;
}
export declare function EqualTo(compareWith: string): (object: any, propertyName: string) => void;
