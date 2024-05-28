import { PipeTransform } from '@nestjs/common';
export declare class EmailLowerCasePipe implements PipeTransform {
    transform(object: {
        email: string;
    }): object;
}
