import { HttpException, HttpStatus } from '@nestjs/common';
import { SNSMessage } from './parse-sns-response';

const ActionMapper = {
  delivery: extractDeliveryAction,
  complaint: extractComplaintAction,
  bounce: extractBounceAction,
  open: extractOpenAction,
  send: extractSendAction,
  deliverydelay: extractDeliveryDelayAction,
  click: extractClickAction,
};

type PossibleActions = keyof typeof ActionMapper;

function extractClickAction(snsMessage: SNSMessage): Array<string> {
  return snsMessage.mail.destination;
}

function extractDeliveryDelayAction(snsMessage: SNSMessage): Array<string> {
  return snsMessage.mail.destination;
}

function extractSendAction(snsMessage: SNSMessage): Array<string> {
  return snsMessage.mail.destination;
}

function extractOpenAction(snsMessage: SNSMessage): Array<string> {
  return snsMessage.mail.destination;
}

function extractBounceAction(msg: SNSMessage): string[] {
  const { bounce } = msg;

  if (!bounce) {
    throw new HttpException(
      {
        message: 'missing bounce object',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  const { bouncedRecipients } = bounce;

  return bouncedRecipients.map(({ emailAddress }) => emailAddress);
}

function extractDeliveryAction(msg: SNSMessage): string[] {
  const { delivery } = msg;

  if (!delivery) {
    throw new HttpException(
      {
        message: 'missing delivery object',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  const { recipients } = delivery;

  return recipients;
}

function extractComplaintAction(msg: SNSMessage): string[] {
  const { complaint } = msg;

  if (!complaint) {
    throw new HttpException(
      {
        message: 'missing complaint object',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  const { complainedRecipients } = complaint;

  return complainedRecipients;
}

export default function extractEmailsFromSNSMessage(msg: SNSMessage): string[] {
  const { eventType } = msg;
  const key = eventType.toLocaleLowerCase();

  if (ActionMapper[key]) {
    const action = <PossibleActions>eventType.toLocaleLowerCase();
    return ActionMapper[action](msg);
  }

  return [];
}

function extractDeliveryDelayDiagnosticCode(
  snsMessage: SNSMessage,
): Array<string> {
  if (snsMessage.eventType !== 'DeliveryDelay') {
    return [];
  }

  return snsMessage?.deliveryDelay?.delayedRecipients.map(
    (delayed) => delayed.diagnosticCode,
  );
}

export function extractDiagnosticCode(snsMessage: SNSMessage): Array<string> {
  if (snsMessage.bounce) {
    return extractBounceAction(snsMessage);
  }
  if (snsMessage.deliveryDelay) {
    return extractDeliveryDelayDiagnosticCode(snsMessage);
  }

  return [];
}
