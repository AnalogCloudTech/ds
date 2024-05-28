import { IAM } from 'aws-sdk';
export declare class IamService {
    private readonly iam;
    constructor(iam: IAM);
    getUser(): Promise<import("aws-sdk/lib/request").PromiseResult<IAM.GetUserResponse, import("aws-sdk").AWSError>>;
    getArn(): Promise<string>;
    getAccountIdFromArn(arn: string): number;
}
