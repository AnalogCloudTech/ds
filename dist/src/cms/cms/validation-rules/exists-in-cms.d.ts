import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
import { CmsService } from '@/cms/cms/cms.service';
export declare class ExistsInCmsRule implements ValidatorConstraintInterface {
    private readonly cmsService;
    constructor(cmsService: CmsService);
    validate(value?: number, validationArguments?: ValidationArguments): Promise<boolean>;
    defaultMessage(validationArguments?: ValidationArguments): string;
}
export declare function ExistsInCms(constraints?: any[]): (object: any, propertyName: string) => void;
