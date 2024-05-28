import { SNS } from 'aws-sdk';
export declare class SnsService {
    protected readonly sns: SNS;
    constructor(sns: SNS);
    publish<T>(message: T, topicName: string): Promise<void | import("aws-sdk/lib/request").PromiseResult<SNS.PublishResponse, import("aws-sdk").AWSError>>;
    private getTopicArn;
    private listAllTopics;
}
