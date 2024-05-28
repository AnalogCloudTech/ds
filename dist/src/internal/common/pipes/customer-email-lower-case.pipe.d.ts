import { PipeTransform } from '@nestjs/common';
export declare class CustomerEmailLowerCasePipe implements PipeTransform {
    transform(object: {
        customerEmail: string;
    }): object;
}
