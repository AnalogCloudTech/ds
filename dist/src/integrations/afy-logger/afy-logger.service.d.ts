import { HttpService } from '@nestjs/axios';
import { Subscription } from '@/payments/chargify/domain/types';
export declare const trialConversionEvents: {
    readonly BECOME_MEMBER: "become-member";
    readonly NEW_TRIAL: "new-trial";
};
export type TrialConversionEvents = (typeof trialConversionEvents)[keyof typeof trialConversionEvents];
export interface LogInput {
    customer: {
        email: string;
        name: string;
    };
    source: string;
    event: {
        name: string;
        namespace: string;
    };
    trace: string;
    tags?: string[];
}
export default class AfyLoggerService {
    private readonly http;
    constructor(http: HttpService);
    sendLog(data: LogInput): Promise<void>;
    sendLogTrialConversion(subscription: Subscription, eventName: TrialConversionEvents): Promise<void>;
}
