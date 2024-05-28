import { HttpException } from '@nestjs/common';
export declare class SchedulingOnBusySlotException extends HttpException {
    defaultResponseMessage: string;
    constructor(defaultResponseMessage?: string);
}
