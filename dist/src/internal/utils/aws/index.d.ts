import { MessageId } from 'aws-sdk/clients/ses';
import { SES } from 'aws-sdk';
export declare function getMessageIdsArray(awsSendResponse: Array<SES.SendBulkTemplatedEmailResponse>): Array<MessageId>;
