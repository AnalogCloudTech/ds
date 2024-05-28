import { Logger } from '@nestjs/common';
import { DateTime } from 'luxon';
export declare class LoggerPayload {
    usageDate: string | DateTime | Date;
    [key: string]: any;
}
export declare const LoggerWithContext: (context: string) => {
    provide: string;
    useFactory: () => Logger;
};
