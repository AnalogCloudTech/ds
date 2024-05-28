import { HttpException } from '@nestjs/common';
export declare class CampaignWithoutAvailableEmailsException extends HttpException {
    defaultResponseMessage: string;
    constructor(defaultResponseMessage?: string);
}
