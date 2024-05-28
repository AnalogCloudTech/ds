import { MessageId } from 'aws-sdk/clients/ses';
import { SES } from 'aws-sdk';

export function getMessageIdsArray(
  awsSendResponse: Array<SES.SendBulkTemplatedEmailResponse>,
): Array<MessageId> {
  return awsSendResponse.flatMap(
    (response: SES.SendBulkTemplatedEmailResponse) => {
      return response.Status.map(({ MessageId }) => MessageId);
    },
  );
}
