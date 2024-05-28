import { HttpException } from '@nestjs/common';
export declare class CustomerPropertyNotFoundException extends HttpException {
    defaultResponseMessage: string;
    constructor(defaultResponseMessage?: string);
}
