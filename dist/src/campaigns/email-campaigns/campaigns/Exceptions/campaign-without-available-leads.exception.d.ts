import { HttpException } from '@nestjs/common';
export declare class CampaignWithoutAvailableLeadsException extends HttpException {
    defaultResponseMessage: string;
    constructor(defaultResponseMessage?: string);
}
